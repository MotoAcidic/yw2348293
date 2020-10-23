import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../components/Page";
import useYam from "../../hooks/useYam";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Background from '../../assets/img/bg3.svg'
import useFarms from "../../hooks/useFarms";
import Uniswap from "../../assets/img/uniswap@2x.png";
import { getWarStaked } from "../../yamUtils";
import { getStats } from "./utils";
import BattleHistory from './PreviousBattles'
import OldBattleHistory from './OldPreviousBattles'

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
    warStaked: new BigNumber(0),
    circSupply: new BigNumber(0)
  });
  const { account, connect } = useWallet()
  let [leaderboard, setLeaderboard] = useState([])
  let [previousBattles, setPreviousBattles] = useState([])
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
    console.log("using effect");
    if (yam && account && farms.length) {
      fetchStats();
    }
    if (yam && farms) {
      fetchWarStaked(farms);
    }
    if (!leaderboard.length) {
      axios.post(`${getServerURI()}/api/season-info`, ({ season: 1 })).then(res => {
        let lb = res.data.leaderboard.leaderboard.sort((a, b) => {
          return b.votes - a.votes;
        });
        console.log("old results", res.data, lb);
        setOldLeaderboard(lb);
        setOldPreviousBattles(res.data.history);
      }).catch(err => {
        console.log(err);
      })
      axios.post(`${getServerURI()}/api/results`).then(res => {
        console.log("results", res.data);
        let lb = res.data.leaderboard.leaderboard.sort((a, b) => {
          return b.votes - a.votes;
        });
        setLeaderboard(lb);
        setPreviousBattles(res.data.history)
      }).catch(err => {
        console.log(err);
      })
    }
  }, [yam, account, farms]);

  let leaderboardContent;
  let oldLeaderboardContent;

  if (farms.length) {
    console.log("optimize");
    leaderboard = leaderboard.slice(0, 5);
    leaderboardContent = leaderboard.map((item, index) => {
      const votes = Number(item.votes.toFixed(0));

      let pool = farms.find(farm => farm.id === item.pool);
      let rank = "th";
      if (index === 0) rank = "st";
      if (index === 1) rank = "nd";
      if (index === 2) rank = "rd";
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
      if (index === 2) rank = "rd";
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

  let currentPrice = curPrice || 0;

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            <TopDisplayContainer>
              <DisplayItem>
                $War Price:&nbsp;
              {currentPrice
                  ? `$${Number(currentPrice).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                  })}`
                  : "-"}
              </DisplayItem>
              <DisplayItem>
                Supply Staked:&nbsp;
              {warStaked && !warStaked.warStaked.eq(0)
                  ? `${Number(warStaked.warStaked.toFixed(2)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}%`
                  : "-"}
              </DisplayItem>
              <DisplayItem>
                Marketcap:&nbsp;
              {currentPrice && warStaked && !warStaked.circSupply.eq(0)
                  ? `$${Number(warStaked.circSupply.multipliedBy(currentPrice).dividedBy(10 ** 18).toFixed(2)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                  : "-"}
              </DisplayItem>
              <StyledA
                style={{ marginTop: "-5px" }}
                href="https://uniswap.info/token/0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde"
                target="_blank"
              />
            </TopDisplayContainer>
            <BigTitle>Season 2!</BigTitle>
            <Title>Leaderboard</Title>
            <LeaderBoard>{leaderboardContent}</LeaderBoard>
            <BattleHistory history={previousBattles} />
            <Seperator/>
            <Title>Season 1 Leaderboard</Title>
            <OldLeaderBoard>{oldLeaderboardContent}</OldLeaderBoard>
            <OldBattleHistory history={oldPreviousBattles} />
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const Seperator = !isMobile() ? styled.div`
  width: 1000px;
  height: 1px;
  margin-bottom: 80px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
` : styled.div`
  width: 90vw;
  height: 1px;
  background-color: rgba(256,256,256,0.5);
  margin-bottom: 80px;`

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

const TopDisplayContainer = !isMobile()
  ? styled.div`
        width:80vw;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin: 16px auto 80px auto;
      `
  : styled.div`
        width: 60vw;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin: 60px auto 40px auto;
        display: flex;
        flex-wrap: wrap;
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
        opacity: 0.9;
      `
  : styled.div`
        width: 100%;
        margin-bottom: 10px;
        color: white;
        text-align: center;
        font-family: "Gilroy";
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        opacity: 0.9;
        color: #ffffff;
      `;

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
  margin-bottom: 20px;`
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
  margin-bottom: 20px;`;

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