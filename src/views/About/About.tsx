import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import Page from "../../components/Page";
import Background from '../../assets/img/bg3.svg'
import useFarms from "../../hooks/useFarms";
import useYam from "../../hooks/useYam";
import { useWallet } from "use-wallet";
import { getWarStaked } from "../../yamUtils";
import { getStats } from "./utils";
import Uniswap from "../../assets/img/uniswap@2x.png";
import Roadmap from "./Roadmap";

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

const About: React.FC = () => {
  let [farms] = useFarms();
  const yam = useYam();
  const { account, connect } = useWallet();
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0),
    circSupply: new BigNumber(0)
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

  let currentPrice = curPrice || 0;

  return (
    <StyledCanvas>
      <BackgroundSection />
      <ContentContainer>
        <Page>
          <TopDisplayContainer>
            <DisplayItem>
              $War Price:&nbsp;
              {currentPrice
                ? `$${Number(currentPrice).toLocaleString(undefined, {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4
                })}`
                : "-"}
            </DisplayItem>
            <DisplayItem>
              Supply Staked:&nbsp;
              {warStaked && !warStaked.warStaked.eq(0)
                ? `${Number(warStaked.warStaked.toFixed(2)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}%`
                : "-"}
            </DisplayItem>
            <DisplayItem>
              Marketcap:&nbsp;
              {currentPrice && warStaked && !warStaked.circSupply.eq(0)
                ? `$${Number(warStaked.circSupply.multipliedBy(currentPrice).dividedBy(10 ** 18).toFixed(2)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
                : "-"}
            </DisplayItem>
            <StyledA
              style={{ marginTop: "-5px" }}
              href="https://uniswap.info/token/0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde"
              target="_blank"
            />
          </TopDisplayContainer>
          <Title>
            Frequently Asked Questions
          </Title>
          <FAQSection>
            <Rectangle>
              <RecTitle>What is YieldWars?</RecTitle>
              <RecDesc>
                YieldWars is an experiment on degen betting, governance, and
                community building. It is a competition platform, where you can battle (and earn yield) on almost anything. 
              </RecDesc>
            </Rectangle>
            <Rectangle>
              <RecTitle>What are $WAR tokens used for?</RecTitle>
              <RecDesc>
                $WAR tokens are staked in our Battle Arena to allow token holders to vote, earn yield, and place bets on YieldWars.com They are also used for governance around what communities can be added/subtracted from the arena and what products to bet on.
              </RecDesc>
            </Rectangle>
            <Rectangle>
              <RecTitle>$WAR Tokenomics</RecTitle>
              <RecDesc>
                There are 2,800,000 WAR Tokens in total. The majority have been given out in Farming and Battle Rewards to jumpstart the community. We have enough rewards to give out through Season 4, but before then we aim to pay out $WAR token holders with profits made on bets placed on our system. Ten percent of all $WAR bets are re-distributed to $WAR yields, $WAR LP holders, and the $WAR Community Chest (DAO).
              </RecDesc>
            </Rectangle>
            {/* <Rectangle>
              <RecTitle>How does the Battle Arena work?</RecTitle>
              <RecDesc>
                Every day we set up head to head battles, where crypto communities face off against each other and $WAR token holders vote on who they think will win. The winners used to be decided strictly based on voting, but now the winners can also be chosen based on changes in MarketCap Price. Please read the game rules on the battle page for a full outline on the most up to date rules.
              </RecDesc>
            </Rectangle>
            <Rectangle>
              <RecTitle>What was the reason for launching YieldWars?</RecTitle>
              <RecDesc>
                We were looking at current DeFi projects and thought it would be cool if there was something to do with the asset other than farming. We loved how engaged Farming made everyone, so we decided to see what we could come up with to make a fun crypto community game out of it.
              </RecDesc>
            </Rectangle> */}
          </FAQSection>
          <Roadmap />
          <Title>Official Medium Posts</Title>
          <MediumSection>
            <TextSection>
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
                  href="https://medium.com/@yieldwars/war-liquidity-has-been-unleashed-prepare-for-battle-yieldwars-battle-directions-inside-e0db48b58306"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Liquidity Pool Rewards Unleashed
                </a>
                Sep 28
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
              <LinkSection>
                <a
                  className="medium-link"
                  style={{ color: "white" }}
                  href="https://medium.com/@yieldwars/an-open-letter-to-every-humble-farmer-9cfd97b4dfe9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  An Open Letter to Every Humble 👨🏻‍🌾
                </a>
                Aug 29
              </LinkSection>
            </TextSection>
          </MediumSection>
        </Page>
      </ContentContainer>
    </StyledCanvas>
  );
};


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
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
      margin-bottom: 20px;
    `
  : styled.div`
      width: 80vw;
      border-radius: 8px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
      margin-bottom: 20px;
    `;

const FAQSection = !isMobile()
  ? styled.div`
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: space-evenly;
      margin-bottom: 60px;
    `
  : styled.div`
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: space-evenly;
      margin-bottom: 60px;
      width: 90vw;
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
      width: 780px;
      border-radius: 8px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
      margin-bottom: 20px;
    `
  : styled.div`
      width: 100%;
      border-radius: 8px;
        border: solid 2px rgba(255, 183, 0, 0.3);
      background-color: rgba(256,256,256,0.08);
      margin-bottom: 20px;
    `;

const TopDisplayContainer = !isMobile()
  ? styled.div`
        width:80vw;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin: 16px auto 80px auto;
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

export default About;
