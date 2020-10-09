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

//import { getAPR, getPoolEndTime } from '../../../yamUtils'
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


  console.log("igotdafarmz", farms);

  const old_farms = farms.filter(farm => farm.season === 1);
  const current_farms = farms.filter(item => item.season === 2);

  console.log("1: ", old_farms);
  console.log("2: ", current_farms);


  let old_rows = old_farms.reduce<Farm[][]>((farmRows, farm) => {
    const newFarmRows = [...farmRows]
    if (newFarmRows[newFarmRows.length - 1].length === 3) {
      newFarmRows.push([farm])
    } else {
      newFarmRows[newFarmRows.length - 1].push(farm)
    }
    return newFarmRows
  }, [[]]);
  let current_rows = current_farms.reduce<Farm[][]>((farmRows, farm) => {
    const newFarmRows = [...farmRows]
    if (newFarmRows[newFarmRows.length - 1].length === 3) {
      newFarmRows.push([farm])
    } else {
      newFarmRows[newFarmRows.length - 1].push(farm)
    }
    return newFarmRows
  }, [[]]);

  return (
    <FarmCardsContainer>
      <LargeText>New Season 2 Farms</LargeText>
      <StyledCards>
        {!!current_rows[0].length && current_rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} i={i + j} />
              </React.Fragment>
            ))}
          </StyledRow>
        ))}
      </StyledCards>
      <Space />
      <LargeText>Season 1 Farms</LargeText>
      <Disclaimer>
        The pools below in pool 1 are CLOSED. Do not stake in them, you
        will not earn any yield.
              </Disclaimer>
      <StyledCards>
        {!!old_rows[0].length && old_rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} i={i + j} />
              </React.Fragment>
            ))}
          </StyledRow>
        ))}
      </StyledCards>
    </FarmCardsContainer>
  )
}

interface FarmCardProps {
  farm: Farm,
  i: Number,
}
const WARNING_TIMESTAMP = 1598000400000

const FarmCard: React.FC<FarmCardProps> = ({ farm, i }) => {
  // const [startTime, setStartTime] = useState(0)
  // const [endTime, setEndTime] = useState(0)
  //const [apr, setAPR] = useState(0)
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

  /*const aprVal = useCallback(async () => {
    const apr = farm.id !== `CHADS` && farm.id !== `UNIPOOL` && farm.id !== `BATTLEPOOL` ? await getAPR(farm, yam) : 0;
    setAPR(apr)
  }, [farm, setAPR])

  useEffect(() => {
    if (farm.contract && !apr && yam) {
      aprVal()
    }
  }, [farm, yam])*/


  if (farm.id === `UNIPOOL` || farm.id === `BATTLEPOOL` || farm.id === `YAM` || farm.id === `MEME` || farm.id === `PICKLE`) {
    return null;
  }

  return (
    <StyledCardWrapper>
      {(farm.id === 'mbBASED' || farm.id === 'FARM') && <RainbowShadow />}
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
            <SmallSpace />
            {farm.season === 2 ? (
              <StyledDetail>APR: coming soon
                {/* <StyledDetail>{apr ? `${apr.toFixed(2)}%*` : 'Coming soon'}</StyledDetail> */}
              </StyledDetail>

            ) :
              <Space />}
            <SmallSpace />

            <Link href={farm.link} target="_blank" rel="noopener noreferrer"
            >
              Supply on Balancer
            </Link>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  )
}

const Link = styled.a`
font-family: Alegreya;
  font-size: 18px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`;


const Space = styled.div`
  height: 40px;
`;
const SmallSpace = styled.div`
  height: 10px;
`;

const FarmCardsContainer = styled.div``;

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
const StyledDetail = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0095f0;
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
`;

const Disclaimer = styled.div`
  margin: 30px;
  color: white;
  font-family: Alegreya;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  color: #ffffff;
`;

const DepositEarn = styled.div`
display: flex;
flex-direction: column;
margin-top: 8px;
margin-bottom: 24px;
font-size: 18px;
line-height: 1.3;
`

const StyledCards = !isMobile() ? styled.div`
margin-top: 3vh;
  width: 1100px;
` : styled.div`
margin-top: 3vh;
  width: 100%;
`

const StyledRow = !isMobile() ? styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: ${props => props.theme.spacing[4]}px;
` : styled.div`
flex-direction: column;
`

const StyledCardWrapper = styled.div`
position: relative;
  display: flex;
  width: 275px;
  height: 370px;

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

export default FarmCards
