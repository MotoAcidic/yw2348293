import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import Page from "../../components/Page";
import useFarms from "../../hooks/useFarms";
import useYam from "../../hooks/useYam";
import { useWallet } from "use-wallet";
import { getTotalValue } from "../../yamUtils";
import { getStats } from "./utils";
import Background from '../../assets/img/bg3.svg'
import img_1 from "../../assets/img/instructions/0@2x.png";
import img_2 from "../../assets/img/instructions/1@2x.png";
import img_3 from "../../assets/img/instructions/2@2x.png";
import img_4 from "../../assets/img/instructions/3@2x.png";
import img_5 from "../../assets/img/instructions/4@2x.png";
import img_6 from "../../assets/img/instructions/5@2x.png";

export interface OverviewData {
  circSupply?: string;
  curPrice?: number;
  nextRebase?: number;
  targetPrice?: number;
  totalSupply?: string;
}

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

const Instructions: React.FC = () => {
  let [farms] = useFarms();
  const yam = useYam();
  const { account, connect } = useWallet();
  let [tvl, setTVL] = useState({
    totalValue: new BigNumber(0),
    poolValues: {}
  });
  const [
    {
      circSupply,
      curPrice,
      // nextRebase,
      targetPrice,
      totalSupply
    },
    setStats
  ] = useState<OverviewData>({});

  const fetchStats = useCallback(async () => {
    const statsData = await getStats(yam);
    setStats(statsData);
  }, [yam, setStats]);

  const fetchTotalValue = useCallback(
    async pools => {
      const tv = await getTotalValue(pools, yam);
      setTVL(tv);
    },
    [yam, setTVL, setTVL]
  );

  useEffect(() => {
    if (yam && account && farms && farms[0]) {
      fetchStats();
    }
    if (yam && farms) {
      console.log(farms);

      fetchTotalValue(farms);
    }
  }, [yam, account, farms, farms[0]]);

  let currentPrice = 0;

  if (curPrice) {
    currentPrice = curPrice;
  }

  return (

    <Rectangle>
      <RecDesc>
        <MilestoneRow>
          <img className="milestone-image" src={img_1} />
          <MilestoneText>
            Your Staked WAR is never at risk, but your Yields are fought over in battle!
              </MilestoneText>
        </MilestoneRow>
        <MilestoneRow>
          <img className="milestone-image" src={img_2} />
          <MilestoneText>
            Fight with the winning army and plunder 50% of the losers yield!
              </MilestoneText>
        </MilestoneRow>
        <MilestoneRow>
          <img className="milestone-image" src={img_3} />
          <MilestoneText>
            Run away before the battle is over (15:00 UTC) and  lose all your yield for the amount you pulled out.
              </MilestoneText>
        </MilestoneRow>
        <MilestoneRow>
          <img className="milestone-image" src={img_4} />
          <MilestoneText>
            You can only vote once per day, and the earlier you vote, the more yield you earn! Anything staked after your vote won’t be counted in that day’s battle
              </MilestoneText>
        </MilestoneRow>
        <MilestoneRow>
          <img className="milestone-image" src={img_5} />
          <MilestoneText>
            Battles end at 15:00 UTC and new battles begin at 16:00 UTC daily
            Vote Daily to earn yield, staking alone will not earn Battle Rewards
              </MilestoneText>
        </MilestoneRow>
        <MilestoneRow>
          <img className="milestone-image" src={img_6} />
          <MilestoneText>
            WAR Rewards will show in your account once Battles end
              </MilestoneText>
        </MilestoneRow>
      </RecDesc>
    </Rectangle>
  );
};

const MilestoneRow = styled.div`display: flex; align-items: center; margin-bottom: 20px;`

const MilestoneText = styled.div`margin-left: 30px;
font-family: "Gilroy";
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1.33;
letter-spacing: normal;
color: #ffffff;
text-align: left;`

const Space = styled.div`height: 20px`;

const TextSection = !isMobile()
  ? styled.div`
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      height: 80%;
    `
  : styled.div`
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      width: calc(100% - 40px);
    `;

const LinkSection = styled.div`
  font-family: "Gilroy";
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  class: about-link;
`;

const MediumSection = !isMobile()
  ? styled.div`
      width: 780px;
      border-radius: 8px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
    `
  : styled.div`
      width: 80vw;
      border-radius: 8px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
    `;

const RecDesc = styled.div`
  font-family: "Gilroy";
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  color: #ffffff;
  padding: 30px;
  padding-bottom: 20px;
`;

const RecTitle = styled.div`
  margin-left: 62px;
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  padding: 30px;
  padding-bottom: 10px;
`;

const Rectangle = !isMobile()
  ? styled.div`
      border-radius: 8px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
      margin-bottom: 80px;
      width: 780px;
    `
  : styled.div`
      width: 90vw;
      border-radius: 8px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
      margin-bottom: 80px;
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
    `
  : styled.div`
      width: 100%;
      margin-bottom: 10px;
      color: white;
      font-family: "Gilroy";
      font-size: 18px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      color: #ffffff;
    `;

const TopDisplayContainer = !isMobile()
  ? styled.div`
        width: 40vw;
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-evenly;
        margin: 16px auto 80px auto;
      `
  : styled.div`
        width: 40vw;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-content: center;
        justify-content: space-evenly;
        margin: 60px auto 40px auto;
        display: flex;
        flex-wrap: wrap;
      `;

const BackgroundSection = styled.div`
      background-image: url(${Background});
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      background-repeat: no-repeat;
      background-size: cover;
      `
const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  background-color: #154f9b;
`;
const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  text-align: left;
`;


const Title = styled.div`
  font-family: "Gilroy";
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 20px;
`;


export default Instructions;
