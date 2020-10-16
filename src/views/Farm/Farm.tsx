import React, { useMemo } from 'react'
import styled from 'styled-components'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { useParams } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import Sky from '../../assets/img/skybig.png'
import Landscape from '../../assets/img/landscapebig.png'
import Background from '../../assets/img/bg3.svg'

import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import { getContract } from '../../utils/erc20'


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
      <BackgroundSection />
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
`

const StyledCardWrapper = !isMobile() ? styled.div`
  display: flex;
  width: 280px;
  height: 350px;
  padding: 30px;
` : styled.div`
display: flex;
width: 80vw;
height: 300px;
border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(256,256,256,0.08);
margin-bottom: 50px;
`;

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: #154f9b;
`

const BackgroundSection = styled.div`
background-image: url(${Background});
position: fixed;
width: 100vw;
height: 100vh;
top: 0;
background-repeat: no-repeat;
background-size: cover;
`

const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
`

export default Farm
