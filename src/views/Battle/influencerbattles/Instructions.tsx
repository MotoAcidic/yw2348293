import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import Page from "../../../components/Page";
import useFarms from "../../../hooks/useFarms";
import useYam from "../../../hooks/useYam";
import { useWallet } from "use-wallet";
import { getTotalValue } from "../../../yamUtils";
import { getStats } from "./utils";
import Background from '../../../assets/img/bg3.svg'
import img_1 from "../../../assets/img/instructions/0@2x.png";
import img_2 from "../../../assets/img/instructions/1@2x.png";
import img_3 from "../../../assets/img/instructions/2@2x.png";
import img_4 from "../../../assets/img/instructions/3@2x.png";
import img_5 from "../../../assets/img/instructions/4@2x.png";
import img_6 from "../../../assets/img/instructions/5@2x.png";

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
  const [page, setPage] = useState("battle");
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

  if (page === "battle") {
    return (
      <Rectangle>
        <Tabs>
          <ActiveTab>
            battle
        </ActiveTab>
          <Tab onClick={() => setPage("bet")}>
            bet
        </Tab>
        </Tabs>
        <RecDesc>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={img_1} />
            <MilestoneText>
              Stake $WAR in your $WARchest to vote on battles!
              </MilestoneText>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={img_2} />
            <MilestoneText>
              Vote daily to earn rewards. Battles start at 20:00 UTC and last for 23hours. If you unstake during a battle, you will not earn rewards and your vote will not count.
              </MilestoneText>
          </MilestoneRow>
          {/* <MilestoneRow>
          <img className="milestone-image" alt="milestone" src={img_3} />
          <MilestoneText>
          You can vote once per day, the time of your vote doesn’t matter. We take a snapshot of your wallet when voting ends and apply your $WARchest total to the side you have voted on. 
              </MilestoneText>
        </MilestoneRow> */}
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={img_4} />
            <MilestoneText>
              You can vote once per day, the time of your vote doesn’t matter. We take a snapshot of your wallet when voting ends and apply your $WARchest total to the side you have voted on.
              </MilestoneText>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={img_5} />
            <MilestoneText>
              Whichever side has the most votes wins. If you vote on the winning side, then you will earn the yield for the day. Vote on the losing side and get nothing!
              </MilestoneText>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={img_6} />
            <MilestoneText>
              $WAR rewards will show in your $WARchest once the battle ends at 19:00 UTC
              </MilestoneText>
          </MilestoneRow>
        </RecDesc>
      </Rectangle>

    )
  }

  return (
    <Rectangle>

      <Tabs>
        <Tab onClick={() => setPage("battle")}>
          battle
            </Tab>
        <ActiveTab>
          bet
            </ActiveTab>
      </Tabs>
      <RecDesc>
        <MilestoneRow>
          <img className="milestone-image" alt="milestone" src={img_1} />
          <MilestoneText>
            Betting on YieldWars is winner takes all. Don't bet what you cannot afford to lose!
              </MilestoneText>
        </MilestoneRow>
        <MilestoneRow>
          <img className="milestone-image" alt="milestone" src={img_2} />
          <MilestoneText>
            Once a bet is placed it is locked in, it cannot be withdrawn or changed.
              </MilestoneText>
        </MilestoneRow>
        <MilestoneRow>
          <img className="milestone-image" alt="milestone" src={img_3} />
          <MilestoneText>
            Bets last 23 hours, starting at 20:00 UTC and ending at 19:00 UTC the next day.
              </MilestoneText>
        </MilestoneRow>
        <MilestoneRow>
          <img className="milestone-image" alt="milestone" src={img_4} />
          <MilestoneText>
            10% of winnings go to the house. Half of this rake goes directly back into the community as additional battle rewards, the other half goes into the $WAR community DAO to fund additional development.
              </MilestoneText>
        </MilestoneRow>
        <MilestoneRow>
          <img className="milestone-image" alt="milestone" src={img_5} />
          <MilestoneText>
            The winner of the bet is determined by the winner of the Battle.
              </MilestoneText>
        </MilestoneRow>
        {/* <MilestoneRow>
          <img className="milestone-image" alt="milestone" src={img_6} />
          <MilestoneText>
          $WAR rewards will show in your $WARchest once the battle ends at 19:00 UTC
              </MilestoneText>
        </MilestoneRow> */}
      </RecDesc>
    </Rectangle>
  );
};

const Tab = styled.div`
cursor: pointer;
color: rgb(255,204,74);
opacity: 0.9;
transition: all 0.1s linear;
&:hover {
  opacity: 1;
}
`

const ActiveTab = styled.div`
cursor: pointer;
color: white;
text-decoration: underline;
`

const Tabs = styled.div`
margin: 10px auto;
width: 40%;
justify-content: space-around;
font-weight: bold;
font-family: Alegreya;

    font-size: 25px;
    height: 30px;
    display: flex;

`

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


const RecDesc = styled.div`
  font-family: "Gilroy";
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  color: #ffffff;
  padding: 10px 20px 30px 20px;
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

export default Instructions;
