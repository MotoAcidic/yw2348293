import React, { useMemo } from 'react'
import styled from 'styled-components'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { useParams } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import Page from '../../components/Page'

import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'

import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import { getContract } from '../../utils/erc20'

import Harvest from './components/Harvest'
import Stake from './components/Stake'
import Sky from '../../assets/img/skybig.png'
import Landscape from '../../assets/img/landscapebig.png'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

const Farm: React.FC = () => {
  const { farmId } = useParams()

  const {
    contract,
    depositToken,
    depositTokenAddress,
    earnToken,
    name,
    icon,
  } = useFarm(farmId) || {
    depositToken: '',
    depositTokenAddress: '',
    earnToken: '',
    name: '',
    icon: ''
  }
  console.log(farmId);


  const StyledCountdown = styled.div`
  color: ${props => props.theme.color.primary.main};
  font-size: 32px;
  font-weight: 700;
`

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <StyledCountdown>{days}:{paddedHours}:{paddedMinutes}:{paddedSeconds}</StyledCountdown>
    )
  }

  const { ethereum } = useWallet()

  const tokenContract = useMemo(() => {
    return getContract(ethereum as provider, depositTokenAddress)
  }, [ethereum, depositTokenAddress])

  const { onRedeem } = useRedeem(contract)

  const depositTokenName = useMemo(() => {
    return depositToken.toUpperCase()
  }, [depositToken])

  const earnTokenName = useMemo(() => {
    return earnToken.toUpperCase()
  }, [earnToken])

  let content = (
    <>
      <StyledCardWrapper>
        <Harvest poolContract={contract} />
      </StyledCardWrapper>
      <StyledCardWrapper>
        <Stake
          poolContract={contract}
          tokenContract={tokenContract}
          tokenName={depositToken.toUpperCase()}
        />
      </StyledCardWrapper>
    </>
  )

  return (
    <StyledCanvas>
      <BackgroundSection>
        {isMobile() ? <MobileStyledSky /> : <StyledSky />}
        {isMobile() ? <MobileStyledLandscape /> : <StyledLandscape />}
      </BackgroundSection>
      <ContentContainer>
        <Page>
          <PageHeader
            icon={icon}
            subtitle={`Deposit ${depositTokenName} and earn ${earnTokenName}`}
            title={name}
          />
          <StyledFarm>
            {isMobile() ? <MobileStyledCardsWrapper>{content}</MobileStyledCardsWrapper> : <StyledCardsWrapper>{content}</StyledCardsWrapper>}
            {/* <div>
              <Button
                onClick={onRedeem}
                size="lg"
                text="Harvest & Withdraw"
              />
            </div> */}
            <Spacer size="lg" />
          </StyledFarm>
        </Page>
      </ContentContainer>
    </StyledCanvas>
  )
}

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledCardsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 650px;
  margin-bottom: 10vh;
`

const MobileStyledCardsWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-evenly;
  margin-bottom: 10vh;
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: 300px;
  height: 350px;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677;
`

const MobileStyledCardWrapper = styled.div`
  display: flex;
  width: 80vw;
  height: 350px;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677;
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.grey[400]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
`
const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: #154f9b;
`

const StyledSky = styled.div`
  position: absolute;
  width: 100vw;
  height: 60%;
  background-image: url(${Sky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
`

const MobileStyledSky = styled.div`
  position: absolute;
  width: 100vw;
  height: 200vh;
  background-image: url(${Sky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
`

const StyledLandscape = styled.div`
position: absolute;
  width: 100%;
  height: 45%;
  top: 55vh;
  background-image: url(${Landscape});
  background-size: cover;
`

const MobileStyledLandscape = styled.div`
position: absolute;
  width: 100%;
  height: 45%;
  top: 200vh;
  background-image: url(${Landscape});
  background-size: cover;
`

const BackgroundSection = styled.div`

`

const ContentContainer = styled.div`
  position: absolute;
  width: 100vw;
  text-align: center;
`

export default Farm
