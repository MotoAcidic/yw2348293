import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../components/Page";
import useYam from "../../hooks/useYam";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Background from '../../assets/img/bg3.svg'
import Pool3 from "./cryptobattles/Pool3";
import useFarms from "../../hooks/useFarms";
import { getWarStaked } from "../../yamUtils";
import { getStats } from "./cryptobattles/utils";
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
  let [farms] = useFarms()
  const yam = useYam()
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0)
  });
  const { account, connect } = useWallet()
  let [prevDayBattles, setPrevDayBattles] = useState([]);
  let [battles, setBattles] = useState([])
  let [schedule, setSchedule] = useState([])
  let [dailyQuestion, setDailyQuestion] = useState();

  const [
    {
      circSupply,
      curPrice,
      // nextRebase,
      targetPrice,
      totalSupply,
    },
    setStats
  ] = useState<OverviewData>({});

  const fetchStats = useCallback(async () => {
    const statsData = await getStats(yam);
    setStats(statsData);
  }, [yam, setStats]);

  const fetchWarStaked = useCallback(
    async pools => {
      const st = await getWarStaked(pools, yam);
      setWarStaked(st);
    },
    [yam, setWarStaked]
  );

  useEffect(() => {
    console.log("using effect");
    if (yam && account && farms && farms[0]) {
      fetchStats();
    }
    if (yam && farms) {
      console.log(farms);
      fetchWarStaked(farms);
    }
    if (battles.length === 0) {
      axios.get(`${getServerURI()}/api/battles`).then(res => {
        console.log("battles", res.data);
        setPrevDayBattles(res.data.prevDayBattles);
        setBattles(res.data.battles)
        setSchedule(res.data.schedule)
        setDailyQuestion(res.data.dailyQuestion);
      }).catch(err => {
        console.log(err);
      })
    }
  }, [yam, account, farms, farms[0]]);

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

const StyledLink = styled(NavLink)`
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
`

const AFKContent = styled.div`
margin-bottom: 30vh;
`

const BigContainer = styled.div`
display: flex;
flex-direction: column;
height: 90vh;
align-items: center;
justify-content: center;`

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