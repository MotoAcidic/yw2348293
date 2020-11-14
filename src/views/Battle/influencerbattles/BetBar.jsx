import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../../components/Page";
import useYam from "../../../hooks/useYam";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Background from '../../../assets/img/bg3.svg'
import Pool3 from "./Pool3";
import useFarms from "../../../hooks/useFarms";
import { getWarStaked } from "../../../yamUtils";
import { getStats } from "./utils";
import VersusCard from "./VersusCard.jsx";
import SingleVersusCard from "./VersusCardSingle.jsx";
import PersVersusCard from "./PersVersusCard.jsx";
import SinglePersVersusCard from "./PersVersusCardSingle.jsx";
import Schedule from './Schedule'
import Instructions from "./Instructions";
import InbetweenCard from "./InbetweenCard";
import moment from "moment";

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


const Battle = ({ battles }) => {
  let [farms] = useFarms()
  const yam = useYam()
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0)
  });
  const { account, connect } = useWallet()

  let [totalBets, setTotalBets] = useState({ bets1: 0, bets2: 0, bets3: 0, bets4: 0 })

  useEffect(() => {
    console.log("using effect");
    if (yam && account && farms && farms[0]) {

    }
    if (yam && farms) {

    }
    if (battles.length === 0) {

    }

  }, [yam, account, farms, farms[0]]);

  console.log(battles);

  if (!battles.length) {
    return null
  }

  return (
    <BetsDisplayContainer>
      <Item>Current Bets:</Item>
      <Item>{battles[0].pool1.name} 💰${totalBets.bets1.toLocaleString()}</Item>
        |
      <Item>{battles[0].pool1.name} 💰${totalBets.bets2.toLocaleString()}</Item>
        |
      <Item>{battles[1].pool1.name} 💰${totalBets.bets3.toLocaleString()}</Item>
        |
      <Item>{battles[1].pool1.name} 💰${totalBets.bets4.toLocaleString()}</Item>
    </BetsDisplayContainer>
  );
};

const Item = styled.div`

`

const BetsDisplayContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
width: 50%;
font-family: "Gilroy";
margin-bottom: 5px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const BigTitle = styled.div`
font-family: "Gilroy";
  font-size: 60px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: rgb(255, 204, 74);
  max-width: 80vw;
  margin: -30px auto 40px;
`

const Seperator = !isMobile() ? styled.div`
  width: 1000px;
  height: 1px;
  margin-bottom: 80px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
` : styled.div`
  width: 90vw;
  height: 1px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
  margin-bottom: 80px;`

const NextBattle = styled.div`
  margin-bottom: 80px;
  font-size: 18px;
  font-family: "Gilroy";
  color: white;
`

const Title = styled.div`
font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin-bottom: 2px;
`;

const BackgroundSection = styled.div`
  background-image: url(${Background});
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background-repeat: no-repeat;
  background-size: cover;`

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  background-color: #154f9b;
`;

const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
`;

export default Battle;