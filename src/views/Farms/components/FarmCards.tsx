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
import { useWallet } from 'use-wallet'

import farmIcon from "../../../assets/img/farm-icon.png";
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

  const old_farms = farms.filter(farm => farm.season === 1);
  const current_farms = farms.filter(item => item.season === 2);

  //console.log("1: ", old_farms);
  //console.log("2: ", current_farms);


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
      <FarmIcon src={farmIcon}></FarmIcon>
      <LargeText>New Season 2 Farms (CLOSED)</LargeText>
      <DisclaimerLink href="https://medium.com/@yieldwars/yieldwars-season-2-farms-are-upon-us-heres-how-to-participate-bal-pool-tutorial-included-78a30028f61">
        Learn how to setup Balancer Pools
      </DisclaimerLink>
      <StyledCards>
        {!!current_rows[0].length && current_rows.map((farmRow, i) => (
          farmRow.map((farm, j) => (
            <React.Fragment key={j}>
              <FarmCard farm={farm} i={i + j} />
            </React.Fragment>
          ))
        ))}
      </StyledCards>
      <SmallSpace />

      <LargeText>Season 1 Farms (CLOSED)</LargeText>
      <Disclaimer>
        The pools below in pool 1 are CLOSED. Do not stake in them, you
        will not earn any yield.
              </Disclaimer>
      <StyledCards>
        {!!old_rows[0].length && old_rows.map((farmRow, i) => (
          farmRow.map((farm, j) => (
            <React.Fragment key={j}>
              <FarmCard farm={farm} i={i + j} />
            </React.Fragment>
          ))
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
  const [apr, setAPR] = useState(0)
  const yam = useYam()
  const { account, connect } = useWallet()

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
    const apr = farm.id !== `CHADS` && farm.id !== `UNIPOOL` && farm.id !== `BATTLEPOOL` ? await getAPR(farm, yam) : 0;
    setAPR(apr)
  }, [farm, setAPR])

  useEffect(() => {
    if (farm.contract && !apr && yam) {
      aprVal()
    }
  }, [farm, yam, account])

  if (farm.id === `UNIPOOL` || farm.id === `BATTLEPOOL` || farm.id === `YAM` || farm.id === `MEME` || farm.id === `PICKLE` || farm.id === 'WBTC' || farm.id === 'SNOW') { return null; }

  let content = (
    <Card>
      <CardContent>
        <StyledContent>
          <CardIcon>{farm.icon}</CardIcon>
          <StyledTitle>{farm.name}</StyledTitle>
          <DepositEarn>
            Deposit {farm.id}-WAR BPT
        {/* <span>Deposit {farm.id}</span>
        <span>Earn WAR</span> */}
          </DepositEarn>
          <Button
            disabled={false}
            text={`Select`}
            to={`/farms/${farm.id}`}
            size='xlg'
          />
          {farm.season === 2 ? (
            <StyledDetail>Emitted WAR/day: 3500</StyledDetail>
          ) :
            <SmallSpace />
          }

          {farm.season === 2 && farm.link ? <Link href={farm.link} target="_blank" rel="noopener noreferrer">
            Get BPT on Balancer
          </Link> : <Filler />}


        </StyledContent>
      </CardContent>
    </Card>
  )

  if (farm.season === 2) {
    return (
      <S2CardWrapper>
        {content}
      </S2CardWrapper>
    )
  }
  else {
    return (
      <S1CardWrapper>
        {/* {(farm.id === 'BASED' || farm.id === 'FARM') && <RainbowShadow />} */}
        {content}
      </S1CardWrapper>
    )
  }
}

const Filler = styled.div`height: 28px;`

const Link = styled.a`
font-family: "Gilroy";
  font-size: 18px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 10px;
`;

const FarmIcon = styled.img`
width: 80px;
height: 80px;
border: solid 2px rgba(255, 183, 0, 0.3);
border-radius: 50%;`

const SmallSpace = styled.div`
  height: 60px;
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
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(255, 190, 26);
`


const LargeText = styled.div`
  font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 20px;
`;

const Disclaimer = styled.div`
  margin-bottom: 20px;
  color: white;
  font-family: "Gilroy";
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  color: #ffffff;
`;

const DisclaimerLink = styled.a`
  margin: 30px;
  color: white;
  font-family: "Gilroy";
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
margin-top: 24px;
margin-bottom: 28px;
font-size: 18px;
line-height: 1.3;
`

const StyledCards = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-between;
width: 80%;
max-width: 1200px;
margin: 20px auto 20px auto;
` : styled.div`
margin-top: 40px;
  width: 100%;
`

const StyledRow = !isMobile() ? styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: ${props => props.theme.spacing[4]}px;
` : styled.div`
flex-direction: column;
width: 100%;
align-items: center;
`

const S1CardWrapper = !isMobile() ? styled.div`
position: relative;
  display: flex;
` : styled.div`
position: relative;
  display: flex;
  width: 275px;
  height: 370px;
  margin: 0 auto 20px auto;
`

const S2CardWrapper = !isMobile() ? styled.div`
position: relative;
  display: flex;
` : styled.div`
position: relative;
  display: flex;
  width: 275px;
  height: 370px;
  margin: 0 auto 20px auto;
`


const StyledTitle = styled.h4`
font-family: "Gilroy";
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
  font-family: "Gilroy";
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
