import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../components/Page";
import useYam from "../../hooks/useYam";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Background from '../../assets/img/bg3.svg'
import Pool3 from "./Pool3";
import useFarms from "../../hooks/useFarms";
import { getWarStaked } from "../../yamUtils";
import { getStats } from "./utils";
import VersusCard from "./VersusCard.jsx";
import SingleVersusCard from "./VersusCardSingle.jsx";
import Schedule from './Schedule'
import Instructions from "./Instructions";
import InbetweenCard from "./InbetweenCard";
import moment from "moment";

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

function switchingBattles() {
  let day = Math.floor((((Date.now() / 1000) - 1601406000) / 86400) + 1)
  let tomorrow = Math.floor(((Date.now() / 1000 + 3600 - 1601406000) / 86400) + 1)
  return (tomorrow > day);
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
  let [inbetween, setInbetween] = useState(false);
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
        if (res.data.inbetween) setInbetween(true);
        console.log("battles", res.data);
        setBattles(res.data.battles)
        setSchedule(res.data.schedule)
        setDailyQuestion(res.data.dailyQuestion);
      }).catch(err => {
        console.log(err);
      })
    }
  }, [yam, account, farms, farms[0]]);


  const battleFields = () => {
    if (switchingBattles()) {
      const minutesLeft = 60 - parseInt(moment().format("mm"))

      return (<>
        <Title>We're Switching Out Battles</Title>
        <NextBattle>Come back in {minutesLeft} minutes</NextBattle>
      </>)
    }
    if (!battles.length) {
      return (<>
        <Title>Loading Battles...</Title>
        <NextBattle />
      </>)
    } else if (!inbetween) {
      console.log('take1')
      return (<>
        {
          battles.length > 0 &&
          <Title>Step 2: Vote for the armies you will fight for</Title>
        }
        { battles.length === 2 && <VersusCard battles={battles} question={dailyQuestion} />}
        {/* in case no battle, but still question */}
        { (battles.length === 1 || (battles.length !== 2 && dailyQuestion)) && <SingleVersusCard battles={battles} question={dailyQuestion} />}
      </>
      )
    }
    console.log('take2')
    return (
      <InbetweenCard battles={battles} />
    )
  };

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            {!isMobile() ?
              <iframe title="promo" style={{ width: "500px", height: "281.25px", margin: "10px auto 40px auto" }} src={`https://www.youtube.com/embed/wvYUTiFDHW4`} frameBorder="0" />
              :
              <iframe title="promo" style={{ width: "90vw", height: "50.6vw", margin: "40px auto 40px auto" }} src={`https://www.youtube.com/embed/wvYUTiFDHW4`} frameBorder="0" />}
            <Title>Step 1: Stake $WAR to enter the arena</Title>
            <Pool3 />
            {battleFields()}
            <Title>How battles work </Title>
            <Instructions />
            <Title>Schedule</Title>
            <Schedule schedule={schedule} />
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const NextBattle = styled.div`
  margin-bottom: 80px;
  font-size: 18px;
  font-family: "Gilroy";
  color: white;
`

const Title = styled.div`
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
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