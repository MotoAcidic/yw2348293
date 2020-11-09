import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import Page from "../../components/Page";
import Background from '../../assets/img/bg3.svg'
import Pool3 from "./cryptobattles/Pool3";
import moment from "moment";
import TopDisplayContainer from "../../components/TopDisplayContainer";
import BigCountDown from "./BigCountDown";
import { NavLink } from 'react-router-dom'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

export interface OverviewData {
  circSupply?: string;
  curPrice?: number;
  nextRebase?: number;
  targetPrice?: number;
  totalSupply?: string;
}

const Battle: React.FC = () => {
  const end = moment.utc("2020-11-16T20:00", "YYYY-MM-DDTHH:mm");

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            <TopDisplayContainer />
            <BigContainer>
              <AFKContent>
                <Title>We've got big things in store. Come back soon.</Title>
                <BigCountDown launchDate={end} />
                <Spacer />
                <StyledLink exact to="/results">looking to redeem rewards from election bet?</StyledLink>
              </AFKContent>
            </BigContainer>
            <Seperator />
            <Pool3 />
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const Spacer = styled.div`
height: 20px;`

const StyledLink = !isMobile() ? styled(NavLink)`
font-family: "Gilroy";
font-size: 14px;
font-stretch: normal;
font-style: normal;
line-height: 1;
text-decoration: underline !important;
letter-spacing: normal;
color: white;
margin-top: 60px;
  text-decoration: none;
  &:hover {
  color: #ffcb46;
  }
`: styled(NavLink)`
font-family: "Gilroy";
font-size: 14px;
font-stretch: normal;
font-style: normal;
line-height: 1;
text-decoration: underline !important;
letter-spacing: normal;
color: white;
margin-top: 20px;
margin-bottom: 50px;
  text-decoration: none;
  &:hover {
  color: #ffcb46;
  }
`

const AFKContent = !isMobile() ? styled.div`
margin-bottom: 30vh;
` : styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;`

const BigContainer = !isMobile() ? styled.div`
display: flex;
flex-direction: column;
height: 90vh;
align-items: center;
justify-content: center;` : styled.div`
display: flex;
flex-direction: column;
height: 65vh;
align-items: center;
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

const Title = styled.div`
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: rgb(255, 204, 74);

  max-width: 80vw;
  margin-bottom: 20px;
`;

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