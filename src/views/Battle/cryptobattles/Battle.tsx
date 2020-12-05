import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../../components/Page";
import useYam from "../../../hooks/useYam";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Background from '../../../assets/img/bg3.svg'
import Pool3 from "./Pool3";
import useFarms from "../../../hooks/useFarms";
import { getWarStaked, createNewContract, getPots, getUserBet, placeETHBet, finishBet, getRewards } from "../../../yamUtils";
import { getStats } from "./utils";
import PersVersusCard from "./PersVersusCard.jsx";
import SinglePersVersusCard from "./PersVersusCardSingle.jsx";
import Schedule from './Schedule'
import Instructions from "./Instructions";
import moment from "moment";
import TotalBets from './BetBar'
import RedeemBetsModal from './RedeemBetsModal'
import Cookies from 'universal-cookie'
import Countdown from "./CountDown";

const cookie = new Cookies()

function isMobile() {
  if (window.innerWidth < window.innerHeight) return true;
  return false;
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
  let [prevDayBattles, setPrevDayBattles] = useState([]);
  let [battles, setBattles] = useState([])
  let [schedule, setSchedule] = useState([])
  let [yesterdaysBattle, setYesterdaysBattle] = useState([])
  let [dailyQuestion, setDailyQuestion] = useState();
  const [betRedeemModal, setBetRedeemModal] = useState(false)



  const fetchWarStaked = useCallback(
    async pools => {
      const st = await getWarStaked(pools, yam);
      setWarStaked(st);
    },
    [yam, setWarStaked]
  );

  useEffect(() => {
    console.log(battles);
    if (battles && battles.length && yesterdaysBattle.length && account) {
      if (parseInt(cookie.get('displaywinnings')) < battles[0].day) {
        setBetRedeemModal(true)
        cookie.set('displaywinnings', battles[0].day)
      }
    }
    if (yam && farms) {
      console.log(farms);
      fetchWarStaked(farms);
    }
    if (battles.length === 0) {

      const endTime = moment.utc('2020-11-17T20:00', "YYYY-MM-DDTHH:mm").unix();
      console.log("end", endTime)
      axios.get(`${getServerURI()}/api/pers-battles`).then(res => {
        console.log("battles", res.data);
        setPrevDayBattles(res.data.prevDayBattles);
        setBattles(res.data.battles)
        setSchedule(res.data.schedule)
        setYesterdaysBattle(res.data.yesterdaysBattle || [])
        // setDailyQuestion(res.data.dailyQuestion);
      }).catch(err => {
        console.log(err);
      })
    }
  }, [yam, account, farms, farms[0]]);

  const stopProp = (e) => {
    e.stopPropagation()
  }


  const battleFields = () => {
    console.log(battles);


    if (!battles.length) {
      return (
        <>
          {/* <Title style={{ marginTop: '30px' }}>Loading Battles...</Title> */}
          <NextBattle />
        </>
      )
    } else if (battles.length) {
      return (
        <BattleSection>
          <SinglePersVersusCard battles={battles} />
          {/* INSERT TRACKING COMPONENT HERE */}
          BLAH BLAH BLAH
        </BattleSection>
      )
    }
    return null;

  };

  // if (isMobile()) {
  //   return (
  //     <Switch>
  //       <StyledCanvas>
  //         <BackgroundSection />
  //         <ContentContainer>
  //           <Page>
  //             {/* <Countdown/> */}
  //             <Title style={{ marginTop: '40px' }}>Please View on Desktop</Title>
  //             <SmallSpace />
  //             {/* {prevDayBattles.length > 0 && battles.length > 0 ? <Seperator /> : null}
  //             {prevDayBattles.length > 0 &&
  //               <InbetweenCard battles={prevDayBattles} />
  //             } */}
  //             <Pool3 />
  //             <Title>Information</Title>
  //             <SmallSpace />
  //             <Instructions />
  //             <Title>Schedule</Title>
  //             <SmallSpace />
  //             <Schedule schedule={schedule} />
  //             <div style={betRedeemModal ? { display: 'block' } : { display: 'none' }}>
  //               <Modal onClick={() => setBetRedeemModal(false)}>
  //                 <ModalBlock onClick={(e) => stopProp(e)}>
  //                   {/* {yam &&  */}
  //                   <RedeemBetsModal battle={yesterdaysBattle} />
  //                   {/* } */}
  //                 </ModalBlock>
  //               </Modal>
  //             </div>
  //           </Page>
  //         </ContentContainer>
  //       </StyledCanvas>
  //     </Switch>
  //   );
  // }

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection />
        <ContentContainer>
          <Page>

            <Countdown />
            {/* {battles && battles.length > 0 && <TotalBets battle1={battles[0]} id={battles[0]._id} />} */}
            <SmallSpace />

            {battleFields()}
            {/* {account && yesterdaysBattle.length > 0 && <Yesterday onClick={() => setBetRedeemModal(true)} >Show Yesterdays Result</Yesterday>} */}
            <SmallSpace />

            {!isMobile() ?
              <iframe title="promo" style={{ width: "500px", height: "281.25px", margin: "10px auto 40px auto" }} src={`https://www.youtube.com/embed/wvYUTiFDHW4`} frameBorder="0" />
              :
              <iframe title="promo" style={{ width: "90vw", height: "50.6vw", margin: "40px auto 40px auto" }} src={`https://www.youtube.com/embed/wvYUTiFDHW4`} frameBorder="0" />}
            <Title>Step 1: Stake $WAR to enter the arena</Title>
            <Pool3 />
            <Title>Information</Title>
            <SmallSpace />
            <Instructions />
            <Title>Schedule</Title>
            <SmallSpace />
            <Schedule schedule={schedule} />
            <div style={betRedeemModal ? { display: 'block' } : { display: 'none' }}>
              <Modal onClick={() => setBetRedeemModal(false)}>
                <ModalBlock onClick={(e) => stopProp(e)}>
                  {/* {yam &&  */}
                  <RedeemBetsModal battle={yesterdaysBattle} />
                  {/* } */}
                </ModalBlock>
              </Modal>
            </div>
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const BattleSection = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
`

const PageTitle = styled.div`
font-family: "Gilroy";
  font-size: 60px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: rgb(255, 204, 74);
  max-width: 80vw;
  margin: 140px auto 40px;
`

const Space = styled.div`
height: 40px;`

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

const Yesterday = styled.div`
font-family: "Gilroy";
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  cursor: pointer;
  text-decoration: underline
  margin: auto;
`

const ModalBlock = !isMobile() ?  styled.div`
margin-top: 23vh;
height: fit-content;
` :styled.div`
margin-top: 23vh;
height: fit-content;
position: fixed;
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

const SmallSpace = styled.div`
height: 30px;`

const Title = styled.div`
font-family: "Gilroy";
  font-size: 26px;
  
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;

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