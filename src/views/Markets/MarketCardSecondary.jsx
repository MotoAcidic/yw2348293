import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../components/Page";
import useYam from "../../hooks/useYam";
// import useBet from "../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Pool3 from "./unused/Pool3";
import useFarms from "../../hooks/useFarms";
import { getWarStaked, getChessContracts, getChessBets, chessTVL } from "../../yamUtils";
import { getStats } from "./unused/utils";

import Uniswap from "../../assets/img/uniswap@2x.png";
import Chess from "../../assets/img/chess.png";
import Rook from '../../assets/img/rook.png'
import { NavLink } from 'react-router-dom'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

function switchingBattles() {
  let day = Math.floor((((Date.now() / 1000) - 1601406000) / 86400) + 1)
  let tomorrow = Math.floor(((Date.now() / 1000 + 3600 - 1601406000) / 86400) + 1)
  return (tomorrow > day);
}

function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

const Battle = ({ bet }) => {
  let [farms] = useFarms()
  const yam = useYam()

  const { account, connect, ethereum } = useWallet()

  const [roughBets, setRoughBets] = useState({ pool1: 0, pool2: 0 });
  let [img1, setImg1] = useState(null)
  let [img2, setImg2] = useState(null)

  let imag1 = new Image();
  imag1.onload = function () { setImg1(bet.pool1.graphic) }
  imag1.src = bet.pool1.graphic;

  let imag2 = new Image();
  imag2.onload = function () { setImg2(bet.pool2.graphic) }
  imag2.src = bet.pool2.graphic;

  // const getRoughBets = async () => {
  //   let tvl = await chessTVL(yam, account)
  //   const trump = tvl.trumpTotal
  //   const biden = tvl.bidenTotal
  //   console.log(trump, biden);
  //   setRoughBets({ trump, biden });
  // }

  useEffect(() => {
    console.log("using effect");
    // if (yam && account && !roughBets.pool1) {
    //   getRoughBets();
    // }
  }, [yam]);

  const stopProp = (e) => {
    e.stopPropagation()
  }

  console.log("incbet", bet)

  return (
    <VersusContainer to={`/market/${bet._id}`}>
      <ImgWrapper>
        <Candidate1 src={bet.pool1.graphic} />
        <SmallTitle>
          {bet.pool1.name}
        </SmallTitle>
      </ImgWrapper>
      {/* <Versus>VS</Versus> */}
      <ImgWrapper  >
        <Candidate2
          src={bet.pool2.graphic}
        />
        <SmallTitle>
          {bet.pool2.name}
        </SmallTitle>
      </ImgWrapper>
    </VersusContainer>
  );
};

const SmallTitle = styled.div`
position: absolute;
height: 20%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
bottom: 0;
background: rgba(0,0,0,0.7);
font-size: 16px;
`


const Title = styled.div`
position: absolute;
height: 12%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
bottom: 0;
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