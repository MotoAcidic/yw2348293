import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Switch } from "react-router-dom";

import { useWallet } from 'use-wallet'
import Page from '../../components/Page'
import Background from '../../assets/img/bg3.svg'
import axios from "axios";
import useYam from '../../hooks/useYam'
import { OverviewData } from '../Home/types'
import { getStats } from '../Home/utils'
import TopDisplayContainer from "../../components/TopDisplayContainer";
import Profile from "./Profile";
import Leaderboard from "./Leaderboard"
import Community from "./Community";

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

const Governance: React.FC = () => {

  const { account, connect } = useWallet()
  const yam = useYam()
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

  useEffect(() => {
    if (yam) {
      fetchStats()
    }
  }, [yam])

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            <TopDisplayContainer />
            <Leaderboard />
            {account ?

              <GovContent>
                <Community />
                <Profile />
              </GovContent>
              :
              <ConnectContainer onClick={() => connect('injected')}>
                <BigTitle>
                  Connect Your Wallet
          </BigTitle>
                <SubTitle>
                  to participate in governance
                </SubTitle>
              </ConnectContainer>
            }
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  )
}


const SubTitle = styled.div`
font-family: "Gilroy";
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
	color: white;
	margin-bottom: 10px;
`

const BigTitle = styled.div`
font-family: "Gilroy";
  font-size: 50px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: rgb(255, 204, 74);
  max-width: 80vw;
	margin: 0 auto 20px auto;
	display: flex;
	align-items: center;
`

const ConnectContainer = !isMobile() ? styled.div`
width: 600px;
height: 140px;
display: flex;
align-items: center;
justify-content: center;
font-size: 30px;
margin: 0 auto 5vh auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
flex-direction: column;
color: #ffffff;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
 background-color: rgba(4,2,43,0.4);
 cursor: pointer;
` : styled.div`
margin: 0 0 40px 0;
width: 90vw;
display: flex;
flex-direction: column;
padding-top: 20px;
font-family: "Gilroy";
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
	color: #ffffff;
	border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
 background-color: rgba(4,2,43,0.4); 
`


const Suggestions = styled.div`
width: 59%;
height: 500px;
background-color: rgba(256,256,256,0.1);
border-radius: 16px;
display: flex;
align-items: center;
justify-content: center;
`


const GovContent = styled.div`
width: 80vw;
max-width: 1200px;
display: flex;
flex-direction: row;
justify-content: space-between;`

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

export default Governance