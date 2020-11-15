import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import Page from "../../components/Page";
import Background from '../../assets/img/bg3.svg'
import S2Battles from './S2Battles'
import S1Battles from './S1Battles'
import TwitterWar from './TwitterWar'
import Bet from "./Bet";
import TopDisplayContainer from "../../components/TopDisplayContainer";

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
  const [tab, setTab] = useState("twitterwar");

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            <TopDisplayContainer />
            <Tabs>
              {/* {tab === "influencer" ? <ActiveTab>influencer</ActiveTab> :
                <Tab onClick={() => setTab("influencer")}>influencer</Tab>} */}
              {tab === "twitterwar" ? <ActiveTab>Twitter War</ActiveTab> :
                <Tab onClick={() => setTab("twitterwar")}>Twitter War</Tab>}
              {tab === "election" ? <ActiveTab>Election</ActiveTab> :
                <Tab onClick={() => setTab("election")}>Election</Tab>}
              {tab === "season2" ? <ActiveTab>Season 2</ActiveTab> :
                <Tab onClick={() => setTab("season2")}>Season 2</Tab>}
              {tab === "season1" ? <ActiveTab>Season 1</ActiveTab> :
                <Tab onClick={() => setTab("season1")}>Season 1</Tab>}
            </Tabs>
            <ResultTop>
              <BorderTopLeft />
              <BorderTopRight />
            </ResultTop>
            <ResultPage>
              <BorderLeft />
              <ResultsContents>

                {tab === "twitterwar" && <TwitterWar />}
                {tab === "election" && <Bet />}
                {tab === "season2" && <S2Battles />}
                {tab === "season1" && <S1Battles />}

              </ResultsContents>
              <BorderRight />
            </ResultPage>
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const ResultsContents = styled.div`
display: flex;
flex-direction: column;
align-items: center;`

const BorderTopRight = !isMobile() ? styled.div`
width: calc(43vw - 303px);
// width: calc(43vw - 227px);
border-top: 1px solid white;
border-radius: 0 12px 0 0;
`: styled.div`
width: calc(43vw - 303px);
// width: calc(47.5vw - 115px);
border-top: 1px solid white;
border-radius: 0 12px 0 0;`

const BorderTopLeft = !isMobile() ? styled.div`
width: calc(43vw - 303px);
// width: calc(43vw - 227px);
border-top: 1px solid white;
border-radius: 12px 0 0 0;
` : styled.div`
width: calc(43vw - 303px);
// width: calc(47.5vw - 115px);
border-top: 1px solid white;
border-radius: 12px 0 0 0;
`

const BorderLeft = styled.div`
height: 60vh;
margin-left: -1px;
border-left: 1px solid white;
border-image: -webkit-linear-gradient(top, rgba(256,256,256,1), rgba(256,256,256,0)) 1 100%;
`;

const BorderRight = styled.div`
height: 60vh;
margin-right: -1px;
border-right: 1px solid white;
border-image: -webkit-linear-gradient(top, rgba(256,256,256,1), rgba(256,256,256,0)) 1 100%;
`;

const ResultPage = !isMobile() ? styled.div`
width: 86vw;
margin-top: -2px;
display: flex;
flex-direction: row;
justify-content: space-between;
` : styled.div`
width: 95vw;
max-width: 95vw
margin-top: -2px;
display: flex;
flex-direction: row;
justify-content: space-between;
`

const ResultTop = !isMobile() ? styled.div`
width: 86vw;
border: 1px solid white;
border-color: transparent white transparent white;
border-radius: 12px 12px 0 0;
height: 30px;
display: flex;
justify-content: space-between;
` : styled.div`
width: 95vw;
border: 1px solid white;
border-color: transparent white transparent white;
border-radius: 12px 12px 0 0;
height: 30px;
display: flex;
justify-content: space-between;
`
const ActiveTab = !isMobile() ? styled.div`
  width: 150px;
  height: 35px;
  border-radius: 8px 8px 0 0;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  border-bottom-color: transparent;
  font-size: 20px;
font-family: "Gilroy";
padding-top: 5px;
` : styled.div`
width: 75px;
height: 35px;
border-radius: 8px 8px 0 0;
color: white;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
border: 1px solid white;
border-bottom-color: transparent;
font-size: 14px;
font-family: "Gilroy";
padding-top: 5px;
`

const Tab = !isMobile() ? styled.div`
background-color: rgba(256,256,256, 0.1);
width: 150px;
  height: 35px;
  border-radius: 8px 8px 0 0;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  font-size: 20px;
font-family: "Gilroy";
padding-top: 5px;
` : styled.div`
background-color: rgba(256,256,256, 0.1);
width: 75px;
  height: 35px;
  border-radius: 8px 8px 0 0;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  font-size: 14px;
font-family: "Gilroy";
padding-top: 5px;
`

const Tabs = !isMobile() ? styled.div`
display: flex;
margin-bottom: -2px;
` : styled.div`
display: flex;
margin-bottom: -2px;
`

const Seperator = !isMobile() ? styled.div`
  width: 1000px;
  height: 1px;
  margin-bottom: 80px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
` : styled.div`
  width: 90vw;
  height: 1px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
  margin-bottom: 80px;`

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