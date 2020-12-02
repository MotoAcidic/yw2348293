import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../components/Page";
import useYam from "../../hooks/useYam";
// import useBet from "../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";

import Uniswap from "../../assets/img/uniswap@2x.png";
import Vitalik from "../../assets/img/chess_vitalik.png"
import Alexandra from "../../assets/img/chess_alexandra_2.png"

import Chess from "../../assets/img/chess.png";
import Rook from '../../assets/img/rook.png'

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


const Battle = () => {
  const yam = useYam()

  const { account, connect, ethereum } = useWallet()

  let [battle, setBattle] = useState(null)
  let [img1, setImg1] = useState(null)
  let [img2, setImg2] = useState(null)
  let [background, setBackground] = useState(null)
  let [modal, setShowModal] = useState(false);
  let [candidate, setCandidate] = useState("pool1");
  const [roughBets, setRoughBets] = useState({ pool1: 0, pool2: 0 });

  const onClickPool1 = (e) => {
    if (!account) {
      connect('injected')
    }
    setCandidate("pool1")
    setShowModal(true)
  }

  const onClickPool2 = (e) => {
    if (!account) {
      connect('injected')
    }
    setCandidate("pool2")
    setShowModal(true)
  }

  // const getRoughBets = async () => {
  //   let tvl = await chessTVL(yam, account)
  //   const pool1 = tvl.pool1Total
  //   const pool2 = tvl.pool2Total
  //   setRoughBets({ pool1, pool2 });
  // }

  useEffect(() => {
    console.log("using effect");
    if (!battle) {
      let url = window.location.pathname
      console.log(url);

      url = url.substring(8, url.length)
      axios.post(`${getServerURI()}/markets/get-market`, {
        id: url
      }).then(res => {
        setBattle(res.data)

        let img1 = new Image();
        img1.onload = function () { setImg1(res.data.pool1.graphic) }
        img1.src = res.data.pool1.graphic;

        let img2 = new Image();
        img2.onload = function () { setImg2(res.data.pool2.graphic) }
        img2.src = res.data.pool2.graphic;

        let background = new Image();
        background.onload = function () { setBackground(res.data.background) }
        background.src = res.data.background;
      }).catch(err => {
        console.log(err);
        setBattle(-1)
      })
    }
    // if (yam && account && !roughBets.pool1) {
    //   getRoughBets();
    // }
  }, [yam]);

  const closeModal = (event) => {
    setShowModal(false)
  }

  const stopProp = (e) => {
    e.stopPropagation()
  }

  return (
    <Switch>
      <StyledCanvas>
        <BackgroundSection background={background} />
        <ContentContainer>
          <Page>

            {/* <SubTitle>
              <a target="_blank"
                rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Vitalik_Buterin">
                Vitalik Buterin
              </a>

              &nbsp;is playing&nbsp;
              <a target="_blank"
                rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Alexandra_Botez">
                Alexandra Botez
              </a>
               &nbsp;in chess. Who Will Win?
            </SubTitle> */}
            {/* <Countdown endTime={moment.utc("2020-11-23T02:00", "YYYY-MM-DDTHH:mm").unix() * 1000} /> */}
            {/* {roughBets.trump > 0 &&
              <VotingBalance votes1={roughBets.trump} votes2={roughBets.biden} />
            } */}
            {battle && battle !== -1 && (
              <VersusContainer>
                <VersusBackground>
                  <ImgWrapper onClick={(e) => onClickPool1(e)}>
                    <Candidate1
                      src={img1}

                    />
                  </ImgWrapper>
                  <Versus>VS</Versus>
                  <ImgWrapper onClick={(e) => onClickPool2(e)} >
                    <Candidate2
                      src={img2}
                    />
                  </ImgWrapper>
                </VersusBackground>
              </VersusContainer>
            )}
            {battle === -1 && (
              <Error404>
                the page you are looking for was not found. (404)
              </Error404>
            )}
            {/* <div style={modal ? { display: 'block' } : { display: 'none' }}>
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
            </div> */}
            {/* <InfoBlock href={"https://www.twitch.tv/botezlive"}
              target="_blank"
            >
              <img src={Twitch} width="30px" height="30px" />
                  Watch the match on Twitch!
              <img src={Twitch} width="30px" height="30px" />

            </InfoBlock>

            <Rules />
            <Pool3 /> */}
          </Page>
        </ContentContainer>
      </StyledCanvas>
    </Switch>
  );
};

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

const AFK = styled.div`
height: 65vh;
display: flex;
align-items: center;
justify-content: center;
text-shadow: -1px 1px 0 #000,
1px 1px 0 #000,
1px -1px 0 #000,
-1px -1px 0 #000;`

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

const Versus = styled.div`
position: absolute;
height: 180px;
width: 110px;
z-index: 20004;
display: flex;
align-items: center;
justify-content: center;
background-image: url(${Rook});
background-size: contain;
background-repeat: no-repeat;
margin-top: 50px;
filter: drop-shadow(0 0 0.75rem white)
`

const ImgWrapper = styled.div`
width: 50%;
height: 100%;
transition: all 0.2s ease-in-out;
// filter: brightness(100%) contrast(100%) grayscale(100%) ;
&:hover {
  transition: all 0.2s ease-in-out;
  // filter: brightness(110%) contrast(110%) grayscale(80%);
  transform: scale(1.05);
  z-index: 2000000;
}
`

const InfoBlock = styled.a`
font-family: "Gilroy";
color: rgb(255, 204, 160);
font-size: 22px;
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
width: 420px;
margin-bottom: 80px;
background-color: rgba(0,0,0,0.3);
border-radius: 8px;
height: 40px;
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

Candidate1 = styled.img`
width: calc(100% - 10px);
height: 100%;
border-radius: 6px 0 0 6px;
cursor: pointer;
object-fit: cover;
border: 10px solid black;
border-right: 2px solid black;
`

Candidate2 = styled.img`
width: calc(100% - 10px);
height: 100%;
border-radius: 0 6px 6px 0;
cursor: pointer;
object-fit: cover;
border: 10px solid black;
border-left: 2px solid black;
`

const VersusBackground = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: row;
justify-content: center;
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
`

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
width: 90vw;
max-width: 1400px;
max-height: 650px;
height: 40vw;
display: flex;
align-items: center;
font-size: 30px;
margin: 0 auto 40px auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
background-color: rgba(256,256,256,0.08);
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