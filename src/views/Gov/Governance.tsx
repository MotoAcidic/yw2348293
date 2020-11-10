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

function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

const Vote: React.FC = () => {

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

  const fetchAccount = () => {
    axios.post(`${getServerURI()}/gov/get-account`,
      { address: account, }).then(res => {
        console.log("user", res.data);
      }).catch(err => {
        console.log(err);
      })
    console.log("my acct", account);
  }

  useEffect(() => {
    if (yam) {
      fetchStats()
      fetchAccount()
    }
  }, [yam])

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            <TopDisplayContainer />

          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  )
}

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

export default Vote