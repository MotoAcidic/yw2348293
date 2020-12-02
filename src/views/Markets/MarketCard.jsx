import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../components/Page";
import useYam from "../../hooks/useYam";
// import useBet from "../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Pool3 from "./unused/Pool3";
import useFarms from "../../hooks/useFarms";
import { getWarStaked, getChessContracts, getChessBets, chessTVL } from "../../yamUtils";
import { getStats } from "./unused/utils";

import Uniswap from "../../assets/img/uniswap@2x.png";
import Chess from "../../assets/img/chess.png";
import Rook from '../../assets/img/rook.png'
import { NavLink } from 'react-router-dom'

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

const Battle = ({ bet, primary }) => {
  let [farms] = useFarms()
  const yam = useYam()

  let [battles, setBattles] = useState(
    {
      finished: false,
      farm1: {
        name: "choice1",
      },
      farm2: {
        name: "choice2",
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
  ] = useState({});
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

  console.log("incbet", bet)

  return (
    <VersusContainer to={`/market/${bet._id}`}>
      <ImgWrapper>
        <Candidate1
          src={bet.pool1.graphic}

        />
        {
          primary ? 
        <Title>
          {bet.pool1.name}
        </Title> : 
                <SmallTitle>
                {bet.pool1.name}
              </SmallTitle>
        }
      </ImgWrapper>
      {/* <Versus>VS</Versus> */}
      <ImgWrapper  >
        <Candidate2
          src={bet.pool2.graphic}
        />
        {
          primary ? 
        <Title>
          {bet.pool2.name}
        </Title> : 
                <SmallTitle>
                {bet.pool2.name}
              </SmallTitle>
        }
      </ImgWrapper>
    </VersusContainer>
  );
};

const SmallTitle = styled.div`
position: absolute;
height: 20%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
bottom: 0;
background: rgba(0,0,0,0.7);
font-size: 16px;
`


const Title = styled.div`
position: absolute;
height: 12%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
bottom: 0;
background: rgba(0,0,0,0.7);
`

const ImgWrapper = styled.div`
width: 50%;
position: relative;
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

let Candidate1
let Candidate2

Candidate1 = styled.img`
width: calc(100% - 5px);
height: calc(100% - 10px);
border-radius: 6px 0 0 6px;
cursor: pointer;
object-fit: cover;
border: 5px solid black;
border-right: 2px solid white;
`

Candidate2 = styled.img`
width: calc(100% - 5px);
height: calc(100% - 10px);
border-radius: 0 6px 6px 0;
cursor: pointer;
object-fit: cover;
border: 5px solid black;
border-left: 2px solid black;
`

const VersusContainer = !isMobile() ? styled(NavLink)`
width: 100%;
max-width: 1400px;
max-height: 650px;
height: 100%;
display: flex;
flex-direction: row;
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