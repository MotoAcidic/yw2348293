import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import useYam from "../../hooks/useYam";
// import useBet from "../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import useFarms from "../../hooks/useFarms";
import { getWarStaked, getChessContracts, getChessBets, getPots, getPotVals } from "../../yamUtils";
import { NavLink } from 'react-router-dom'
import BalanceBar from "./BalanceBarSecondary";
import MarketsCountDown from "./CountDownSecondary";

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
    let potVals = await getPotVals(yam, bet._id)
    const choice1 = potVals.choice0Val
    const choice2 = potVals.choice1Val
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

  const connectMe = (e) => {
    e.preventDefault()
    connect('injected')
  }

  return (
    <VersusContainer to={`/market/${bet._id}`}>
      <Images>

        <ImgWrapper>
          <Candidate1 src={bet.pool1.graphic} />
        </ImgWrapper>
        <CountDownContainer>
          <MarketsCountDown battle={bet} />
        </CountDownContainer>
        {/* <Versus>VS</Versus> */}
        <ImgWrapper  >
          <Candidate2
            src={bet.pool2.graphic}
          />

        </ImgWrapper>
      </Images>
      <Description>
        {bet.description}
      </Description>
      {account ?
        <Info>
          {/* <BetAmount> */}
          <Volume>
            Volume:&nbsp;
                <Money>
              ${
                (currBets.choice1 + currBets.choice2).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              }
            </Money>
          </Volume>
          <BalanceBar bet={bet} votes1={currBets.choice1} votes2={currBets.choice2} />
          {/* </BetAmount> */}
        </Info> :
        <PleaseLogin onClick={e => connectMe(e)}>
          View Bets
        </PleaseLogin>
      }
    </VersusContainer>
  );
};

const CountDownContainer = styled.div`
position: absolute;
left: 50%;
top: 0;
z-index: 100001;`

const PleaseLogin = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 38px;
width: calc(100% - 3px);
margin-left: 3px;
font-size: 24px;
color: rgb(255,204,74);
border: 2px solid rgba(255, 183, 0, 0.3);
border-top: none;
border-radius: 0 0 4px 4px;
`

const Volume = styled.div`
font-family: "SF Mono Semibold";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
display: flex;
font-size: 12px;
align-items: flex-end;
width: 40%;
min-width: 200px;
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
flex-direction: row;
height: calc(100% - 24px);
justify-content: space-between;
padding-bottom: 20px;
padding-top: 10px;
padding-right: 2%;
width: 100%;
align-items: center;`

const Description = styled.div`
font-family: "GilroyMedium";
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: white;
font-size: 16px;
text-align: left;
padding: 0.5% 2% 0.5% 2%;
position: absolute;
min-height: 9%;
bottom: 42px;
width: 96%;
background: rgba(0,0,0,0.9);
`

const Info = styled.div`
height: 40px;
width: calc(93% + 2px);
padding: 0 4% 0 3%;
display: flex;
align-items: center;
justify-content: space-between;
bottom: 0;
border-radius: 0 0 8px 8px;
background: rgba(0,0,0,0.7);
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
border-radius: 6px 0 0 0;
cursor: pointer;
object-fit: cover;
border: 5px solid black;
border-right: 2px solid white;
`

Candidate2 = styled.img`
width: calc(100% - 5px);
height: calc(100% - 10px);
border-radius: 0 6px  0;
cursor: pointer;
object-fit: cover;
border: 5px solid black;
border-left: 2px solid black;
`

const Images = styled.div`
height: calc(100% - 40px);
display: flex;
position: relative;`

const VersusContainer = !isMobile() ? styled(NavLink)`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
align-items: center;
font-size: 30px;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px 8px 0 0;
background-color: rgba(256,256,256,0.08);
text-decoration: none;
position: relative;
border-radius: 8px;
` : styled.div`
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