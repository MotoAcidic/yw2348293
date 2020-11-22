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
import { getWarStaked, getChessContracts, getChessBets, chessTVL } from "../../../yamUtils";
import { getStats } from "./utils";

import Uniswap from "../../../assets/img/uniswap@2x.png";

import BetModalElection from "./BetCardElection.jsx";
import Biden from "../../../assets/img/biden.png";
import Trump from "../../../assets/img/trump.png";

import Twitch from "../../../assets/img/twitch.png"
import Vitalik from "../../../assets/img/chess_vitalik.jpg"
import Alexandra from "../../../assets/img/chess_alexandra_2.png"

import Chess from "../../../assets/img/chess.png";
import Rook from '../../../assets/img/rook.png'
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
import moment from 'moment';

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
        name: "Vitalik",
      },
      farm2: {
        name: "Alexandra",
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
    let tvl = await chessTVL(yam, account)
    const trump = tvl.trumpTotal
    const biden = tvl.bidenTotal
    console.log(trump, biden);
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

  const electionContract = getChessContracts(yam)

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

  const bidenStyle = hoverCandidate === "Alexandra" ? { transform: `scale(1.05)`, filter: `grayscale(40%)`, transition: `all 0.2s ease-in-out`, zIndex: 2000 } : { filter: `grayscale(100%)`, transition: `all 0.2s ease-in-out` };
  const trumpStyle = hoverCandidate === "Vitalik" ? { transform: `scale(1.05)`, filter: `grayscale(40%)`, transition: `all 0.2s ease-in-out`, zIndex: 2001 } : { filter: `grayscale(100%)`, transition: `all 0.2s ease-in-out`, zIndex: 1000 };


  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>

            <Title>Who Will Win?</Title>
            <Countdown endTime={moment.utc("2020-11-23T02:00", "YYYY-MM-DDTHH:mm").unix() * 1000} />
            {roughBets.trump > 0 &&
              <VotingBalance votes1={roughBets.trump} votes2={roughBets.biden} />
            }

            <VersusContainer>
              <VersusBackground>
                <ImgWrapper style={trumpStyle} onMouseOver={() => hoverOver("Vitalik")} onMouseOut={() => hoverExit()}
                  onClick={(e) => onClickTrump(e)}>
                  <Candidate1
                    src={Vitalik}

                  />
                </ImgWrapper>
                <Versus>VS</Versus>
                <ImgWrapper style={bidenStyle} onMouseOver={() => hoverOver("Alexandra")} onMouseOut={() => hoverExit()}
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
            <InfoBlock href={"https://www.twitch.tv/botezlive"}
              target="_blank"
            >
              <img src={Twitch} width="30px" height="30px" />
                  Watch the match on Twitch!
              <img src={Twitch} width="30px" height="30px" />

            </InfoBlock>

            <Rules />
            <Pool3 />
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const Versus = styled.div`
position: absolute;
height: 180px;
width: 110px;
z-index: 20004;
display: flex;
align-items: center;
justify-content: center;
background-image: url(${Rook});
background-size: contain;
background-repeat: no-repeat;
margin-top: 50px;
filter: drop-shadow(0 0 0.75rem white)
`

const ImgWrapper = styled.div`
width: 50%;
height: 100%;
transition: all 0.2s ease-in-out;
// filter: brightness(100%) contrast(100%) grayscale(100%) ;
// &:hover {
// transition: all 0.2s ease-in-out;
//   filter: brightness(110%) contrast(110%) grayscale(80%);
//   transform: scale(1.05);
//   z-index: 2000000;
// }
`

const InfoBlock = styled.a`
font-family: "Gilroy";
color: rgb(255, 204, 160);
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
width: 420px;
margin-bottom: 80px;
background-color: rgba(256,256,256,0.2);
border-radius: 8px;
height: 40px;
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
width: calc(100% - 10px);
height: 100%;
border-radius: 6px 0 0 6px;
cursor: pointer;
object-fit: cover;
border: 10px solid black;
border-right: 2px solid black;
`

Candidate2 = styled.img`
width: calc(100% - 10px);
height: 100%;
border-radius: 0 6px 6px 0;
cursor: pointer;
object-fit: cover;
border: 10px solid black;
border-left: 2px solid black;
`

const VersusBackground = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
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
  background-image: url(${Chess});
  position: fixed;
  width: 180vw;
  height: 100vh;
  top: 0;
  background-repeat: no-repeat;
  background-position: fit;
  background-size: cover;
  animation: marquee 400s ease-in-out 200ms infinite;
  `

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
max-width: 1400px;
max-height: 650px;
height: 40vw;
display: flex;
align-items: center;
font-size: 30px;
margin: 0 auto 40px auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
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