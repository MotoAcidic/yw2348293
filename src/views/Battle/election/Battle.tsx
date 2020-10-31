import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../../components/Page";
import useYam from "../../../hooks/useYam";
// import useBet from "../../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Background from '../../../assets/img/bg3.svg'
import Pool3 from "./Pool3";
import useFarms from "../../../hooks/useFarms";
import { getWarStaked } from "../../../yamUtils";
import { getStats } from "./utils";
import VersusCard from "./VersusCard.jsx";
import SingleVersusCard from "./VersusCardSingle.jsx";
import Schedule from './Schedule'
import Instructions from "./Instructions";
import Uniswap from "../../../assets/img/uniswap@2x.png";
import InbetweenCard from "./InbetweenCard";
import moment from "moment";
import BetModalElection from "./BetCardElection.jsx";
import Biden from "../../../assets/img/biden.png";
import Trump from "../../../assets/img/trump.png";
import AmericanFlag from "../../../assets/img/american-flag.jpg";
import useModal from '../../../hooks/useModal'
import Rules from './BetRulesModal'
import Swal from 'sweetalert2';
import './swal.css'



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
  // const bet = useBet()
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0),
    circSupply: new BigNumber(0)
  });
  const { account, connect } = useWallet()
  let [modal, setShowModal] = useState(false);
  let [prevDayBattles, setPrevDayBattles] = useState([]);
  let [battles, setBattles] = useState(
    {
      finished: false,
      farm1: {
        name: "Trump",
      },
      farm2: {
        name: "Biden",
      }
    }
  )
  let [schedule, setSchedule] = useState([])



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

  let currentPrice = curPrice || 0;

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

  const onClickTrump = () => {
    if (!account) {
      connect('injected')
    }
    onPresentTrumpModal()
  }

  const onClickBiden = () => {
    if (!account) {
      connect('injected')
    }
    onPresentBidenModal()
  }

  const [onPresentTrumpModal] = useModal(
		<BetModalElection
      battle={battles}
      candidateInfo={battles.farm1}
		/>
  )
  
  const [onPresentBidenModal] = useModal(
		<BetModalElection
      battle={battles}
      candidateInfo={battles.farm2}
		/>
	)

  useEffect(() => {
    console.log("using effect");
    if (yam && account && farms && farms[0]) {
      fetchStats();
    }
    if (yam && farms) {
      console.log(farms);
      fetchWarStaked(farms);
    }
  }, [yam, account, farms, farms[0]]);


  // betContract.methods.

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            {/* <TopDisplayContainer>
              <DisplayItem>
                $War Price:&nbsp;
              {currentPrice
                  ? `$${Number(currentPrice).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                  })}`
                  : "-"}
              </DisplayItem>
              <DisplayItem>
                Supply Staked:&nbsp;
              {warStaked && !warStaked.warStaked.eq(0)
                  ? `${Number(warStaked.warStaked.toFixed(2)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}%`
                  : "-"}
              </DisplayItem>
              <DisplayItem>
                Marketcap:&nbsp;
              {currentPrice && warStaked && !warStaked.circSupply.eq(0)
                  ? `$${Number(warStaked.circSupply.multipliedBy(currentPrice).dividedBy(10 ** 18).toFixed(2)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                  : "-"}
              </DisplayItem>
              <StyledA
                style={{ marginTop: "-5px" }}
                href="https://uniswap.info/token/0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde"
                target="_blank"
              />
            </TopDisplayContainer> */}
            <Title>Who Will Win?</Title>
            <VersusContainer>
              <VersusBackground>
                <Candidate1 src={Trump} onClick={onClickTrump} />

                <Candidate2 src={Biden} onClick={onClickBiden} />

              </VersusBackground>
            </VersusContainer>
            <Pool3 />
            <Rules />
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

let Candidate1
let Candidate2

Candidate2 = styled.img`
width: 50%;
height: 100%;
border-radius: 0 8px 8px 0;
cursor: pointer;
transition: all 0.2s ease-in-out;
&:hover {
  transform: scale(1.05);
  filter: brightness(110%) contrast(110%);
}
`


Candidate1 = styled.img`
width: 50%;
height: 100%;
border-radius: 8px 0 0 8px;
cursor: pointer;
transition: all 0.2s ease-in-out;
&:hover {
  transform: scale(1.05);
  filter: brightness(110%) contrast(110%);
}
`

const VersusBackground = styled.div`
width: 100%;
height: 100%;
display: flex;

`

const BigTitle = styled.div`
font-family: "Gilroy";
  font-size: 60px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: rgb(255, 204, 74);
  max-width: 80vw;
  margin: -30px auto 40px;
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
  background-image: url(${AmericanFlag});
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  filter: brightness(40%);
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


const TopDisplayContainer = !isMobile()
  ? styled.div`
        width:80vw;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin: 16px auto 10px auto;
      `
  : styled.div`
        width: 60vw;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin: 60px auto 40px auto;
        display: flex;
        flex-wrap: wrap;
      `;

const DisplayItem = !isMobile()
  ? styled.div`
        color: white;
        font-family: "Gilroy";
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #ffffff;
        opacity: 0.9;
      `
  : styled.div`
        width: 100%;
        margin-bottom: 10px;
        color: white;
        text-align: center;
        font-family: "Gilroy";
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        opacity: 0.9;
        color: #ffffff;
      `;

const StyledA = styled.a`
  cursor: pointer;
  display: flex;
  background-image: url(${Uniswap});
  background-size: cover;
  background-position: center;
  height: 30px;
  opacity: 0.9;
  width: 137px;
  transition: all .1s linear;
  &:hover {
    opacity: 1;
  }
`


const VersusContainer = !isMobile() ? styled.div`
width: 90vw;
display: flex;
align-items: center;
font-size: 30px;
margin: 0 auto 10vh auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(256,256,256,0.08);
` : styled.div`
margin: 0 0 40px 0;
width: 90vw;
display: flex;
flex-direction: column;
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
	background-color: rgba(256,256,256,0.08);`

export default Battle;