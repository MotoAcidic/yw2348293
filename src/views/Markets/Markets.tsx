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
import Background from '../../assets/img/bg3.svg'
import MarketCardPrimary from "./MarketCardPrimary";
import MarketCardSecondary from "./MarketCardSecondary";

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


// const importedData = [
//   {
//     pool1: {
//       name: "Maryland Minions",
//       graphic: "https://i.pinimg.com/originals/82/31/15/823115ab5af1ec984fc9754fa702cf3a.jpg",
//     },
//     pool2: {
//       name: "Boston Ballerinas",
//       graphic: "https://calendar.artsboston.org/wp-content/uploads/sites/calendar.artsboston.org/images/2020/01/event-featured-Bos-1580405932.jpeg",
//     },
//     primary: true,
//     bettingStart: 1606872001,
//     bettingEnd: 1606992001,
//     battleEnd: 1608992001,
//   },
//   {
//     pool1: {
//       name: "Maryland Minions",
//       graphic: "https://i.pinimg.com/originals/82/31/15/823115ab5af1ec984fc9754fa702cf3a.jpg",
//     },
//     pool2: {
//       name: "Boston Ballerinas",
//       graphic: "https://calendar.artsboston.org/wp-content/uploads/sites/calendar.artsboston.org/images/2020/01/event-featured-Bos-1580405932.jpeg",
//     },
//     primary: false,
//     bettingStart: 1606872001,
//     bettingEnd: 1606992001,
//     battleEnd: 1608992001,
//   },
//   {
//     pool1: {
//       name: "Maryland Minions",
//       graphic: "https://i.pinimg.com/originals/82/31/15/823115ab5af1ec984fc9754fa702cf3a.jpg",
//     },
//     pool2: {
//       name: "Boston Ballerinas",
//       graphic: "https://calendar.artsboston.org/wp-content/uploads/sites/calendar.artsboston.org/images/2020/01/event-featured-Bos-1580405932.jpeg",
//     },
//     primary: false,
//     bettingStart: 1606872001,
//     bettingEnd: 1606992001,
//     battleEnd: 1608992001,
//   },
//   {
//     pool1: {
//       name: "Maryland Minions",
//       graphic: "https://i.pinimg.com/originals/82/31/15/823115ab5af1ec984fc9754fa702cf3a.jpg",
//     },
//     pool2: {
//       name: "Boston Ballerinas",
//       graphic: "https://calendar.artsboston.org/wp-content/uploads/sites/calendar.artsboston.org/images/2020/01/event-featured-Bos-1580405932.jpeg",
//     },
//     primary: false,
//     bettingStart: 1606872001,
//     bettingEnd: 1606992001,
//     battleEnd: 1608992001,
//   },
// ]

const Battle: React.FC = () => {


  const [markets, setMarkets] = useState(null);


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

  useEffect(() => {
    axios.get(`${getServerURI()}/markets/get-markets`).then(res => {
      console.log("markets", res.data);
      let allMarkets = res.data.activeMarkets;
      let primaryBet;
      console.log("allmarkets", allMarkets);
      const primaryBetIndex = allMarkets.findIndex(bet => bet.primary)
      if (primaryBetIndex !== -1) {
        primaryBet = allMarkets.splice(primaryBetIndex, 1);
        primaryBet = primaryBet[0];
      } else {
        primaryBet = allMarkets.shift();
      }
      const PrimaryBet = () => (
        <PrimaryContainer>
          <MarketCardPrimary bet={primaryBet} />
        </PrimaryContainer>
      )
      const AllMarkets = () => (

        <MarketsContainer>
          <PrimaryBet />
          <MarketsGrid>

            {allMarkets.map(bet =>
              <SecondaryContainer>
                <MarketCardSecondary bet={bet} />
              </SecondaryContainer>
            )}
          </MarketsGrid>
        </MarketsContainer>
      )
      setMarkets(<AllMarkets />);
    }).catch(err => {
      console.log(err);
    })
  }, []);



  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>
            {/* <TopDisplayContainer /> */}
            <Title>
              Active Markets
		        </Title>
            <LandingSection>

              {markets}
              {/* <Title>
              Alexandra Botez has claimed Victory!
		        </Title>
            <Title>
              Come back soon to claim rewards
		        </Title> */}
            </LandingSection>
            {/* <Results /> 
            <Rules />
            <Pool3 /> */}
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch >
  );
};

const MarketsGrid = !isMobile() ? styled.div`
  width: 100%;
  grid-column-gap: 25px;
  -webkit-column-gap: 25px;
  column-gap: 25px;
  display: grid;
  grid-template-columns: 50%;
  grid-template-columns: repeat(2,1fr);
  grid-row-gap: 20px;
  row-gap: 20px;
  grid-template-rows: auto;
` : styled.div`
  width: 100%;`;

const MarketsContainer = !isMobile() ? styled.div`
height: 100%;
width: 90vw;
display: flex;
flex-direction: row;
flex-wrap: wrap;
`: styled.div`
`

const SecondaryContainer = !isMobile() ? styled.div`
// height: calc(15vw + 100px);
` : styled.div`
width: 100%;`;

const PrimaryContainer = !isMobile() ? styled.div`
width: 90vw;
height: 31.7vw;
margin-bottom: 2vh;
` : styled.div`
width: 100%;`;

const LandingSection = !isMobile() ? styled.div`
// height: calc(100vh - 154px);
// width: 80vw;
margin: auto;
display: flex;
flex-direction: column;
justify-content: center;
`: styled.div`
min-height: calc(100vh - 73px);
`

const Candidate1 = styled.img`
width: calc(100% - 10px);
height: 100%;
border-radius: 6px 0 0 6px;
cursor: pointer;
object-fit: cover;
border: 10px solid black;
border-right: 2px solid black;
`

const Candidate2 = styled.img`
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
  color: rgb(255, 204, 160);
  max-width: 80vw;
  margin-bottom: 10px;
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
  background-image: url(${Background});
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background-repeat: no-repeat;
  background-size: cover;
  `;

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
