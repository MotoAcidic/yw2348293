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
import moment from "moment";
import { placeETHBet, getPots, getUserBet } from '../../../yamUtils'
import personalities from "./personalities";

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


const Battle = ({ battle1, id }) => {
  let [farms] = useFarms()
  const yam = useYam()
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0)
  });
  const { account, connect } = useWallet()
  const [farmBets, setFarmBets] = useState({ pot1: 0, pot2: 0 });
  const [farmBalances, setFarmBalances] = useState({ bal1: 0, bal2: 0 });
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const getYourBets = async () => {
      let precision = new BigNumber(10).pow(18)
      let balances = await getUserBet(yam, id, account);
      if (balances) {
        if (balances.choiceId === battle1.pool1.name) {

          setFarmBalances({ bal1: new BigNumber(balances.value).div(precision).toNumber(), bal2: 0 });
        } else {
          setFarmBalances({ bal1: 0, bal2: new BigNumber(balances.value).div(precision).toNumber() });
        }
      }
    }
    const getAllBets = async () => {
      let precision = new BigNumber(10).pow(18)
      let bets = await getPots(yam, id);
      setFetched(true);
      setFarmBets({ pot1: new BigNumber(bets[0].value).div(precision).toNumber(), pot2: new BigNumber(bets[1].value).div(precision).toNumber() });
    }
    console.log("got da yams???", yam)
    if (account && yam && !yam.defaultProvider) {
      getYourBets();
    }
    if (yam) {
      getAllBets()
    }
  }, [yam, account])



  if (!fetched) return (
    <Title>Who Will Win?</Title>
  )

  const battleDetail = {
    pers1: personalities.find(person => person.handle === battle1.pool1.name),
    pers2: personalities.find(person => person.handle === battle1.pool2.name)
  }
  return (
    <VotingBalance>
      <SubTitle>
        Betting Total: {(farmBets.pot1 + farmBets.pot2).toLocaleString()} $ETH
      </SubTitle>
      <StyledContent>
        <CardIcon src={battleDetail.pers1.picture} />
        <BalanceBar>
          <div style={{ backgroundColor: '#d270ff', height: '100%', borderRadius: "2px 0 0 2px", width: (100 * (farmBets.pot1 / (farmBets.pot1 + farmBets.pot2))) + '%', borderRight: "3px solid black" }} />
        </BalanceBar>
        <CardIcon src={battleDetail.pers2.picture} />

      </StyledContent>
      {
        (farmBalances.bal1 > 0 || farmBalances.bal2 > 0) &&
        <YourBetSection>
          <Item>Your Bets:</Item>
          {!farmBalances.bal1 > 0 && !farmBalances.bal2 > 0 ?
            <Item>none</Item>
            : null
          }
          {farmBalances.bal1 > 0 ? <Item>{battle1.pool1.name} 💰${farmBalances.bal1.toLocaleString()}</Item> : null}
          {farmBalances.bal2 > 0 ? <Item>{battle1.pool2.name} 💰${farmBalances.bal2.toLocaleString()}</Item> : null}
        </YourBetSection>
      }
      {/* <BetsDisplayContainer>
      <BetSection>
        <Item>Current Bets:</Item>
        <Item>{battle1.pool1.name} 💰$ETH: {farmBets.pot1.toLocaleString()}</Item>
        |
        <Item>{battle1.pool2.name} 💰$ETH: {farmBets.pot2.toLocaleString()}</Item>
      </BetSection>
    </BetsDisplayContainer> */}
    </VotingBalance>
  );
};


const SmallText = styled.div`
font-family: "Gilroy";
font-size: 20px;
font-weight: 100;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const CardIcon = styled.img`
	height: 50px;
  width: 50px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 15px;
  border: 2px solid #ffb700;
`

const BalanceBar = styled.div`
width: calc(100% - 110px);
height: 22px;
background-color: #0C438C;
border: 3px solid black;
border-radius: 8px;
`

const SubTitle = styled.div`
font-family: "Gilroy";
margin: 5px auto -5px;
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  
`

const VotingBalance = styled.div`
display: flex;
flex-direction: column;
width: 89%;
margin: 0 auto 5px auto;
`


const StyledContent = styled.div`
  display: flex;
	flex-direction: row;
  flex-wrap: nowrap;
  width: 70%;
  align-items: center;
  margin: auto;
`

const Item = styled.div`

`

const BetsDisplayContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
width: 70%;
font-family: "Gilroy";
margin-bottom: 0px;
margin-top: 15px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const BetSection = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
width: 40%
`

const YourBetSection = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
width: 20%;
margin: auto;
color: white;
margin-top: -10px;
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