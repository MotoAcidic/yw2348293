import React, { useCallback, useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import useYam from "../../hooks/useYam";
// import useBet from "../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import useFarms from "../../hooks/useFarms";
import { getWarStaked, getElectionContracts, getCurrentBets, electionTVL } from "../../yamUtils";
import { getStats } from "./utils";
import BetModalElection from "./BetRedeemCardElection"
import BidenWin from "../../assets/img/bidenwin.jpg"

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

const Results: React.FC = () => {
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

  return (
    <>
      <VersusContainer>
        <VersusBackground>
          <Candidate2 onMouseOver={() => hoverOver("Biden")} onMouseOut={() => hoverExit()} src={BidenWin} />
          <Overlay>
            <Congrats>
              A VICTOR HAS RISEN
            </Congrats>
            <Claim onClick={(e) => onClickBiden(e)} >
              Claim Rewards
            </Claim>
          </Overlay>
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
    </>

  );
};

const Congrats = styled.div`
font-family: "Gilroy";
font-size: 30px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: rgb(255, 204, 74);
margin-bottom: 10px;
margin-top: 10px;
`

const Claim = styled.div`
font-family: "Gilroy";
font-size: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
	color: white;
	margin-bottom: 10px;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 7px;
  border-radius: 4px;
  border: 2px solid rgb(255, 204, 74);
  width: 200px;
  margin: auto;
  cursor: pointer;
  background-color: rgba(0,0,0,0.4);
`

const Overlay = styled.div`
position: absolute;
margin-left: 2%;
margin-top: 2%;
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

const Candidate2 = styled.img`
width: 100%;
height: 100%;
border-radius: 8px;
transition: all 0.2s ease-in-out;
object-fit: cover;
`

const VersusBackground = styled.div`
width: 100%;
height: 100%;
display: flex;
`

const VersusContainer = styled.div`
display: flex;
flex-direction: row;
flex-wrap: nowrap;
justify-content: space-evenly;
font-size: 30px;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
min-height: 400px;
height: 50vh;
width: 45%;
`

export default Results;