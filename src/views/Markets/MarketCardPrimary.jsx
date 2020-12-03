import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import useYam from "../../hooks/useYam";
// import useBet from "../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import useFarms from "../../hooks/useFarms";
import { getWarStaked, getChessContracts, getChessBets, chessTVL } from "../../yamUtils";
import { NavLink } from 'react-router-dom'
import BalanceBar from "./BalanceBarPrimary"

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

const Battle = ({ bet }) => {
  const yam = useYam()
  const { account, connect, ethereum } = useWallet()
  const [currBets, setCurrBets] = useState({ choice1: 0, choice2: 0 });
  let [img1, setImg1] = useState(null)
  let [img2, setImg2] = useState(null)

  const getCurrBets = async () => {
    let tvl = await chessTVL(yam, account)
    console.log("tvl", tvl)
    const choice1 = tvl.trumpTotal
    const choice2 = tvl.bidenTotal
    console.log(choice1, choice2);
    setCurrBets({ choice1, choice2 });
  }

  useEffect(() => {
    if (yam) getCurrBets();
    if (!img1 || !img2) {
      let imag1 = new Image();
      imag1.onload = function () { setImg1(bet.pool1.graphic) }
      imag1.src = bet.pool1.graphic;
      let imag2 = new Image();
      imag2.onload = function () { setImg2(bet.pool2.graphic) }
      imag2.src = bet.pool2.graphic;
    }
  }, [yam, img1, img2]);

  if (!bet) {
    return null
  }
  return (
    <VersusContainer to={`/market/${bet._id}`}>
      <ImgWrapper>
        <Candidate1 src={img1} />
      </ImgWrapper>
      {/* <Versus>VS</Versus> */}
      <ImgWrapper  >
        <Candidate2
          src={img2}
        />
      </ImgWrapper>
      <Info>
        <Description>
          {bet.description}
        </Description>
        <BetAmount>
          {currBets.choice1 > 0 &&
            <>
              <Volume>
                Volume:&nbsp;
                <Money>
                  ${(currBets.choice1 + currBets.choice2).toFixed(2)}
                </Money>
              </Volume>
              <BalanceBar bet={bet} votes1={currBets.choice1} votes2={currBets.choice2} />
            </>
          }
        </BetAmount>
      </Info>
    </VersusContainer>
  );
};

const Volume = styled.div`
font-family: "SF Mono Semibold";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
display: flex;
font-size: 16px;
align-items: flex-end;
`

const Money = styled.div`
font-family: "SF Mono Semibold";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
font-size: 20px;
`

const BetAmount = styled.div`
display: flex;
flex-direction: column;
height: calc(100% - 24px);
justify-content: space-between;
padding-bottom: 20px;
padding-top: 10px;
padding-right: 2%;
width: 30%;
align-items: center;`

const Description = styled.div`
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
font-size: 24px;
width: 65%;
text-align: left;
padding: 0 2% 0 4%;`

const Info = styled.div`
position: absolute;
height: 17%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
bottom: 0;
background: rgba(0,0,0,0.7);
display: flex;
flex-direction: row;
`

const ImgWrapper = styled.div`
width: 50%;
position: relative;
height: 100%;
transition: all 0.2s ease-in-out;
// filter: brightness(100%) contrast(100%) grayscale(100%) ;
// &:hover {
// transition: all 0.2s ease-in-out;
//   filter: brightness(110%) contrast(110%) grayscale(80%);
//   transform: scale(1.05);
//   z-index: 2000000;
// }
`

let Candidate1
let Candidate2

Candidate1 = styled.img`
width: calc(100% - 5px);
height: calc(100% - 10px);
border-radius: 6px 0 0 6px;
cursor: pointer;
object-fit: cover;
border: 5px solid black;
border-right: 2px solid white;
`

Candidate2 = styled.img`
width: calc(100% - 5px);
height: calc(100% - 10px);
border-radius: 0 6px 6px 0;
cursor: pointer;
object-fit: cover;
border: 5px solid black;
border-left: 2px solid black;
`

const VersusContainer = !isMobile() ? styled(NavLink)`
position: relative;
width: 100%;
max-width: 1400px;
max-height: 650px;
height: 100%;
display: flex;
flex-direction: row;
align-items: center;
font-size: 30px;
margin: 0 auto 40px auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
background-color: rgba(256,256,256,0.08);
` : styled.div`
position: relative;
margin: 0 0 40px 0;
width: 90vw;
display: flex;
flex-direction: column;
font-family: "Gilroy";
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
	color: #ffffff;
	border-radius: 8px;
	border: solid 2px rgba(255, 183, 0, 0.3);
	background-color: rgba(256,256,256,0.08);`

export default Battle;