import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../components/Page";

import { getAPR, getPoolEndTime } from "../../yamUtils";
import useYam from "../../hooks/useYam";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import NewVSCardSingle from "./NewVCardSingle";
import NewVSCard from "./NewVCard";

import Background from '../../assets/img/bg3.svg'
import Pool3 from "./Pool3";
import useFarms from "../../hooks/useFarms";
import useFarm from "../../hooks/useFarm";
import { getWarStaked } from "../../yamUtils";
import { getStats } from "./utils";
import Cookie from "universal-cookie";
import VersusCard from "./VersusCard.jsx";
import SingleVersusCard from "./SingleVersusCard.jsx";
import BattleHistory from './PreviousBattles'
import OldBattleHistory from './OldPreviousBattles'
import Schedule from './Schedule'
import Instructions from "./Instructions";
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
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0)
  });
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
      console.log(farms);
      fetchWarStaked(farms);
    }
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
      const votes = Number(item.votes.toFixed(0));

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
            <StyledVotes>{votes.toLocaleString(navigator.language, { minimumFractionDigits: 0 })} votes</StyledVotes>
          </StyledContent>
        </LeaderBoardItem>
      )
    })
    oldLeaderboard = oldLeaderboard.slice(0, 5);
    oldLeaderboardContent = oldLeaderboard.map((item, index) => {
      const votes = Number(item.votes.toFixed(0));
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
            <StyledVotes>{votes.toLocaleString(navigator.language, { minimumFractionDigits: 0 })} votes</StyledVotes>
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
            {!isMobile() ?
              <iframe style={{ width: "400px", height: "225px", margin: "10px auto 40px auto" }} src={`https://www.youtube.com/embed/wvYUTiFDHW4`} frameBorder="0" />
              :
              <iframe style={{ width: "90vw", height: "50.6vw", margin: "40px auto 40px auto" }} src={`https://www.youtube.com/embed/wvYUTiFDHW4`} frameBorder="0" />
            }
            <Title>Step 1: Stake $WAR to enter the arena</Title>
            <Pool3 />

            {battles.length === 2 && <NewVSCard battles={battles} question={dailyQuestion} />}
            {/* in case no battle, but still question */}
            {(battles.length === 1 || (battles.length !== 2 && dailyQuestion)) && <NewVSCardSingle battles={battles} question={dailyQuestion} />}

            {battles.length > 0 &&
              <Title>Step 2: Vote for the armies you will fight for</Title>
            }
            {battles.length === 2 && <VersusCard battles={battles} question={dailyQuestion} />}
            {/* in case no battle, but still question */}
            {(battles.length === 1 || (battles.length !== 2 && dailyQuestion)) && <SingleVersusCard battles={battles} question={dailyQuestion} />}
            {!battles.length &&
              <>
                <Title>Voting is closed. Check back soon to see the winners.</Title>
                <NextBattle>Next battle begins at 16:00 UTC</NextBattle>
              </>
            }
            <Title>How battles work </Title>
            <Instructions />
            <Title>Leaderboard</Title>
            <LeaderBoard>{leaderboardContent}</LeaderBoard>
            <Title>Schedule</Title>
            <Schedule schedule={schedule} />
            {previousBattles.length && <Title>Results</Title>}
            <BattleHistory history={previousBattles} />
            <Title>Season 1</Title>
            <S1Seperator />
            <OldLeaderBoard>{oldLeaderboardContent}</OldLeaderBoard>
            <OldBattleHistory history={oldPreviousBattles} />
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const NextBattle = styled.div`
  margin-bottom: 80px;
  font-size: 18px;
  font-family: "Gilroy";
  color: white;
`

const S1Seperator = !isMobile() ? styled.div`
width: 400px;
    height: 1px;
    margin-bottom: 40px;
    background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
` : styled.div`
width: 90vw;
    height: 1px;
    background-color: rgba(256,256,256,0.5);
    margin-bottom: 40px;
`

const StyledCardIcon = styled.div`
  
  font-size: 60px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
`;


const LeaderBoardItem = !isMobile()
  ? styled.div`
      text-align: center;
      min-width: 120px;
      width: 17%;
      height: 200px;
      border-radius: 8px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
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
      margin-bottom: 20px;
    `
  : styled.div`
      text-align: center;
      width: 40%;
      min-width: 200px;
      height: 200px;
      border-radius: 8px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
      font-family: "Gilroy";
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      padding: 20px 0 20px 0;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 20px;
    `;

const LeaderBoard = !isMobile() ? styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 80%;
  max-width: 1200px;
  margin-bottom: 60px;
` : styled.div`
display: flex;
width: 90vw;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-evenly;
margin-bottom: 60px;
`;

const OldLeaderBoard = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-between;
width: 80%;
max-width: 1200px;
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