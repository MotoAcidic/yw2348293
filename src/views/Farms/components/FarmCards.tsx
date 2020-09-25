import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Countdown, { CountdownRenderProps } from 'react-countdown'

import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'

import useFarms from '../../../hooks/useFarms'

import { Farm } from '../../../contexts/Farms'

import { getAPR, getPoolEndTime } from '../../../yamUtils'
import useYam from '../../../hooks/useYam'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}


const FarmCards: React.FC = () => {
  let [farms] = useFarms()


  let rows = farms.reduce<Farm[][]>((farmRows, farm) => {
    const newFarmRows = [...farmRows]
    if (newFarmRows[newFarmRows.length - 1].length === 3) {
      newFarmRows.push([farm])
    } else {
      newFarmRows[newFarmRows.length - 1].push(farm)
    }
    return newFarmRows
  }, [[]])

  if (isMobile()) {
    return (
      <MobileStyledCards>
        {!!farms.length && farms.map((farm, i) => (
          <StyledRow key={i}>
            <React.Fragment>
              <FarmCard farm={farm} i={i} />
            </React.Fragment>
          </StyledRow>
        ))}
      </MobileStyledCards>
    )
  }

  return (
    <StyledCards>
      {!!rows[0].length && rows.map((farmRow, i) => (
        <StyledRow key={i}>
          {farmRow.map((farm, j) => (
            <React.Fragment key={j}>
              <FarmCard farm={farm} i={i + j} />
            </React.Fragment>
          ))}
        </StyledRow>
      ))}
    </StyledCards>
  )
}

/* : (
          <StyledLoadingWrapper>
            <Loader text="Loading farms" />
          </StyledLoadingWrapper>
        )
*/

interface FarmCardProps {
  farm: Farm,
  i: Number,
}
const WARNING_TIMESTAMP = 1598000400000

const FarmCard: React.FC<FarmCardProps> = ({ farm, i }) => {
  // const [startTime, setStartTime] = useState(0)
  // const [endTime, setEndTime] = useState(0)
  const [apr, setAPR] = useState(0)
  const yam = useYam()

  // const getStartTime = useCallback(async () => {
  //   const startTime = await getPoolStartTime(farm.contract)
  //   setStartTime(startTime)
  // }, [farm, setStartTime])

  // const getEndTime = useCallback(async () => {
  //   const endTime = await getPoolEndTime(farm.contract)
  //   setEndTime((endTime))
  // }, [farm, setStartTime])

  // const renderer = (countdownProps: CountdownRenderProps) => {
  //   const { days, hours, minutes, seconds } = countdownProps
  //   const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
  //   const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
  //   const totalhours = days * 24 + hours;
  //   const paddedHours = totalhours < 10 ? `0${totalhours}` : totalhours
  //   return (
  //     <span style={{ width: '100%' }}>{totalhours > 24 ? totalhours : paddedHours}:{paddedMinutes}:{paddedSeconds}</span>
  //   )
  // }

  // useEffect(() => {
  //   if (farm) {
  //     getStartTime()
  //     getEndTime()
  //   }
  // }, [farm, getStartTime, getEndTime])

  // const timeLeft = Number((endTime * 1000) - Date.now())
  // const poolActive = ((startTime * 1000)) - Date.now() <= 0
  // console.log(farm);

  const aprVal = useCallback(async () => {
    const apr = await getAPR(farm, yam)    
    setAPR(apr)
  }, [farm, setAPR])

  useEffect(() => {
    if (farm.contract && !apr && yam) {
      aprVal()
    }
  }, [farm, yam])

  // console.log(farm);
  

  return (
    <StyledCardWrapper>
      {(farm.id === 'CHADS' || farm.id === 'FARM') && <RainbowShadow />}
      <Card>
        <CardContent>
          <StyledContent>
            <CardIcon>{farm.icon}</CardIcon>
            <StyledTitle>{farm.name}</StyledTitle>
            <DepositEarn>
              <span>Deposit {farm.id}</span>
              <span>Earn WAR</span>
            </DepositEarn>
            <Button
              disabled={false}
              text={`Select`}
              to={`/farms/${farm.id}`}
              size='xlg'
            />
            {apr !== 0 && (
            <StyledDetails>
              <StyledDetail>APR</StyledDetail>
              <StyledDetail>{apr ? `${apr.toFixed(2)}%*` : ''}</StyledDetail>
            </StyledDetails>
            )}
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  )
}

const RainbowShadow = styled.div`
background: linear-gradient(
  45deg,
  rgba(255, 0, 0, 1) 0%,
  rgba(255, 154, 0, 1) 10%,
  rgba(208, 222, 33, 1) 20%,
  rgba(79, 220, 74, 1) 30%,
  rgba(63, 218, 216, 1) 40%,
  rgba(47, 201, 226, 1) 50%,
  rgba(28, 127, 238, 1) 60%,
  rgba(95, 21, 242, 1) 70%,
  rgba(186, 12, 248, 1) 80%,
  rgba(251, 7, 217, 1) 90%,
  rgba(255, 0, 0, 1) 100%
);
background-size: 300% 300%;
animation: dOtNsp 2s linear infinite;
border-radius: 12px;
filter: blur(6px);
position: absolute;
top: -2px;
right: -2px;
bottom: -2px;
left: -2px;
z-index: 0;
`

const DepositEarn = styled.div`
display: flex;
flex-direction: column;
margin-top: 8px;
margin-bottom: 24px;
font-size: 18px;
line-height: 1.3;
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  border-radius: 12px;
  filter: blur(4px);
  position: absolute;
  top: -2px; right: -2px; bottom: -2px; left: -2px;
  z-index: 1000000;
`

const StyledCards = styled.div`
margin-top: 3vh;
  width: 1100px;
`

const MobileStyledCards = styled.div`
margin-top: 3vh;
  width: 100vw;
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: ${props => props.theme.spacing[4]}px;
`

const StyledCardWrapper = styled.div`
position: relative;
  display: flex;
  width: 275px;
  height: 350px;

`

const StyledTitle = styled.h4`
font-family: Alegreya;
font-size: 28px;
font-weight: 700;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  padding: 0;
  margin: 8px 0px 0px;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: Alegreya;
font-size: 15px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  padding: 0;
`

const StyledDenominator = styled.div`
  text-align: center;
  margin-left: 8px;
  font-size: 18px;
  color: ${props => props.theme.color.grey[600]};
`

const StyledSpacer = styled.div`
  height: ${props => props.theme.spacing[4]}px;
  width: ${props => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
display: flex;
-webkit-box-pack: justify;
justify-content: space-between;
box-sizing: border-box;
border-radius: 8px;
background: rgb(20,91,170);
color: rgb(170, 149, 132);
width: 100%;
margin-top: 12px;
line-height: 32px;
font-size: 13px;
border: 1px solid rgb(230, 220, 213);
text-align: center;
padding: 0px 12px;
`

const StyledDetail = styled.div`
font-family: Alegreya;
line-height: 32px;
font-size: 18px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
letter-spacing: normal;
color: #ffffff;
}
`

export default FarmCards
