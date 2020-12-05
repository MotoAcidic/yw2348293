import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../../components/Page";
import useYam from "../../../hooks/useYam";
// import useBet from "../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Uniswap from "../../../assets/img/uniswap@2x.png";
import { getWarStaked, getChessContracts, getChessBets, testTVL } from "../../../yamUtils";
import { getPots, getUserBet, placeETHBet } from "../../../yamUtils";

import VSPNG from '../../../assets/img/VS.png'
import VotingBalance from '../VotingBalance'
import Pool3 from '../Pool3'
import Rules from '../Instructions'
import StatusCard from '../StatusCard'
import MarketCountDown from "../CountDown";


function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}


const Battle = ({ battle }) => {
  const yam = useYam()

  const { account, connect, ethereum } = useWallet()

  let [img1, setImg1] = useState(null)
  let [img2, setImg2] = useState(null)
  let [background, setBackground] = useState(null)
  const [roughBets, setRoughBets] = useState({ pool1: 0, pool2: 0 });

  let imag1 = new Image();
  imag1.onload = function () { setImg1(battle.pool1.graphic) }
  imag1.src = battle.pool1.graphic;

  let imag2 = new Image();
  imag2.onload = function () { setImg2(battle.pool2.graphic) }
  imag2.src = battle.pool2.graphic;

  let backg = new Image();
  backg.onload = function () { setBackground(battle.background) }
  backg.src = battle.background;

  const getRoughBets = async () => {
    let tvl = await getPots(yam, battle._id)
    const pool1 = tvl[0].value
    const pool2 = tvl[1].value
    setRoughBets({ pool1, pool2 });
  }

  useEffect(() => {
    console.log("using effect");
    if (yam && account && !roughBets.pool1 && battle) {
      getRoughBets();
    }
  }, [yam]);


  const stopProp = (e) => {
    e.stopPropagation()
  }

  const contract = null //getChessContracts(yam)

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection background={background} />
        <ContentContainer>
          <Page>
            {/* <Countdown endTime={moment.utc("2020-11-23T02:00", "YYYY-MM-DDTHH:mm").unix() * 1000} /> */}
            {battle && battle !== -1 && (
              <>
                <VersusContainer>
                  <LeftContainer>
                    <InfoBlock style={{ marginBottom: '40px' }}>
                      {battle.description}
                    </InfoBlock>
                    <VersusBackground href={battle.link} target="_none">
                      <ImgWrapper>
                        <Candidate1
                          src={img1}

                        />
                      </ImgWrapper>
                      <CountDownContainer>
                        <MarketCountDown battle={battle} />
                      </CountDownContainer>
                      <Divider>
                        <img src={VSPNG} width="50px" style={{ position: 'absolute', zIndex: 10000 }} />
                      </Divider>
                      <ImgWrapper>
                        <Candidate2
                          src={img2}
                        />
                      </ImgWrapper>
                    </VersusBackground>
                    <InfoBlock href={battle.link} target="_none" style={{ marginTop: '30px' }}>
                      Watch the Game Live!
                    </InfoBlock>
                  </LeftContainer>
                  <StatusCard
                    battle={battle}
                  />
                </VersusContainer>
                <InfoBlock style={{ marginBottom: '30px', marginTop: '30px' }}>
                  {battle.resolution}
                </InfoBlock>
              </>
            )}
            {battle === -1 && (
              <Error404>
                the page you are looking for was not found. (404)
              </Error404>
            )}

            {/* <Rules />
            <Pool3 /> */}
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

const CountDownContainer = styled.div`
position: absolute;
left: 50%;
top: -1%;
z-index: 100001;`


const Divider = !isMobile() ? styled.div` 
display: flex;
justify-content: center;
align-items: center;
height: 100%;
z-index: 10000;
` : styled.div`
width: 95%;
height: 70px;

display: flex;
justify-content: center;
align-items: center;
`

const Error404 = styled.div`
font-family: "Gilroy";
  font-size: 22px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-top: 20px;

`

const SubTitle = styled.div`
font-family: "Gilroy";
  font-size: 22px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin-bottom: 5px;
`
const ImgWrapper = styled.div`
width: 50%;
height: 100%;
transition: all 0.2s ease-in-out;
filter: brightness(100%) contrast(100%) ;
`

const InfoBlock = styled.a`
font-family: "Gilroy";
color: rgb(255, 204, 160);
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
align-items: center;
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
width: 90%;
padding-left: 10px;
padding-right: 10px;
margin-bottom: -8px;
margin-top: 8px;
background-color: rgba(0,0,0,0.6);
border-radius: 8px;
height: 40px;
`

const ModalBlock = styled.div`
width: 534px;
height: 0px;
margin-top: 20vh;
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

const ModalSection = styled.div`
animation: fadein .2s ease-in-out;
`

let Candidate1
let Candidate2

Candidate1 = styled.img`
width: calc(100% - 10px);
height: 100%;
border-radius: 6px 0 0 6px;
cursor: pointer;
object-fit: cover;
border: 8px solid black;
border-right: 4px solid black;
`

Candidate2 = styled.img`
width: calc(100% - 10px);
height: 100%;
border-radius: 0 6px 6px 0;
cursor: pointer;
object-fit: cover;
border: 8px solid black;
border-left: 4px solid black;
`

const VersusBackground = styled.a`
width: 100%;
height: 22.5vw;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
position: relative;
`

const LeftContainer = styled.div`
width: 65%;
height: 100%;
display: flex;
flex-direction: column;
align-items: center;
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
  margin-bottom: 5px;
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
  background-image: url(${props => props.background});
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  background-repeat: no-repeat;
  background-position: fit;
  background-size: cover;
  filter: brightness(.7);
`

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: black;
`;

const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
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
width: 100vw;
height: 60vh;
max-width: 1800px;
max-height: 600px;
min-width: 900px;
min-height: 300px;
display: flex;
flex-direction: row;
justify-content: space-evenly;
font-size: 30px;
margin: 35px auto 0px auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
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