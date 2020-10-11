import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Uniswap from "../../assets/img/uniswap@2x.png";
import Page from "../../components/Page";

import { getAPR, getPoolEndTime } from "../../yamUtils";
import useYam from "../../hooks/useYam";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";

import Background from '../../assets/img/bg3.svg'
import Pool3 from "./Pool3";
import AnimeVideo from "../../assets/video/yw_anime.mp4";
import AnimeThumbnail from "../../assets/video/yw_anime_thumbnail.png";
import Landscape from "../../assets/img/landscapebig.png";
import Sky from "../../assets/img/skybig.png";
import TallSky from "../../assets/img/tallsky.png";
import useFarms from "../../hooks/useFarms";
import useFarm from "../../hooks/useFarm";
import { getTotalValue } from "../../yamUtils";
import { getStats } from "./utils";
import Cookie from "universal-cookie";
import VersusCard from "./VersusCard.jsx";
import SingleVersusCard from "./SingleVersusCard.jsx";
import BattleHistory from './PreviousBattles'
import OldBattleHistory from './OldPreviousBattles'
import Schedule from './Schedule'
import FightInstructions from '../../assets/img/flightinstructions.png'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

export interface OverviewData {
  circSupply?: string;
  curPrice?: number;
  nextRebase?: number;
  targetPrice?: number;
  totalSupply?: string;
}

const Battle: React.FC = () => {
  let [farms] = useFarms()
  const yam = useYam()
  //let [tvl, setTVL] = useState({ totalValue: new BigNumber(0), poolValues: {} })
  const { account, connect } = useWallet()
  let [battles, setBattles] = useState([])
  let [leaderboard, setLeaderboard] = useState([])
  let [previousBattles, setPreviousBattles] = useState([])
  let [schedule, setSchedule] = useState([])
  let [dailyQuestion, setDailyQuestion] = useState();

  let [oldLeaderboard, setOldLeaderboard] = useState([]);
  let [oldPreviousBattles, setOldPreviousBattles] = useState([]);

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

  /*const fetchTotalValue = useCallback(
    async pools => {
      const tv = await getTotalValue(pools, yam);
      setTVL(tv);
    },
    [yam, setTVL, setTVL]
  );*/

  useEffect(() => {
    if (yam && account && farms && farms[0]) {
      fetchStats();
    }
    /*if (yam && farms) {
      console.log(farms);
      fetchTotalValue(farms);
    }*/
    if (battles.length === 0) {
      axios.post(`${getServerURI()}/api/season-info`, ({ season: 1 })).then(res => {
        console.log("s1battlews");
        let lb = res.data.leaderboard.leaderboard.sort((a, b) => {
          return b.votes - a.votes;
        });
        console.log("s1battles", res.data);
        console.log(lb);
        setOldLeaderboard(lb);
        setOldPreviousBattles(res.data.history);
      }).catch(err => {
        console.log(err);
      })
      axios.get(`${getServerURI()}/api/battles`).then(res => {
        let lb = res.data.leaderboard.leaderboard.sort((a, b) => {
          return b.votes - a.votes;
        });
        console.log("battles", res.data);
        console.log(lb);
        setLeaderboard(lb);
        setPreviousBattles(res.data.history)
        setBattles(res.data.battles)
        setSchedule(res.data.schedule)
        setDailyQuestion(res.data.dailyQuestion);
      }).catch(err => {
        console.log(err);
      })
    }
  }, [yam, account, farms, farms[0]]);

  let leaderboardContent;
  let oldLeaderboardContent;

  if (farms[0]) {
    leaderboard = leaderboard.slice(0, 5);
    leaderboardContent = leaderboard.map((item, index) => {
      let pool = farms.find(farm => farm.id === item.pool);
      let rank = "th";
      if (index === 0) rank = "st";
      if (index === 1) rank = "nd";
      return (
        <LeaderBoardItem key={index}>
          <StyledContent>
            {index + 1}
            {rank}
            <StyledCardIcon>{pool.icon}</StyledCardIcon>
            <StyledTitle>{pool.name}</StyledTitle>
            <StyledVotes>{item.votes.toFixed(2)} votes</StyledVotes>
          </StyledContent>
        </LeaderBoardItem>
      )
    })
    oldLeaderboard = oldLeaderboard.slice(0, 5);
    oldLeaderboardContent = oldLeaderboard.map((item, index) => {
      let pool = farms.find(farm => farm.id === item.pool);
      let rank = "th";
      if (index === 0) rank = "st";
      if (index === 1) rank = "nd";
      return (
        <LeaderBoardItem key={index}>
          <StyledContent>
            {index + 1}
            {rank}
            <StyledCardIcon>{pool.icon}</StyledCardIcon>
            <StyledTitle>{pool.name}</StyledTitle>
            <StyledVotes>{item.votes.toFixed(2)} votes</StyledVotes>
          </StyledContent>
        </LeaderBoardItem>
      )
    })
  }

  let currentPrice = 0;

  if (curPrice) {
    currentPrice = curPrice;
  }

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            {/* <TopDisplayContainer>

              <DisplayItem>
                $War Price: $
                {currentPrice
                  ? Number(currentPrice).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                  })
                  : "-"}
              </DisplayItem>
              <DisplayItem>Supply: 2,800,000</DisplayItem>
            </TopDisplayContainer> */}
            <Video controls poster={AnimeThumbnail}>
              <source src={AnimeVideo} type="video/mp4" />
            </Video>
            {/* <StyledA
              href="https://uniswap.info/token/0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde"
              target="_blank"
            /> */}
            <Title>Step 1: Stake $WAR to enter the battle</Title>
            <Pool3 />
            {battles.length > 0 &&
              <Title>Step 2: Vote for the armies you will fight for</Title>
            }
            {battles.length === 2 && <VersusCard battles={battles} question={dailyQuestion} />}
            {/* in case no battle, but still question */}
            {(battles.length === 1 || (battles.length !== 2 && dailyQuestion)) && <SingleVersusCard battles={battles} question={dailyQuestion} />}
            <Title>How the battles work </Title>
            <StyledCardContent>
              <img src={FightInstructions} alt="instructions" width="100%" />
            </StyledCardContent>
            <Title>Leaderboard</Title>
            <LeaderBoard>{leaderboardContent}</LeaderBoard>
            <Title>Schedule</Title>
            <Schedule schedule={schedule} />
            {previousBattles.length && <Title>Previous Battles</Title>}
            <BattleHistory history={previousBattles} />
            <Title>Season 1 Results</Title>
            <OldLeaderBoard>{oldLeaderboardContent}</OldLeaderBoard>
            <OldBattleHistory history={oldPreviousBattles} />
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const Video = !isMobile() ? styled.video`
margin: 0 auto 40px auto;
width: 400px;
height: auto;
` : styled.video`
margin: 40px auto 40px auto;
width: 90vw;
height: auto;
`

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
  max-width: 730px;
  width: 100%;
	margin: 0 auto 80px auto;

`

const StyledA = !isMobile() ? styled.a`
  align-items: center;
  border: 0;
  border-radius: 18px;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: rgb(0, 34, 79) 6px 6px 12px, rgb(0, 54, 119) -12px -12px 24px -2px;
  background-image: url(${Uniswap});
  background-size: cover;
  background-position: center;
  height: 40px;
  justify-content: center;
  outline: none;
  padding-left: 10px;
  padding-right: 10px;
  opacity: 1;
  width: 180px;
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: white;
  margin-bottom: 40px;
` : styled.a`
align-items: center;
border: 0;
border-radius: 18px;
cursor: pointer;
display: flex;
font-size: 16px;
border-radius: 8px;
box-shadow: rgb(0, 34, 79) 6px 6px 12px, rgb(0, 54, 119) -12px -12px 24px -2px;
background-image: url(${Uniswap});
background-size: cover;
background-position: center;
height: 40px;
justify-content: center;
outline: none;
padding-left: 10px;
padding-right: 10px;
opacity: 1;
width: 180px;
font-family: "Gilroy";
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: white;
margin-bottom: 40px;
`

const StyledCardIcon = styled.div`
  background-color: #002450;
  font-size: 36px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  box-shadow: rgb(226, 214, 207) 4px 4px 8px inset,
    rgb(247, 244, 242) -6px -6px 12px inset;
`;


const LeaderBoardItem = !isMobile()
  ? styled.div`
      text-align: center;
      width: 175px;
      height: 200px;
      border-radius: 8px;
      border: solid 2px #0095f0;
      background-color: #003677;
      font-family: "Gilroy";
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    `
  : styled.div`
      text-align: center;
      width: 40%;
      height: 200px;
      border-radius: 8px;
      border: solid 2px #0095f0;
      background-color: #003677;
      font-family: "Gilroy";
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 20px;
    `;

const LeaderBoard = !isMobile() ? styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 70%;
  margin-bottom: 80px;
` : styled.div`
display: flex;
width: 90vw;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-evenly;
margin-bottom: 70px;
`;

const OldLeaderBoard = !isMobile() ? styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 70%;
  margin-bottom: 60px;
` : styled.div`
display: flex;
width: 90vw;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-evenly;
margin-bottom: 60px;
`;

const StyledVotes = styled.h4`
  margin: 0;
  font-family: "Gilroy";
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  padding: 0;
`;

const StyledTitle = styled.h4`
  margin: 0;
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  padding: 0;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`;

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
      letter-spacing: normal;
      color: #ffffff;
    `;

const Title = styled.div`
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin-bottom: 20px;
`;

const TopDisplayContainer = !isMobile()
  ? styled.div`
      width: 40vw;
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: space-evenly;
      margin: 16px auto 80px auto;
    `
  : styled.div`
      width: 40vw;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-content: center;
      justify-content: space-evenly;
      margin: 60px auto 40px auto;
      display: flex;
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

export default Battle;