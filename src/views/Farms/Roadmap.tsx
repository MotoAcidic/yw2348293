import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
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

const Roadmap = () => {

  return (
    <Container>
      {/* <Title >
        YieldWars Roadmap
          </Title>
      <Rectangle>
        <RecTitle><u>Milestone</u></RecTitle>
        <RecDesc>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s1_1} />
            <MilestoneTextDone>
              Launch Daily Governance
              </MilestoneTextDone>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s1_2} />
            <MilestoneTextDone>
              Roadmap Announced and Jobs / Bounty Board
              </MilestoneTextDone>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s1_3} />
            <MilestoneTextDone>
              Based Rover Launch (if vote approved)
              </MilestoneTextDone>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s1_4} />
            <MilestoneTextDone>
              Airdropped NFT's for Season 1+2 participants and Finals Winners
              </MilestoneTextDone>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s1_5} />
            <MilestoneTextDone>
              Completed Security Review on Battles
              </MilestoneTextDone>
          </MilestoneRow>
          <Space />
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s2_1} />
            <MilestoneTextDone>
              Season 2 Begins with 24 Teams
              </MilestoneTextDone>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s2_2} />
            <MilestoneTextDone>
              Verifiable Voting
              </MilestoneTextDone>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s2_3} />
            <MilestoneTextDone>
              Ability to bet on winners in addition to vote
              </MilestoneTextDone>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s2_4} />
            <MilestoneTextDone>
              Experiment with different ways to choose winners, i.e. Token price changes
              </MilestoneTextDone>
          </MilestoneRow>
          <Space />
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s3_1} />
            <MilestoneText>
              Season 3 Begins with 32 Teams
              </MilestoneText>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s3_2} />
            <MilestoneText>
              Community DAO for requests
              </MilestoneText>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s3_3} />
            <MilestoneText>
              Improved betting mechanics / features
              </MilestoneText>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s3_4} />
            <MilestoneText>
              Security Review on all Betting Features
              </MilestoneText>
          </MilestoneRow>
          <Space />
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s4_1} />
            <MilestoneText>
              Season 4 begins with 40 teams
              </MilestoneText>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s4_2} />
            <MilestoneText>
              Season 4 yields all come from betting and WAR Stablecoins
              </MilestoneText>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s4_3} />
            <MilestoneText>
              The War Stablecoin Vault -- WarCRV, WarDai, etc
              </MilestoneText>
          </MilestoneRow>
          <MilestoneRow>
            <img className="milestone-image" alt="milestone" src={milestone_s4_4} />
            <MilestoneText>
              Trophy's page for showing NFT's earned and available
              </MilestoneText>
          </MilestoneRow>
        </RecDesc>
      </Rectangle> */}
      <Title>Official Medium Posts</Title>
      <MediumSection>
        <TextSection>
          <LinkSection>
            <a
              className="medium-link"
              style={{ color: "white" }}
              href="https://yieldwars.medium.com/yieldwars-markets-are-coming-here-is-what-you-need-to-know-2a73fb7c1e18"
              target="_blank"
              rel="noopener noreferrer"
            >
              YieldWars Markets Are Coming
                </a>
                Dec 3
              </LinkSection>
          <LinkSection>
            <a
              className="medium-link"
              style={{ color: "white" }}
              href="https://yieldwars.medium.com/yieldwars-special-edition-battle-buterin-vs-botez-chess-match-%EF%B8%8F-7ddec4c7651e"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chess Battle: Buterin vs. Botez
                </a>
                Nov 21
              </LinkSection>
          <LinkSection>
            <a
              className="medium-link"
              style={{ color: "white" }}
              href="https://yieldwars.medium.com/the-twitter-war-bracket-is-here-are-you-ready-for-battle-%EF%B8%8F-5529f1d4adcf"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Twitter WAR Bracket is Here!
                </a>
                Nov 14
              </LinkSection>
          <LinkSection>
            <a
              className="medium-link"
              style={{ color: "white" }}
              href="https://yieldwars.medium.com/yieldwars-election-recap-and-twitter-war-update-6a27fd3d4d96"
              target="_blank"
              rel="noopener noreferrer"
            >
              YieldWars Election Recap
                </a>
                Nov 7
              </LinkSection>
          <LinkSection>
            <a
              className="medium-link"
              style={{ color: "white" }}
              href="https://yieldwars.medium.com/announcing-yieldwars-2-0-the-next-evolution-of-the-defi-battle-royale-6b1f15755209"
              target="_blank"
              rel="noopener noreferrer"
            >
              Announcing YieldWars 2.0
                </a>
                Oct 21
              </LinkSection>
          <LinkSection>
            <a
              className="medium-link"
              style={{ color: "white" }}
              href="https://yieldwars.medium.com/introducing-the-yieldwars-foundation-91354de67424"
              target="_blank"
              rel="noopener noreferrer"
            >
              Introducing The YieldWars Foundation
                </a>
                Oct 19
              </LinkSection>
          <LinkSection>
            <a
              className="medium-link"
              style={{ color: "white" }}
              href="https://medium.com/@yieldwars/everything-you-need-to-know-about-yieldwars-bc89adf129f8"
              target="_blank"
              rel="noopener noreferrer"
            >
              Everything you Need to Know About YieldWars
                </a>
                Oct 11
              </LinkSection>
          <LinkSection>
            <a
              className="medium-link"
              style={{ color: "white" }}
              href="https://medium.com/@yieldwars/yieldwars-day-1-recap-and-future-plans-aa88082379b8" target="_blank"
              rel="noopener noreferrer"
            >
              Day 1 Recap
                </a>
                Sep 25
              </LinkSection>
          <LinkSection>
            <a
              className="medium-link"
              style={{ color: "white" }}
              href="https://medium.com/@yieldwars/welcome-to-yieldwars-%EF%B8%8F-d3e8b388966a"
              target="_blank"
              rel="noopener noreferrer"
            >
              Welcome to YieldWars
                </a>
                Sep 16
              </LinkSection>
        </TextSection>
      </MediumSection>
      {/* <Title>YieldWars Job Board // Bounties</Title>
      <MediumSection>
        <JobSection>

          <JobTextSection>
            Community Engagement Specialist
          </JobTextSection>

          <Space />
          <JobTextSection>
            Please reach out to @DefiFox on	&nbsp;<u>Telegram</u>	&nbsp;to apply
          </JobTextSection>
        </JobSection>
      </MediumSection> */}

    </Container>
  );
};

const Container = styled.div`
margin-top: 80px;
display: flex;
flex-direction: column;
align-items: center;
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
color: #ffffff;`

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

const MilestoneTextDone = styled.div`margin-left: 30px;
font-family: "Gilroy";
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1.33;
letter-spacing: normal;
color: #cccccc;
text-decoration: line-through;`

const Space = styled.div`height: 20px`;

const JobSection = !isMobile()
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

const JobTextSection = styled.div`
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

const LinkSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  class: about-link;
  margin-bottom: 8px;
`;

const MediumSection = !isMobile()
  ? styled.div`
      width: 780px;
      border-radius: 8px;
      margin-bottom: 80px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
    `
  : styled.div`
      width: 80vw;
      margin-bottom: 80px;
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
  padding-top: 10px;
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
      margin-bottom: 40px;
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


export default Roadmap;
