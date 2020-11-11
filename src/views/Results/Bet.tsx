import React, { useCallback, useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import useYam from "../../hooks/useYam";
// import useBet from "../../hooks/useBet";
import { useWallet } from "use-wallet";
import useFarms from "../../hooks/useFarms";
import {
  getWarStaked, getElectionContracts, getCurrentBets, electionTVL,
  getContractsAP, TVL_AP
} from "../../yamUtils";
import BigNumber from "bignumber.js";

import { getStats } from "./utils";
import chainlinkLogo from "../../assets/img/chainlinklogo.png";
import everipediaLogo from "../../assets/img/everipedialogo.png";
import betBackground from "../../assets/img/stars_background.png";
import './swal.css'
import VotingBalance from "./BetVotingBalance";
import ElectionResults from "./BetElectionResults";
import Results from "./BetResults";
import APRedeemModal from "./BetRedeemCardAP";

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

const Battle: React.FC = () => {
  let [farms] = useFarms()
  const yam = useYam()

  let [battles, setBattles] = useState(
    {
      choice1: "yes",
      choice2: "no",
    }
  )
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

  const { account, connect, ethereum } = useWallet()
  let [apRedeemModal, setAPRedeemModal] = useState(false);

  const fetchStats = useCallback(async () => {
    const statsData = await getStats(yam);
    setStats(statsData);
  }, [yam, setStats]);
  let [candidate, setCandidate] = useState("");
  const [roughBets, setRoughBets] = useState({ trump: 0, biden: 0 });
  const [betsAPCall, setBetsAPCall] = useState({ choice1: 0, choice2: 0 });

  const fetchWarStaked = useCallback(
    async pools => {
      const st = await getWarStaked(pools, yam);
      setWarStaked(st);
    },
    [yam, setWarStaked]
  );

  const getRoughBets = async () => {
    let tvl = await electionTVL(yam, account)
    let ap_tvl = await TVL_AP(yam, account)
    const trump = tvl.trumpTotal
    const biden = tvl.bidenTotal
    const choice1 = ap_tvl.choice1Total;
    const choice2 = ap_tvl.choice2Total;
    setRoughBets({ trump, biden });
    setBetsAPCall({ choice1, choice2 });
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

  const stopProp = (e) => {
    e.stopPropagation()
  }

  const electionContract = getElectionContracts(yam)

  if (!yam) {
    return (
      <TopSection>

        <ConnectContainer onClick={() => connect('injected')}>
          <BigTitle>
            {isMobile() ? "Please View on Desktop" :
              "Connect Your Wallet"
            }
          </BigTitle>
          {!isMobile() &&
            <SubTitle>
              to view election results
            </SubTitle>
          }
        </ConnectContainer>
        <div />
      </TopSection>
    )
  }

  return (
    <>
      {roughBets.trump > 0 &&
        <VotingBalance votes1={roughBets.trump} votes2={roughBets.biden} />
      }
      <Section>
        <ElectionResults />
        <Results />
      </Section>
      <Seperator />
      <TopTitle>The Associated Press did not call the election before 00:00 UTC on Nov 7th&nbsp;
      </TopTitle>
      <Claim onClick={() => {
        connect('injected')
        setAPRedeemModal(true)
      }}>
        Claim Rewards
      </Claim>
      <Spacer />
      <div style={apRedeemModal ? { display: 'block' } : { display: 'none' }}>
        <Modal onClick={() => setAPRedeemModal(false)}>
          <ModalBlock onClick={(e) => stopProp(e)} style={{ width: '600px' }} >
            {yam && <APRedeemModal
              battle={battles}
              candidateInfo={candidate}
              electionContract={electionContract}
            />}
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
    </>
  );
};

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

const Spacer = styled.div`
height: 40px;`


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

const TopSection = styled.div`
min-height: 90vh;
display: flex;
flex-direction: column;
justify-content: space-around;
align-items: center;
`

const Section = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
  width: 100%;
  justify-content: space-around;
`

const InfoBlock = !isMobile() ? styled.div`
font-family: "Gilroy";
color: rgb(255, 190, 26);
font-size: 22px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
margin-bottom: 120px;
align-items: center;
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
width: 900px;
` : styled.div`
font-family: "Gilroy";
color: rgb(255, 190, 26);
font-size: 18px;
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
width: 90vw;
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

Candidate1 = styled.div`
width: 50%;
height: 100%;
border-radius: 8px 0 0 8px;
cursor: pointer;
transition: all 0.2s ease-in-out;
position:relative;
background-color: #AB1003;
`

Candidate2 = styled.div`
width: 50%;
height: 100%;
position:relative;
border-radius: 0 8px 8px 0;
cursor: pointer;
transition: all 0.2s ease-in-out;
background-color: #15437F;
`

const Seperator = !isMobile() ? styled.div`
  width: 1000px;
  height: 1px;
  margin-top: 60px;
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

const TopTitle = !isMobile() ? styled.div`
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
  margin-bottom: 40px;
`;


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
  margin-bottom: 20px;
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
  margin-bottom: 20px;
  margin-top: 40px;
`;

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

export default Battle;