import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../../components/Page";
import useYam from "../../../hooks/useYam";
// import useBet from "../../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Pool3 from "./Pool3";
import useFarms from "../../../hooks/useFarms";
import { getWarStaked, getElectionContracts, getCurrentBets, electionTVL } from "../../../yamUtils";
import { getStats } from "./utils";

import Uniswap from "../../../assets/img/uniswap@2x.png";

import BetModalElection from "./BetCardElection.jsx";
import Biden from "../../../assets/img/biden.png";
import Trump from "../../../assets/img/trump.png";

import Vitalik from "../../../assets/img/chess_vitalik.jpg"
import Alexandra from "../../../assets/img/chess_alexandra.jpg"

import AmericanFlag from "../../../assets/img/american-flag.jpg";
import chainlinkLogo from "../../../assets/img/chainlinklogo.png";
import everipediaLogo from "../../../assets/img/everipedialogo.png";

import useModal from '../../../hooks/useModal'
import Rules from './BetRulesModal'
import useFarm from '../../../hooks/useFarm'
import Swal from 'sweetalert2';
import './swal.css'
import AccountModal from "../../../components/TopBar/components/AdvertisementFormModal";
import { getContract } from '../../../utils/erc20'
import { provider } from 'web3-core'
import PriceHistoryCard from "../../Results/PercentChangeCard";
import VotingBalance from "./VotingBalance";
import Countdown from './CountDown'

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

  const { account, connect, ethereum } = useWallet()
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
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0),
    circSupply: new BigNumber(0)
  });

  const fetchStats = useCallback(async () => {
    const statsData = await getStats(yam);
    setStats(statsData);
  }, [yam, setStats]);
  let [modal, setShowModal] = useState(false);
  let [candidate, setCandidate] = useState(battles.farm1);
  let [hoverCandidate, setHoverCandidate] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [roughBets, setRoughBets] = useState({ trump: 0, biden: 0 });

  let currentPrice = curPrice || 0;

  const fetchWarStaked = useCallback(
    async pools => {
      const st = await getWarStaked(pools, yam);
      setWarStaked(st);
    },
    [yam, setWarStaked]
  );

  const onClickTrump = (e) => {
    if (!account) {
      connect('injected')
    }
    setCandidate(battles.farm1)
    setShowModal(true)
  }

  const onClickBiden = (e) => {
    if (!account) {
      connect('injected')
    }
    setCandidate(battles.farm2)
    setShowModal(true)
  }

  const getRoughBets = async () => {
    let tvl = await electionTVL(yam, account)
    const trump = tvl.trumpTotal
    const biden = tvl.bidenTotal
    setRoughBets({ trump, biden });
  }

  useEffect(() => {
    console.log("using effect");
    if (yam && account && farms && farms[0]) {
      fetchStats();
    }
    if (yam && farms) {
      console.log(farms);
      fetchWarStaked(farms);

    }
    if (yam && account && !roughBets.trump) {
      getRoughBets();
    }
  }, [yam, farms, farms[0]]);

  const closeModal = (event) => {
    setShowModal(false)
  }

  const stopProp = (e) => {
    e.stopPropagation()
  }

  const electionContract = getElectionContracts(yam)

  const hoverOver = (candidate) => {
    console.log("called", candidate, hoverCandidate)
    if ((!candidate || !hoverCandidate) && !transitioning) {
      console.log("1", candidate)
      setHoverCandidate(candidate)
    } else if (candidate !== hoverCandidate) {
      console.log("2")
      setTransitioning(true);
      setHoverCandidate(null);
      setTimeout(() => {
        setHoverCandidate(candidate);
        setTransitioning(false);
      }, 180);
    }
  }

  const hoverExit = () => {
    setTimeout(() => {
      setHoverCandidate(null);
    }, 10);
  }

  const bidenStyle = hoverCandidate === "Biden" ? { transform: `scale(1.05)`, filter: `brightness(110%) contrast(110%)` } : null;
  const trumpStyle = hoverCandidate === "Trump" ? { transform: `scale(1.05)`, filter: `brightness(110%) contrast(110%)` } : null;


  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>

            <Title>Who Will Win?</Title>
            <Countdown endTime={1604440800000} />
            {roughBets.trump > 0 &&
              <VotingBalance votes1={roughBets.trump} votes2={roughBets.biden} />
            }

            <VersusContainer>
              <VersusBackground>
                <ImgWrapper style={trumpStyle} onMouseOver={() => hoverOver("Trump")} onMouseOut={() => hoverExit()}
                  onClick={(e) => onClickTrump(e)}>
                  <Candidate1
                    src={Vitalik}

                  />
                </ImgWrapper>
                <ImgWrapper style={bidenStyle} onMouseOver={() => hoverOver("Biden")} onMouseOut={() => hoverExit()}
                  onClick={(e) => onClickBiden(e)} >
                  <Candidate2
                    src={Alexandra}
                  />
                </ImgWrapper>
              </VersusBackground>
            </VersusContainer>
            <div style={modal ? { display: 'block' } : { display: 'none' }}>
              <Modal onClick={(e) => closeModal(e)}>
                <ModalBlock onClick={(e) => stopProp(e)} style={{ width: '600px' }} >
                  {yam && <BetModalElection
                    battle={battles}
                    candidateInfo={candidate}
                    electionContract={electionContract}
                  />
                  }
                </ModalBlock>
              </Modal>
            </div>
            <InfoBlock>
              <img src={everipediaLogo} width="20px" height="20px" />
              <img src={chainlinkLogo} width="20px" height="20px" />
              <img src="https://2.bp.blogspot.com/-sJ8mGd6LmkU/T0ajVykwreI/AAAAAAAAESA/WNOI4QF4lIw/s1600/AP+logo+2012.png" width="20px" height="20px" />
              Election Results brought to you by AP + Everipedia. Powered by Chainlink.
              <img src="https://2.bp.blogspot.com/-sJ8mGd6LmkU/T0ajVykwreI/AAAAAAAAESA/WNOI4QF4lIw/s1600/AP+logo+2012.png" width="20px" height="20px" />
              <img src={chainlinkLogo} width="20px" height="20px" />
              <img src={everipediaLogo} width="20px" height="20px" />
            </InfoBlock>

            <Rules />
            <Pool3 />
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const ImgWrapper = styled.div`
width: 50%;
height: 100%;
transition: all 0.2s ease-in-out;
`

const InfoBlock = styled.div`
font-family: "Gilroy";
color: rgb(255, 190, 26);
font-size: 22px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
margin-bottom: 2vh;
align-items: center;
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
width: 900px;
`

const ModalBlock = styled.div`
width: 534px;
height: 0px;
margin-top: 23vh;
`

const Modal = styled.div`
border-radius: 8px;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100000;
  background-color: rgba(0, 0, 0, 0.2);
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
`

let Candidate1
let Candidate2

Candidate1 = styled.img`
width: 100%;
height: 100%;
border-radius: 8px 0 0 8px;
cursor: pointer;
object-fit: cover;
`

Candidate2 = styled.img`
width: 100%;
height: 100%;
border-radius: 0 8px 8px 0;
cursor: pointer;
object-fit: cover;

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

const Title = !isMobile() ? styled.div`
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin-bottom: 5px;
` : styled.div`
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin-bottom: 10px;
  margin-top: 40px;
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
height: 500px;
display: flex;
align-items: center;
font-size: 30px;
margin: 0 auto 5vh auto;
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