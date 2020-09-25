import React, { useCallback, useEffect, useState } from 'react'
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom'
import { useWallet } from 'use-wallet'
import styled from 'styled-components'

import Logo from '../../assets/img/logo.png'

import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import useModal from '../../hooks/useModal'
import { getStats } from './utils'
import useYam from '../../hooks/useYam'
import { OverviewData } from './types'


import Icon from '../../assets/img/icon.png'
import Landscape from '../../assets/img/landscapebig.png'
import TallSky from '../../assets/img/tallsky.png'
import Sky from '../../assets/img/skybig.png'
import StakeModal from './StakeModal'
import UnstakeModal from './UnstakeModal'
import WarPool from './WarPool'


import FarmCards from './components/FarmCards'
import CountDown from './components/CountDown'
import MobileCountDown from './components/MobileCountdown'

import { Account } from '../../yam/lib/accounts'
import { getStartTime, getTotalValue } from '../../yamUtils'
import useFarms from '../../hooks/useFarms'
import BigNumber from 'bignumber.js'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const { account, connect } = useWallet()
  const yam = useYam()
  let [farms] = useFarms()
  let [start, setStart] = useState(0)
  let [tvl, setTVL] = useState({ totalValue: new BigNumber(0), poolValues: {} })
  let launch = 1600963200000

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

  const fetchStartTime = useCallback(async () => {
    const st = await getStartTime(farms[0])
    setStart(st)
  }, [yam, farms, setStart])

  const fetchTotalValue = useCallback(async () => {
    const tv = await getTotalValue(farms)
    setTVL(tv)
  }, [yam, setTVL, setTVL])

  useEffect(() => {
    if (yam && account && farms[0] && farms[0].contract) {
      fetchStats()
      fetchStartTime()
      fetchTotalValue()
    }
  }, [yam, account])

  const [onPresentStake] = useModal(
    <StakeModal
      max={null}
      onConfirm={null}
      tokenName={null}
    />
  )

  const [onPresentUnstake] = useModal(
    <UnstakeModal
      max={null}
      onConfirm={null}
      tokenName={null}
    />
  )

  let currentPrice = 0

  if (curPrice) {
    currentPrice = curPrice;
  }

  let diffTime = launch - Math.round(new Date().getTime());
  
  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection>
          {isMobile() ? <MobileTallStyledSky /> : <TallStyledSky />}
          <StyledLandscape />
        </BackgroundSection>
        <ContentContainer>
          <Page>
            <CardContainer>
              {diffTime > 0 && (
                <div style={{ marginBottom: '5vh', marginTop: '5vh' }}>
                  <Title>The War Begins:</Title>
                  {isMobile() ? <MobileCountDown launchDate={launch} /> : <CountDown launchDate={launch} />}
                </div>
              )}
              <TopDisplayContainer>
                {/*<DisplayItem>TVL: {tvl && !tvl.totalValue.eq(0) ? tvl.totalValue.toString() : '-'}</DisplayItem>
                <DisplayItem>$War Price: ${currentPrice ? currentPrice : '-'}</DisplayItem>*/}
                <DisplayItem>Supply: 2,800,000</DisplayItem>
              </TopDisplayContainer>
              <TextContainer>
                <img src={Icon} width="82px" />
                <LargeText>Select a farm</LargeText>
                <SmallText>Earn WAR tokens by Farming the fields of Byzantium</SmallText>
              </TextContainer>
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
  )
}

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
width: 80vw;
height: 20vh;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 3vh;
`

const TopDisplayContainer = styled.div`
width: 40vw;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
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

const TallStyledSky = styled.div`
  width: 100%;
  height: 270vh;
  background-image: url(${TallSky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
`

const StyledSky = styled.div`
  width: 100%;
  height: 60vh;
  background-image: url(${Sky});
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

const MobileTallStyledSky = styled.div`
width: 100%;
height: 550vh;
background-image: url(${TallSky});
background-size: 100% 100%;
background-repeat: repeat-x;
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

export default Farms