import React, { useCallback, useEffect, useState } from 'react'
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom'
import styled from 'styled-components'

import Button from '../../components/Button'
import Card from '../../components/Card'
import CardContent from '../../components/CardContent'
import CardIcon from '../../components/CardIcon'
import Page from '../../components/Page'
import sushi from '../../assets/img/sushi.png'
import yam from '../../assets/img/yam.png'


import Landscape from '../../assets/img/landscapebig.png'
import Sky from '../../assets/img/skybig.png'
import TallSky from '../../assets/img/tallsky.png'


import CountDown from './CountDown'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}


const Battle: React.FC = () => {

  let leaderboardContent = (
    <>
      <LeaderBoardItem>
        <StyledContent>
          1st
                <img src={yam} width="30%" />
          <StyledTitle>Yam</StyledTitle>
        </StyledContent>
      </LeaderBoardItem>
      <LeaderBoardItem>
        <StyledContent>
          2nd
                <img src={sushi} width="30%" />
          <StyledTitle>Sushi</StyledTitle>
        </StyledContent>
      </LeaderBoardItem>
      <LeaderBoardItem>
        <StyledContent>
          3rd
                <img src={yam} width="30%" />
          <StyledTitle>Yam</StyledTitle>
        </StyledContent>
      </LeaderBoardItem>
      <LeaderBoardItem>
        <StyledContent>
          4th
                <img src={sushi} width="30%" />
          <StyledTitle>Sushi</StyledTitle>
        </StyledContent>
      </LeaderBoardItem>
      <LeaderBoardItem>
        <StyledContent>
          5th
                <img src={yam} width="30%" />
          <StyledTitle>Yam</StyledTitle>
        </StyledContent>
      </LeaderBoardItem>
    </>
  )

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection>
          <StyledSky />
          <StyledLandscape />
        </BackgroundSection>
        <ContentContainer>
          <Page>
            {/*<div style={{ marginBottom: '5vh', marginTop: '5vh' }}>
              <Title>The War Begins</Title>
              <CountDown launchDate={1609459200000} />
            </div>*/}
            <VersusContainer>
              <VersusItem>
                <VersusCard>
                  <StyledContent>
                    <img src={yam} width="30%" />
                    <StyledTitle>Yam</StyledTitle>
                    <Button
                      disabled={true}
                      text={`Select`}
                      size='lg'
                    />
                    <StyledDetails><StyledDetail>200% Apr</StyledDetail></StyledDetails>
                  </StyledContent>
                </VersusCard>
                VS
                <VersusCard>
                  <StyledContent>
                    <img src={sushi} width="30%" />
                    <StyledTitle>Sushi</StyledTitle>
                    <Button
                      disabled={true}
                      text={`Select`}
                      size='lg'
                    />
                    <StyledDetails><StyledDetail>200% Apr</StyledDetail></StyledDetails>
                  </StyledContent>
                </VersusCard>
              </VersusItem>
              <Divider />
              <VersusItem>
                <VersusCard>
                  <StyledContent>
                    <img src={yam} width="30%" />
                    <StyledTitle>Yam</StyledTitle>
                    <Button
                      disabled={true}
                      text={`Select`}
                      size='lg'
                    />
                    <StyledDetails><StyledDetail>200% Apr</StyledDetail></StyledDetails>
                  </StyledContent>
                </VersusCard>
                VS
                <VersusCard>
                  <StyledContent>
                    <img src={sushi} width="30%" />
                    <StyledTitle>Sushi</StyledTitle>
                    <Button
                      disabled={true}
                      text={`Select`}
                      size='lg'
                    />
                    <StyledDetails><StyledDetail>200% Apr</StyledDetail></StyledDetails>
                  </StyledContent>
                </VersusCard>
              </VersusItem>
              <Divider />
            </VersusContainer>
            <Title>Leaderboard</Title>
            {isMobile() ? <MobileLeaderBoard>{leaderboardContent}</MobileLeaderBoard> : <LeaderBoard>{leaderboardContent}</LeaderBoard>}

            {/* <Title>Schedule</Title>
            <Schedule>
              <ScheduleItem>
                Sept 9th
                <Versus>
                  <ScheduleVSCard></ScheduleVSCard>
                  VS
                  <ScheduleVSCard></ScheduleVSCard>
                </Versus>
                <Versus>
                  <ScheduleVSCard></ScheduleVSCard>
                  VS
                  <ScheduleVSCard></ScheduleVSCard>
                </Versus>
              </ScheduleItem>
              <VerticalDivider />
              <ScheduleItem>
                Sept 10th
                <Versus>
                  <ScheduleVSCard></ScheduleVSCard>
                  VS
                  <ScheduleVSCard></ScheduleVSCard>
                </Versus>
                <Versus>
                  <ScheduleVSCard></ScheduleVSCard>
                  VS
                  <ScheduleVSCard></ScheduleVSCard>
                </Versus>
              </ScheduleItem>
            </Schedule> */}
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  )
}

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
font-family: "Gilroy";
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
`

const LeaderBoard = styled.div`
margin-top: 3vh;
display: flex;
flex-direction: row;
justify-content: space-evenly;
width: 60%;
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
font-family: "Gilroy";
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
font-family: "Gilroy";
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

const VersusCard = styled.div`
width: 240px;
  height: 247px;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677
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
  font-family: "Gilroy";
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
font-family: "Gilroy";
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
font-family: "SF Mono Semibold";
  font-size: 40px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1px;
  color: #ffffff;
`

const Title = styled.div`
font-family: "Gilroy";
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
font-family: "Gilroy";
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
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const SmallText = styled.div`
font-family: "Gilroy";
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
  width: 100%;
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