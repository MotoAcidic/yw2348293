import React, { useCallback, useEffect, useState } from 'react'
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import Button from '../../components/Button'
import Card from '../../components/Card'
import CardContent from '../../components/CardContent'
import CardIcon from '../../components/CardIcon'
import Page from '../../components/Page'
import sushi from '../../assets/img/sushi.png'
import yamimg from '../../assets/img/yam.png'

import { getAPR, getPoolEndTime } from '../../yamUtils'
import useYam from '../../hooks/useYam'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import Pool3 from './Pool3'
import Landscape from '../../assets/img/landscapebig.png'
import Sky from '../../assets/img/skybig.png'
import TallSky from '../../assets/img/tallsky.png'
import useFarms from '../../hooks/useFarms'
import useFarm from '../../hooks/useFarm'
import { getTotalValue } from '../../yamUtils'
import { getStats } from './utils'
import Cookie from 'universal-cookie'
import VersusCard from './VersusCard.jsx'

import CountDown from './CountDown'

const cookie = new Cookie()

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

let vs = [{
  pool1: 'FARM',
  pool2: 'UNI'
}, {
  pool1: 'UNI',
  pool2: 'FARM'
}]

let leaderboard = ['FARM', 'UNI', 'FARM', 'UNI', 'FARM']

let schedule = [{
  date: 1,
  v1: {
    pool1: 'FARM',
    pool2: 'UNI'
  },
  v2: {
    pool1: 'FARM',
    pool2: 'UNI'
  }
}, {
  date: 2,
  v1: {
    pool1: 'FARM',
    pool2: 'UNI'
  },
  v2: {
    pool1: 'FARM',
    pool2: 'UNI'
  }
}]

export interface OverviewData {
  circSupply?: string,
  curPrice?: number,
  nextRebase?: number,
  targetPrice?: number,
  totalSupply?: string
}

const Battle: React.FC = () => {
  let [farms] = useFarms()
  const yam = useYam()
  let [tvl, setTVL] = useState({ totalValue: new BigNumber(0), poolValues: {} })
  const { account, connect } = useWallet()
  let [battles, setBattles] = useState([])
  // let [voted, setVoted] = useState(cookie.get('voted'))

  const [{
    circSupply,
    curPrice,
    // nextRebase,
    targetPrice,
    totalSupply,
  }, setStats] = useState<OverviewData>({})

  const fetchStats = useCallback(async () => {
    const statsData = await getStats(yam)
    setStats(statsData)
  }, [yam, setStats])

  const fetchTotalValue = useCallback(async (pools) => {
    const tv = await getTotalValue(pools, yam)
    setTVL(tv)
  }, [yam, setTVL, setTVL])

  useEffect(() => {
    if (yam && account && farms && farms[0]) {
      fetchStats()
    }
    if (yam && farms) {
      console.log(farms);

      fetchTotalValue(farms)
    }
    if (battles.length === 0) {
      axios.get('http://localhost:5000/api/battles').then(res => {
        setBattles(res.data.battles)

      }).catch(err => {
        console.log(err);

      })
    }
  }, [yam, account, farms, farms[0]])


  let leaderboardContent;
  let scheduleContent;

  if (farms[0]) {

    leaderboardContent = leaderboard.map((item, index) => {
      let pool = farms.find(farm => farm.id === item)
      let rank = 'th'
      if (index === 0)
        rank = 'st'
      if (index === 1)
        rank = 'nd'
      return (
        <LeaderBoardItem key={index}>
          <StyledContent>
            {index + 1}{rank}
            <CardIcon>{pool.icon}</CardIcon>
            <StyledTitle>{pool.id}</StyledTitle>
          </StyledContent>
        </LeaderBoardItem>
      )
    })

    scheduleContent = schedule.map((item, index) => {
      return (
        <ScheduleItem>
          Oct {item.date}
          <Versus>
            {item.v1.pool1}
                  VS
            {item.v1.pool2}
          </Versus>
          <Versus>
            {item.v2.pool1}
                  VS
            {item.v2.pool2}
          </Versus>
        </ScheduleItem>
      )
    })
  }

  let currentPrice = 0

  if (curPrice) {
    currentPrice = curPrice;
  }

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection>
          <StyledSky />
          <StyledLandscape />
        </BackgroundSection>
        <ContentContainer>
          <Page>
            <TopDisplayContainer>
              <DisplayItem>TVL: ${tvl && !tvl.totalValue.eq(0) ? Number(tvl.totalValue.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</DisplayItem>
              <DisplayItem>$War Price: ${currentPrice ? Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '-'}</DisplayItem>
              <DisplayItem>Supply: 2,800,000</DisplayItem>
            </TopDisplayContainer>
            <Title>Step 1: Stake WAR at least once to enter the battle</Title>
            <Pool3 />
            <Title style={{ marginTop: '4vh' }}>Step 2: Choose your victors</Title>
            {battles.length > 0 && <VersusCard battles={battles} />}
            {/* <Title>Leaderboard</Title>
            {isMobile() ? <MobileLeaderBoard>{leaderboardContent}</MobileLeaderBoard> : <LeaderBoard>{leaderboardContent}</LeaderBoard>}

            <Title>Schedule</Title>
            <Schedule>
              {scheduleContent}
            </Schedule> */}
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  )
}

const CountdownText = styled.div`
width: 595px;
  height: 30px;
  font-family: Alegreya;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`



const ScheduleVSCard = styled.div`
width: 175px;
  height: 157px;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677;
`

const Versus = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
`

const VerticalDivider = styled.div`
  width: 1px;
  height: 40vh;
  opacity: 0.5;
  background-color: #ffffff;
`

const ScheduleItem = styled.div`
display: flex;
flex-direction: column;
justify-content: space-evenly;
font-family: Alegreya;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const Schedule = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 60vh;
width: 65%;
`

const LeaderBoardItem = styled.div`
text-align: center;
width: 175px;
  height: 187px;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677;
  font-family: Alegreya;
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

const LeaderBoard = styled.div`
margin-top: 3vh;
display: flex;
flex-direction: row;
justify-content: space-evenly;
width: 70%;
height: 25vh;
`

const MobileLeaderBoard = styled.div`
margin-top: 3vh;
display: flex;
flex-direction: column;
justify-content: space-evenly;
`

const StyledTitle = styled.h4`
margin: 0;
font-family: Alegreya;
font-size: 25px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  padding: 0;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`

const StyledDetails = styled.div`
  text-align: center;
`

const StyledDetail = styled.div`
font-family: Alegreya;
font-size: 20px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const Divider = styled.div`
width: 780px;
  height: 2px;
  opacity: 0.5;
  background-color: #ffffff;
`

const VersusItem = styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
font-size: 30px;
`

const VersusContainer = styled.div`
  width: 60%;
  height: 75vh;
  font-family: Alegreya;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  display: flex;
flex-direction: column;
justify-content: space-evenly;
align-items: center;
`

const DisplayItem = styled.div`
color: white;
font-family: Alegreya;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const BottomButtonContainer = styled.div`
width: 84%;
margin-left: 8%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
`

const ShadedLine = styled.div`
margin-left: 20px;
color: #97d5ff;
`

const Line = styled.div`
display: flex;
flex-direction: row;
`

const InfoLines = styled.div`
width: 100%;
height: 50%;
display: flex;
flex-direction: column;
justify-content: space-evenly;
text-align: left;
margin: 3%;
font-family: SFMono;
  font-size: 40px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1px;
  color: #ffffff;
`

const Title = styled.div`
font-family: Alegreya;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-top: 1%;
`

const InfoDivider = styled.div`
margin-top: 1%;
  width: 100%;
  height: 5px;
  background-color: #97d5ff;
`

const InfoContainer = styled.div`
width: 1000px;
  height: 375px;
  border-radius: 8px;
  border: solid 4px #97d5ff;
  background-color: #003677;
  margin-top: 6vh;
  margin-bottom: 6vh;
`

const CountDownText = styled.div`
margin-top: 6vh;
font-family: Alegreya;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const SectionDivider = styled.div`
  width: 1100px;
  height: 2px;
  background-color: #00a1ff;
  margin-top: 6vh;
`

const LargeText = styled.div`
font-family: Alegreya;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const SmallText = styled.div`
font-family: Alegreya;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const TextContainer = styled.div`
width: 60%;
height: 20vh;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 3vh;
`

const TopDisplayContainer = styled.div`
width: 40%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
  margin-top: 4vh;
  margin-bottom: 6vh;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
`

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  height: 35vh;
  justify-content: space-around
`

const StyledSky = styled.div`
  width: 100%;
  height: 270vh;
  background-image: url(${TallSky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
`

const StyledLandscape = styled.div`
  width: 100vw;
  height: 45vh;
  background-image: url(${Landscape});
  background-size: cover;
  transform: translateY(-1px)
`

const BackgroundSection = styled.div`
  position: absolute;
  width: 100%;
  background-color: #154f9b;
`

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  background-color: #154f9b;
`
const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
`

export default Battle