import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import Card from '../../components/Card'
import CardContent from '../../components/CardContent'
import CardIcon from '../../components/CardIcon'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Landscape from '../../assets/img/landscapebig.png'
import Sky from '../../assets/img/skybig.png'
import TallSky from '../../assets/img/tallsky.png'
import FAQInfo from '../../assets/img/FAQInfo.png'
import FAQ1 from '../../assets/img/FAQ1.png'
import FAQ2 from '../../assets/img/FAQ2.png'
import FAQ3 from '../../assets/img/FAQ3.png'
import useFarms from '../../hooks/useFarms'
import useYam from '../../hooks/useYam'
import { useWallet } from 'use-wallet'
import { getTotalValue } from '../../yamUtils'
import { getStats } from './utils'

export interface OverviewData {
  circSupply?: string,
  curPrice?: number,
  nextRebase?: number,
  targetPrice?: number,
  totalSupply?: string
}

const About: React.FC = () => {
  let [farms] = useFarms()
  const yam = useYam()
  const { account, connect } = useWallet()
  let [tvl, setTVL] = useState({ totalValue: new BigNumber(0), poolValues: {} })
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
  }, [yam, account, farms, farms[0]])

  let currentPrice = 0

  if (curPrice) {
    currentPrice = curPrice;
  }

  return (
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
          <Title>When the battles begin, this is how staking works:</Title>
          <StyledContainer>
            <StyledCard>
              <StyledCardContent>
                <StyledText>
                  1. Acquire WAR tokens through farming or buying on Uniswap.
                </StyledText>
                <img src={FAQ1} width='90%' />
                <StyledText>
                  2. Go to the Battle page and stake your WAR tokens. You only need to stake one time.
                </StyledText>
                <img src={FAQ2} width='90%' />
                <StyledText>
                  3. Once your tokens are staked, you’ll be able to choose which teams you want to
                  support for that day.
                </StyledText>
                <img src={FAQ3} width='90%' />
                <StyledText>
                  4. You must pick two teams in order to lock your vote in.
                </StyledText>
                <StyledText>
                  5. Confirm your vote and approve the transaction in your wallet for no fee. Your vote
                  is encrypted and recorded.
                </StyledText>
                <StyledText>
                  6. Votes take place over a 24 hour period starting at 16:00 UTC each day. The earlier
                  you vote the more yield you earn. Vote counts will not be made public during battle.
                  After 24 hours, whichever two teams win by majority eats 50% of the losers yield
                  and advances to the next round. Winners all share the spoils.
                </StyledText>
                <StyledText>
                  7. In order to battle the next day, you must submit your vote again.
                </StyledText>
                <StyledText>
                  8. Once you are staked in WAR, there is a 1.5% unstaking fee. This fee goes directly to
                  the people still staked in WAR.
                </StyledText>
                <StyledText>
                  9. Once you vote, you are locked in with your teams for the day. If you stake more tokens later in the day, they will be available for the next battle.
                </StyledText>
              </StyledCardContent>
            </StyledCard>
          </StyledContainer>
        </Page>
      </ContentContainer>
    </StyledCanvas>
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

const TopDisplayContainer = styled.div`
width: 40%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
  margin-top: 4vh;
  margin-bottom: 6vh;
`

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 30px;
  margin-left: 20px;
  margin-right: 20px;
`

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 3vh;
  max-width: 1000px;
  height: 1500px;
  width: 100%;
`

const StyledCard = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  border: 1px solid rgb(226, 214, 207);
  border-radius: 12px;
  box-shadow: rgb(247, 244, 242) 1px 1px 0px inset;
    background-color: #003677;
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
  text-align: left;
`

const StyledText = styled.p`
font-family: Alegreya;
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
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

export default About