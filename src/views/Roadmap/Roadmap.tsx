import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import Card from "../../components/Card";
import CardContent from "../../components/CardContent";
import CardIcon from "../../components/CardIcon";
import Container from "../../components/Container";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import Landscape from "../../assets/img/landscapebig.png";
import Sky from "../../assets/img/skybig.png";
import TallSky from "../../assets/img/tallsky.png";
import useFarms from "../../hooks/useFarms";
import useYam from "../../hooks/useYam";
import { useWallet } from "use-wallet";
import { getWarStaked } from "../../yamUtils";
import { getStats } from "./utils";
import milestone_s1_1 from "../../assets/img/milestones/milestone-s1-1.svg";
import milestone_s1_2 from "../../assets/img/milestones/milestone-s1-2.svg";
import milestone_s1_3 from "../../assets/img/milestones/milestone-s1-3.svg";
import milestone_s1_4 from "../../assets/img/milestones/milestone-s1-4.svg";
import milestone_s1_5 from "../../assets/img/milestones/milestone-s1-5.svg";
import milestone_s2_1 from "../../assets/img/milestones/milestone-s2-1.svg";
import milestone_s2_2 from "../../assets/img/milestones/milestone-s2-2.svg";
import milestone_s2_3 from "../../assets/img/milestones/milestone-s2-3.svg";
import milestone_s2_4 from "../../assets/img/milestones/milestone-s2-4.svg";
import milestone_s3_1 from "../../assets/img/milestones/milestone-s3-1.svg";
import milestone_s3_2 from "../../assets/img/milestones/milestone-s3-2.svg";
import milestone_s3_3 from "../../assets/img/milestones/milestone-s3-3.svg";
import milestone_s3_4 from "../../assets/img/milestones/milestone-s3-4.svg";
import milestone_s4_1 from "../../assets/img/milestones/milestone-s4-1.svg";
import milestone_s4_2 from "../../assets/img/milestones/milestone-s4-2.svg";
import milestone_s4_3 from "../../assets/img/milestones/milestone-s4-3.svg";
import milestone_s4_4 from "../../assets/img/milestones/milestone-s4-4.svg";

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

const Roadmap: React.FC = () => {
  let [farms] = useFarms();
  const yam = useYam();
  const { account, connect } = useWallet();
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0)
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

  const fetchWarStaked = useCallback(
    async pools => {
      const st = await getWarStaked(pools, yam);
      setWarStaked(st);
    },
    [yam, setWarStaked]
  );

  useEffect(() => {
    if (yam && account && farms && farms[0]) {
      fetchStats();
    }
    if (yam && farms) {
      console.log(farms);

      fetchWarStaked(farms);
    }
  }, [yam, account, farms, farms[0]]);

  let currentPrice = 0;

  if (curPrice) {
    currentPrice = curPrice;
  }

  return (
    <StyledCanvas>
      <BackgroundSection>
        <StyledSky />
        <StyledLandscape />
      </BackgroundSection>
      <ContentContainer>
        <Page>
          <TopDisplayContainer>
            <DisplayItem>
              $War Price: $
              {currentPrice
                ? Number(currentPrice).toLocaleString(undefined, {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4
                })
                : "-"}
            </DisplayItem>
            <DisplayItem>
              $War Staked:&nbsp;
              {warStaked && !warStaked.warStaked.eq(0)
                ? Number(warStaked.warStaked.toFixed(2)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
                : "-"}
            </DisplayItem>
            <DisplayItem>Supply: 2,800,000</DisplayItem>
          </TopDisplayContainer>
          <Title >
            YieldWars Roadmap
          </Title>
          <Rectangle>
            <RecTitle><u>Milestone</u></RecTitle>
            <RecDesc>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s1_1} />
                <MilestoneText>
                  Launch Daily Governance
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s1_2} />
                <MilestoneText>
                  Roadmap Announced and Jobs / Bounty Board
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s1_3} />
                <MilestoneText>
                  Based Rover Launch (if vote approved)
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s1_4} />
                <MilestoneText>
                  Airdropped NFT's for Season 1+2 participants and Finals Winnders
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s1_5} />
                <MilestoneText>
                  Completed Security Review on Battles
              </MilestoneText>
              </MilestoneRow>
              <Space/>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s2_1} />
                <MilestoneText>
                  Season 2 Begins with 24 Teams
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s2_2} />
                <MilestoneText>
                  Verifiable Voting
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s2_3} />
                <MilestoneText>
                  Ability to bet on winners in addition to vote
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s2_4} />
                <MilestoneText>
                  Experiment with different ways to choose winners, i.e. Token price changes
              </MilestoneText>
              </MilestoneRow>
              <Space/>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s3_1} />
                <MilestoneText>
                  Season 3 Begins with 32 Teams
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s3_2} />
                <MilestoneText>
                  Community DAO for requests
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s3_3} />
                <MilestoneText>
                  Improved betting mechanics / features
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s3_4} />
                <MilestoneText>
                  Security Review on all Betting Features
              </MilestoneText>
              </MilestoneRow>
              <Space/>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s4_1} />
                <MilestoneText>
                  Season 4 begins with 40 teams
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s4_2} />
                <MilestoneText>
                  Season 4 yields all come from betting and WAR Stablecoins
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s4_3} />
                <MilestoneText>
                  The War Stablecoin Vault -- WarCRV, WarDai, etc
              </MilestoneText>
              </MilestoneRow>
              <MilestoneRow>
                <img className="milestone-image" src={milestone_s4_4} />
                <MilestoneText>
                  Trophy's page for showing NFT's earned and available
              </MilestoneText>
              </MilestoneRow>
            </RecDesc>
          </Rectangle>
          <Title>YieldWars Job Board // Bountys</Title>
          <MediumSection>
            <TextSection>
              <LinkSection>
                Senior Solidity Dev
              </LinkSection>
              <LinkSection>
                Community Engagement Specialist
              </LinkSection>
              <LinkSection>
                Meme // Sticker Pack Artists
              </LinkSection>
              <LinkSection>
                NFT Artists
              </LinkSection>
              <Space />
              <LinkSection>
                Please reach out to @DefiFox on	&nbsp;<u>Telegram</u>	&nbsp;to apply
              </LinkSection>
            </TextSection>
          </MediumSection>
        </Page>
      </ContentContainer>
    </StyledCanvas>
  );
};

const MilestoneRow = styled.div`display: flex; align-items: center; margin-bottom: 20px;`

const MilestoneText = styled.div`margin-left: 30px;
font-family: Alegreya;
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1.33;
letter-spacing: normal;
color: #ffffff;`

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
  font-family: Alegreya;
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
      border: solid 2px #0095f0;
      background-color: #003677;
    `
  : styled.div`
      width: 80vw;
      border-radius: 8px;
      border: solid 2px #0095f0;
      background-color: #003677;
    `;

const RecDesc = styled.div`
  font-family: Alegreya;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  color: #ffffff;
  padding: 30px;
  padding-top: 10px;
`;

const RecTitle = styled.div`
  margin-left: 62px;
  font-family: Alegreya;
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
      border: solid 2px #0095f0;
      background-color: #003677;
      margin-bottom: 40px;
      width: 780px;
    `
  : styled.div`
      width: 90vw;
      border-radius: 8px;
      border: solid 2px #0095f0;
      background-color: #003677;
      margin-bottom: 40px;
    `;

const DisplayItem = !isMobile()
  ? styled.div`
      color: white;
      font-family: Alegreya;
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
      font-family: Alegreya;
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


const StyledSky = !isMobile() ? styled.div`
  width: 100%;
  height: 200vh;
  background-image: url(${TallSky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
` : styled.div`
width: 100%;
height: 320vh;
background-image: url(${TallSky});
background-size: 100% 100%;
background-repeat: repeat-x;`

const StyledLandscape = styled.div`
  width: 100%;
  height: 45vh;
  background-image: url(${Landscape});
  background-size: cover;
  transform: translateY(-1px);
`;

const BackgroundSection = styled.div`
  position: absolute;
  width: 100%;
  background-color: #154f9b;
`;

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

const StyledText = styled.p`
  font-family: Alegreya;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`;

const Title = styled.div`
  font-family: Alegreya;
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 20px;
`;


export default Roadmap;
