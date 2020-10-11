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
import FAQInfo from "../../assets/img/FAQInfo.png";
import FAQ1 from "../../assets/img/FAQ1.png";
import FAQ2 from "../../assets/img/FAQ2.png";
import FAQ3 from "../../assets/img/FAQ3.png";
import useFarms from "../../hooks/useFarms";
import useYam from "../../hooks/useYam";
import { useWallet } from "use-wallet";
import { getWarStaked } from "../../yamUtils";
import { getStats } from "./utils";

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
          <Title>
            Frequently Asked Questions
          </Title>
          <FAQSection>
            <Rectangle>
              <RecTitle>What is YieldWars?</RecTitle>
              <RecDesc>
                YieldWars is an experiment on degen game design, governance, and
                community building. It is the ultimate battle royale to
                determine which crypto community is the strongest.{" "}
              </RecDesc>
            </Rectangle>
            <Rectangle>
              <RecTitle>What are $WAR tokens used for?</RecTitle>
              <RecDesc>
                WAR tokens are staked in YieldWars to allow token holders to
                vote, earn yield, and wage war on crypto communities. They will
                also be used for our future governance platform to decide future
                versions of YieldWars.
              </RecDesc>
            </Rectangle>
            <Rectangle>
              <RecTitle>$WAR Tokenomics</RecTitle>
              <RecDesc>
                There are 2,800,000 WAR Tokens distributed over the course of 30
                days, with 50% in Farming and Liquidity Pools, 40% in Seasons 1
                + 2 as Battle Rewards, and 10% in team rewards, distributed
                equally with other token distributions, and not to ever be sold
                for more than 10% per daily volume.{" "}
              </RecDesc>
            </Rectangle>
            <Rectangle>
              <RecTitle>What was the reason for launching YieldWars?</RecTitle>
              <RecDesc>
                We were looking at current DeFi projects and thought things were
                pretty lame. We wanted to build a DeFi game that would bring all
                the communities together and incentivize users to engage in
                daily voting, first in YieldWars, and eventually on our
                governance platform to build the future of YieldWars with us.
              </RecDesc>
            </Rectangle>
            <Rectangle>
              <RecTitle>What is the Future Roadmap?</RecTitle>
              <RecDesc>
                Season 1 is about growing the community and introducing everyone
                to the right game mechanics. In Season 2 we will go ham and
                expand the teams from 16 to 32 and really try to bring the
                overall crypto community together in this. We have some big
                plans for after that, but we would like the community to voice
                in and decide what we do to evolve things after Season 2, but we
                can see it going a lot of ways. Think of this as like watching
                Sports for Degens.{" "}
              </RecDesc>
            </Rectangle>
          </FAQSection>
          <Title>Official Medium Posts</Title>
          <MediumSection>
            <TextSection>
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
  font-family: Alegreya;
  font-size: 20px;
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
      margin-bottom: 20px;
    `
  : styled.div`
      width: 80vw;
      border-radius: 8px;
      border: solid 2px #0095f0;
      background-color: #003677;
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
      width: 780px;
      border-radius: 8px;
      border: solid 2px #0095f0;
      background-color: #003677;
      margin-bottom: 20px;
    `
  : styled.div`
      width: 100%;
      border-radius: 8px;
      border: solid 2px #0095f0;
      background-color: #003677;
      margin-bottom: 20px;
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
  height: 270vh;
  background-image: url(${TallSky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
` : styled.div`
width: 100%;
height: 420vh;
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

export default About;
