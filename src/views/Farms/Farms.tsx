import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useWallet } from "use-wallet";
import styled from "styled-components";
import Page from "../../components/Page";
import useModal from "../../hooks/useModal";
import { getStats } from "./utils";
import useYam from "../../hooks/useYam";
import { OverviewData } from "./types";

import Background from '../../assets/img/bg3.svg'
import Uniswap from "../../assets/img/uniswap@2x.png";
import StakeModal from "./StakeModal";
import UnstakeModal from "./UnstakeModal";
import WarPool from "./WarPool";

import Roadmap from "./Roadmap";

import FarmCards from "./components/FarmCards";
import CountDown from "./components/CountDown";
import MobileCountDown from "./components/MobileCountdown";

import { Account } from "../../yam/lib/accounts";
import { getStartTime, getWarStaked } from "../../yamUtils";
import useFarms from "../../hooks/useFarms";
import BigNumber from "bignumber.js";
import TopDisplayContainer from '../../components/TopDisplayContainer'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

const Farms: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();
  const yam = useYam();
  let [farms] = useFarms();
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0),
    circSupply: new BigNumber(0)
  });
  let launch = 1601308800000;

  const [
    {
      circSupply,
      curPrice,
      // nextRebase,
      targetPrice,
      totalSupply
    },
    setStats
  ] = useState<OverviewData>({});

  const fetchStats = useCallback(async () => {
    const statsData = await getStats(yam);
    setStats(statsData);
  }, [yam, setStats]);

  const fetchWarStaked = useCallback(
    async pools => {
      const st = await getWarStaked(pools, yam);
      setWarStaked(st);
    },
    [yam, setWarStaked]
  );

  useEffect(() => {
    if (yam && account && farms && farms[0]) {
      fetchStats();
    }
    if (yam && farms) {
      fetchWarStaked(farms);
    }
  }, [yam, account, farms, farms[0]]);

  const [onPresentStake] = useModal(
    <StakeModal max={null} onConfirm={null} tokenName={null} />
  );

  const [onPresentUnstake] = useModal(
    <UnstakeModal max={null} onConfirm={null} tokenName={null} />
  );

  let currentPrice = 0;

  if (curPrice) {
    currentPrice = curPrice;
  }

  let diffTime = launch - Math.round(new Date().getTime());

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            <CardContainer>
              <Landing>

                <TopDisplayContainer />
                  
                <BigTitle>The Future of Betting, Tournaments, and Blockchain Battles Lives Here!</BigTitle>
                <Title>YieldWars is a next generation betting platform, where you can battle (and vote) on almost anything</Title>

                {!isMobile() ?
                  <iframe title="promo" style={{ width: "650px", height: "365.4px", margin: "10px auto 40px auto" }} src={`https://www.youtube.com/embed/wvYUTiFDHW4`} frameBorder="0" />
                  :
                  <iframe title="promo" style={{ width: "90vw", height: "50.6vw", margin: "40px auto 40px auto" }} src={`https://www.youtube.com/embed/wvYUTiFDHW4`} frameBorder="0" />
                }

              </Landing>
              <Seperator />
              <Roadmap />
             
              <Seperator />

              <WarPool />
              <FarmCards />
              {/*<SectionDivider />
              <CountDownText>The War Begins:</CountDownText>
              <CountDown launchDate={start} />
            <WarPool />*/}
            </CardContainer>
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const Title = !isMobile() ? styled.div`
font-family: "Gilroy";
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 70vw;
  margin: 0 auto 60px;
  ` : styled.div`
  font-family: "Gilroy";
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #ffffff;
    max-width: 70vw;
    margin: auto;
    `


const Seperator = !isMobile() ? styled.div`
  width: 1000px;
  height: 1px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
  ` : styled.div`
  width: 90vw;
  height: 1px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
  `

const BigTitle = !isMobile() ? styled.div`
  font-family: "Gilroy";
  font-size: 80px;
  text-transform: uppercase;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: rgb(255, 204, 74);
  max-width: 80vw;
  margin: 0 auto 20px;
` : styled.div`
font-family: "Gilroy";
font-size: 40px;
text-transform: uppercase;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: rgb(255, 204, 74);
max-width: 90vw;
margin: 0 auto 20px;
`

const Landing = styled.div`
min-height: 90vh;`

const StyledA = styled.a`
  cursor: pointer;
  display: flex;
  background-image: url(${Uniswap});
  background-size: cover;
  background-position: center;
  height: 30px;
  opacity: 0.9;
  width: 137px;
  transition: all .1s linear;

  &:hover {
    opacity: 1;
  }
`

// const TopDisplayContainer = !isMobile()
//   ? styled.div`
//       width:80vw;
//       display: flex;
//       flex-direction: row;
//       align-items: center;
//       justify-content: space-evenly;
//       margin: 16px auto 80px auto;
//     `
//   : styled.div`
//       width: 60vw;
//       display: flex;
//       flex-wrap: wrap;
//       flex-direction: row;
//       align-items: center;
//       justify-content: space-evenly;
//       margin: 60px auto 40px auto;
//       display: flex;
//       flex-wrap: wrap;
//     `;

const DisplayItem = !isMobile()
  ? styled.div`
      color: white;
      font-family: "Gilroy";
      font-size: 18px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      color: #ffffff;
      opacity: 0.9;
    `
  : styled.div`
      width: 100%;
      margin-bottom: 10px;
      color: white;
      font-family: "Gilroy";
      font-size: 18px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      text-align: center;
      letter-spacing: normal;
      opacity: 0.9;
      color: #ffffff;
    `;


const LargeText = styled.div`
  font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 20px;
`;

const SmallText = styled.div`
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`;

const TextContainer = styled.div`
  width: 80vw;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const BackgroundSection = styled.div`
background-image: url(${Background});
position: fixed;
width: 100vw;
height: 100vh;
top: 0;
background-repeat: no-repeat;
background-size: cover;
`

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

export default Farms;
