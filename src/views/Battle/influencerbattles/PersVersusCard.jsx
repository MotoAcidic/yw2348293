import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import Button from '../../../components/Button'
import CardIcon from '../../../components/CardIcon'
import checkedIcon from '../../../assets/img/checked.png'
import uncheckedIcon from '../../../assets/img/unchecked.png'
import VSPNG from '../../../assets/img/VS.png'

import useYam from '../../../hooks/useYam'
import { useWallet } from 'use-wallet'
import DailyQuestion from "./DailyQuestion.jsx";
import useFarms from '../../../hooks/useFarms'
import Cookie from 'universal-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import personalities from './personalities'
import BettingCard from "./unused/VersusCard";
import BattleWhite from '../../../assets/img/battlewhite.png'
import BattleRed from '../../../assets/img/battlered.png'
import BattleGreen from '../../../assets/img/battlegreen.png'
import BattleBlue from '../../../assets/img/battleblue.png'
import MetalButton from '../../../assets/img/battlebutton.png'
import Lightning from '../../../assets/img/lightning.png'
import useFarm from '../../../hooks/useFarm'
import useStakedBalance from '../../../hooks/useStakedBalance'
import { getDisplayBalance } from '../../../utils/formatBalance'
import PersVersusBet from './PersVersusBet'

import './swal.css';
import './twitter.css'

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

function getServerURI() {
	if (window.location.hostname === 'localhost') {
		return 'http://localhost:5000'
	}
	return 'https://yieldwars-api.herokuapp.com'
}

let cookie = new Cookie()


const Versus = ({ battles }) => {
	const {
		contract,
		depositToken,
		depositTokenAddress,
		earnToken,
		name,
		icon,
	} = useFarm('BATTLEPOOL') || {
		contract: null,
		depositToken: '',
		depositTokenAddress: '',
		earnToken: '',
		name: '',
		icon: ''
	}
	const yam = useYam()
	const { account, connect } = useWallet()
	// console.log(battles);
	const [voted, setVoted] = useState(false)
	const [checked1, setChecked1] = useState(0)
	const [checked2, setChecked2] = useState(0)
	const [betModal, setBetModal] = useState(false)
	let stakedBalance = useStakedBalance(contract)

	const battle1 = {
		pers1: personalities.find(person => person.handle === battles[0].pool1.name),
		pers2: personalities.find(person => person.handle === battles[0].pool2.name)
	}
	const battle2 = {
		pers1: personalities.find(person => person.handle === battles[1].pool1.name),
		pers2: personalities.find(person => person.handle === battles[1].pool2.name)
	}

	const stopProp = (e) => {
		e.stopPropagation()
	}

	const pick1 = (g) => {
		if (!account) {
			connect('injected')
		}
		cookie.set(battles[0]._id, g)
		setChecked1(g)
	}

	const pick2 = (g) => {
		if (!account) {
			connect('injected')
		}
		cookie.set(battles[1]._id, g)
		setChecked2(g)
	}

	const castVote = async () => {
		let vote1
		let vote2
		if (!account) {
			connect('injected')
		}
		if (!stakedBalance.toNumber() && account) {
			Swal.fire({
				title: 'You must have war staked in the WarChest to battle. If you only have Eth you may Bet.',
				customClass: {
					container: 'container-class',
					title: 'title-class',
					content: 'text-class',
					confirmButton: 'confirm-button-class',
				}
			}).then(res => {
				window.scroll(0, 800)
			})
			return
		}
		if (!checked1 || !checked2) {
			Swal.fire({
				title: 'Pick your Champions!',
				customClass: {
					container: 'container-class',
					title: 'title-class',
					content: 'text-class',
					confirmButton: 'confirm-button-class',
				}
			})
			return
		}
		if (checked1 === 1)
			vote1 = battle1.pers1.handle
		if (checked1 === 2)
			vote1 = battle1.pers2.handle
		if (checked2 === 1)
			vote2 = battle2.pers1.handle
		if (checked2 === 2)
			vote2 = battle2.pers2.handle
		console.log(vote1, vote2);
		const signature = await yam.web3.eth.personal.sign(JSON.stringify({
			address: account,
			vote: [
				{
					vote: vote1,
					_id: battles[0]._id,
				},
				{
					vote: vote2,
					_id: battles[1]._id,
				}
			]
		}), account).catch(err => console.log(err))
		console.log(signature);
		axios.post(`${getServerURI()}/api/pers-vote`, {
			address: account,
			vote: [
				{
					vote: vote1,
					_id: battles[0]._id,
				},
				{
					vote: vote2,
					_id: battles[1]._id,
				}
			],
			sig: signature
		}).then(res => {
			console.log(res);
			setVoted(true)
			Swal.fire({
				title: 'Your votes have been recorded successfully!',
				text: 'Come back tomorrow. All rewards will be distributed tomorrow at 16:00 UTC',
				width: '600',
				height: '465',
				padding: '10',
				customClass: {
					container: 'container-class',
					title: 'title-class',
					content: 'text-class',
					confirmButton: 'confirm-button-class',
				}
			})
		}).catch(err => {
			console.log(err);
			Swal.fire({
				title: `Error submitting your votes: ${err.response.status}`,
				width: '600',
				height: '465',
				padding: '10',
				customClass: {
					container: 'container-class',
					title: 'title-class',
					content: 'text-class',
					confirmButton: 'confirm-button-class',
				}
			})
		})
	}

	const useScript = url => {
		useEffect(() => {
			const script = document.createElement('script');

			script.src = url;
			script.async = true;
			document.body.appendChild(script);
			return () => {
				document.body.removeChild(script);
			}
		}, [url]);
	};

	useEffect(() => {
		if (account) {
			axios.post(`${getServerURI()}/api/pers-status`, {
				address: account,
			}).then(res => {
				console.log(res.data);
				setVoted(res.data)
			}).catch(err => {
				console.log(err);
			})
		}

	}, [account]);

	return (
		<>
			<BattleContainer>
				<VersusContainer>
					<Options>
						<TLVersusItem onClick={() => pick1(1)}>
							{checked1 === 1 && <RainbowShadow />}
							<TopBar />
							<LeftBar />
							<RightBar />
							<BottomBar />
							<TLVS>
								{!isMobile() ?
									<a className="twitter-timeline" data-width="65%" data-height="95%" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle1.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
									: <a className="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle1.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								}
								{useScript("https://platform.twitter.com/widgets.js")}
								<StyledContent>
									<Picture src={battle1.pers1.picture} />
									<StatBlock>
										<SubTitle>{battle1.pers1.name}</SubTitle>
										<Text>{battle1.pers1.handle}</Text>
									</StatBlock>
									<StatBlock>
										<Text>Followers: {battle1.pers1.followerCount}</Text>
									</StatBlock>
								</StyledContent>
							</TLVS>
						</TLVersusItem>
						<Divider>
							<Seperator />
							<img src={VSPNG} width="85px" style={{ position: 'absolute', zIndex: 100 }} />
						</Divider>
						<BLVersusItem onClick={() => pick1(2)}>
							{checked1 === 2 && <RainbowShadow />}
							<TopBar />
							<LeftBar />
							<RightBar />
							<BottomBar />
							<BLVS>
								{!isMobile() ?
									<a className="twitter-timeline" data-width="65%" data-height="95%" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle1.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
									: <a className="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle1.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								}
								{useScript("https://platform.twitter.com/widgets.js")}
								<StyledContent>
									<Picture src={battle1.pers2.picture} />
									<StatBlock>
										<SubTitle>{battle1.pers2.name}</SubTitle>
										<Text>{battle1.pers2.handle}</Text>
									</StatBlock>
									<StatBlock>
										<Text>Followers: {battle1.pers2.followerCount}</Text>
									</StatBlock>
								</StyledContent>
							</BLVS>
						</BLVersusItem>
					</Options>
				</VersusContainer>
				<VerticalSeperator />
				<BattleButtonWrapper>
					<GraphicContainer src={MetalButton} />
					<BattleButtonContainer>
						{!voted ?
							<BattleButton onClick={castVote} >
								Battle
						</BattleButton>
							:
							<BattleText>Voted</BattleText>
						}
						<HDivider />
						<BattleButton onClick={() => {
							if (!account) {
								connect('injected')
							}
							setBetModal(true)
						}} >
							Bet
						</BattleButton>
					</BattleButtonContainer>
				</BattleButtonWrapper>
				<VersusContainer>
					<Options>
						<TRVersusItem onClick={() => pick2(1)}>
							{checked2 === 1 && <RainbowShadow />}
							<TopBar />
							<LeftBar />
							<RightBar />
							<BottomBar />
							<TRVS>
								<StyledContent>
									<Picture src={battle2.pers1.picture} />
									<StatBlock>
										<SubTitle>{battle2.pers1.name}</SubTitle>
										<Text>{battle2.pers1.handle}</Text>
									</StatBlock>
									<StatBlock>
										<Text>Followers: {battle2.pers1.followerCount}</Text>
									</StatBlock>
								</StyledContent>
								{!isMobile() ?
									<a className="twitter-timeline" data-width="65%" data-height="95%" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle2.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
									: <a className="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle2.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								}
								{useScript("https://platform.twitter.com/widgets.js")}
							</TRVS>
						</TRVersusItem>
						<Divider>
							<Seperator />

							<img src={VSPNG} width="85px" style={{ position: 'absolute', zIndex: 100 }} />
						</Divider>
						<BRVersusItem onClick={() => pick2(2)}>
							{checked2 === 2 && <RainbowShadow />}
							<TopBar />
							<LeftBar />
							<RightBar />
							<BottomBar />
							<BRVS>
								<StyledContent>
									<Picture src={battle2.pers2.picture} />
									<StatBlock>
										<SubTitle>{battle2.pers2.name}</SubTitle>
										<Text>{battle2.pers2.handle}</Text>
									</StatBlock>
									<StatBlock>
										<Text>Followers: {battle2.pers2.followerCount}</Text>
									</StatBlock>
								</StyledContent>
								{!isMobile() ?
									<a className="twitter-timeline" data-width="65%" data-height="95%" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle2.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
									: <a className="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle2.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								}
								{useScript("https://platform.twitter.com/widgets.js")}
							</BRVS>
						</BRVersusItem>
					</Options>
				</VersusContainer>
			</BattleContainer>

			<TotalVotesSection>
				{voted && 'Come back tomorrow and claim your victory!'}
				{!voted && (account ? `You currently have ${getDisplayBalance(stakedBalance)} votes available for BATTLE and you may BET with ETH.` : 'Connect wallet to see available votes')}
			</TotalVotesSection>
			<SmallSpace />
			<div style={betModal ? { display: 'block' } : { display: 'none', height: '0px' }}>
				<Modal onClick={() => setBetModal(false)}>
					<ModalBlock onClick={(e) => stopProp(e)} style={{ width: '600px' }} >
						{yam && <PersVersusBet
							battle1={battle1}
							battle2={battle2}
							betContract={null}
						/>}
					</ModalBlock>
				</Modal>
			</div>
		</>
	)
}


const TotalVotesSection = styled.div`
font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  z-index: 14000;
`

const BattleButtonWrapper = styled.span`
position: absolute;
left: 50%;
transform: translateX(-50%);
z-index: 1001;
filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.9));
pointer-events: none;
`

const HDivider = styled.div`
margin-left: 10%;
width: 80%;
	height: 1px;
	background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
	box-shadow: 0 3px 7px 4px rgba(14, 14, 14, .6);
`

const BattleButton = styled.div`
font-family: "Edo";
	font-weight: normal;
	font-size: 60px;
	background: linear-gradient(
		45deg,
		rgba(255, 0, 0, 1) 0%,
		rgba(255, 60, 0, 1) 10%,
		rgba(255, 100, 33, 1) 20%,
		rgba(210, 180, 74, 1) 30%,
		rgba(180, 218, 150, 1) 40%,
		rgba(47, 201, 180, 1) 50%,
		rgba(28, 127, 200, 1) 60%,
		rgba(95, 21, 180, 1) 70%,
		rgba(186, 12, 150, 1) 80%,
		rgba(251, 7, 50, 1) 90%,
		rgba(255, 0, 0, 1) 100%
	  );	background-size: 200% 200%;
	animation: dOtNsp2 3s linear infinite;
	-webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-color: lightgrey;
  -webkit-text-stroke-width: 1px;
  text-shadow: 4px 4px 8px #000000;
  &:hover {
	transform: scale(1.1) translateY(-1px) !important;
	cursor: pointer;
	}
`

const BattleButtonContainer = styled.div`
position: absolute;
top: 39%;
left: 50%;
transform: translateX(-50%) translateY(-40%);
pointer-events: all;
`

const BattleText = styled.div`
font-family: "Edo";
	font-weight: normal;
	font-size: 60px;
	background: linear-gradient(blue, purple, black);
	-webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-color: lightgrey;
  -webkit-text-stroke-width: 1px;
  text-shadow: 4px 4px 8px #000000;
`

const GraphicContainer = styled.img`
// width: 16vw;
// min-width: 230px;
// height: 71vh;
// min-height: 550px;
width: 12vw;
min-width: 230px;
height: 15vh;
// min-height: 550px;
// pointer-events: none;
// filter: grayscale(.8);
`

const RainbowShadow = styled.div`
background: linear-gradient(
  45deg,
  rgba(255, 0, 0, 1) 0%,
  rgba(255, 154, 0, 1) 10%,
  rgba(208, 222, 33, 1) 20%,
  rgba(79, 220, 74, 1) 30%,
  rgba(63, 218, 216, 1) 40%,
  rgba(47, 201, 226, 1) 50%,
  rgba(28, 127, 238, 1) 60%,
  rgba(95, 21, 242, 1) 70%,
  rgba(186, 12, 248, 1) 80%,
  rgba(251, 7, 217, 1) 90%,
  rgba(255, 0, 0, 1) 100%
);
background-size: 300% 300%;
animation: dOtNsp 2s linear infinite;
filter: blur(6px);
position: absolute;
top: -20px;
right: -2px;
bottom: -20px;
left: -2px;
z-index: -1;
`

const LeftBar = styled.div`
height: 104.5%;
width: 8px;
position: absolute;
left: 0%;
bottom: 0%;
background-color: black;
`

const RightBar = styled.div`
height: 100%;
width: 8px;
position: absolute;
right: 0%;
top: 0%;
background-color: black;
`

const TopBar = styled.div`
width: 100%;
height: 20px;
position: absolute;
top: -5%;
left: 0%;
background-color: black;
`

const BottomBar = styled.div`
width: 100%;
height: 20px;
position: absolute;
bottom: -5%;
left: 0%;
background-color: black;
`

const VerticalSeperator = !isMobile() ? styled.div`
height: 700px;
width: 1px;
height: 70vh;
min-height: 600px;
background-image: linear-gradient(180deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
z-index: 100;
` : styled.div`
  width: 150px;
	height: 1px;
	position: absolute;
  background-image: linear-gradient(180deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
`

const Seperator = !isMobile() ? styled.div`
  width: 40.5%;
  min-width: 610px;
  margin-left: 2%;
	height: 30px;
	position: absolute;
	background-color: black;
	z-index: 100;
  ::before {
	content: "";
	position: absolute;
	top: 17.5px;
	left: 10%;
	width: 80%;
	height: 1px;
	background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));

}
` : styled.div`
  width: 150px;
	height: 1px;
	position: absolute;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
`
const BattleContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
width: 100%;
margin-top: 20px;
min-width: 1300px;
`

const StatBlock = styled.div`
margin-bottom: 5px;
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
`

const Picture = styled.img`
height: 40%;
width: 40%;
min-width: 130px;
min-height: 130px;
border-radius: 50%;
margin-bottom: 20px;
`

const Title = !isMobile() ? styled.div`
font-family: "Gilroy";
  font-size: 26px;
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


const TLVersusItem = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 100%;
padding: 4% 6% 6% 6%;
transform: skew(3deg);
transition: all .1s ease-in-out;
&:hover {
	transform: skew(3deg) scale(1.05);
	cursor: pointer;
	z-index: 101;
}
::before {
	content: "";
	position: absolute;
	top: 0; left: 0;
	width: 100%; height: 100%;
	background-image: url(${BattleBlue});
	background-size: cover;
}
`

const BLVersusItem = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 100%;
padding: 6% 6% 6% 6%;
transform: skew(3deg);
transition: all .1s ease-in-out;
&:hover {
	transform: skew(3deg) scale(1.05);
	cursor: pointer;
	z-index: 101;
}
::before {
	content: "";
	position: absolute;
	top: 0; left: 0;
	width: 100%; height: 100%;
	background-image: url(${BattleRed});
	background-size: cover;
}
`

const TRVersusItem = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 100%;
padding: 4% 6% 6% 6%;
transform: skew(-3deg);
transition: all .1s ease-in-out;
&:hover {
	transform: skew(-3deg) scale(1.05);
	cursor: pointer;
	z-index: 101;
}
::before {
	content: "";
	position: absolute;
	top: 0; left: 0;
	width: 100%; height: 100%;
	background-image: url(${BattleGreen});
	background-size: cover;
}
`

const BRVersusItem = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 100%;
padding: 6% 6% 6% 6%;
transform: skew(-3deg);
transition: all .1s ease-in-out;
&:hover {
	transform: skew(-3deg) scale(1.05);
	cursor: pointer;
	z-index: 101;
}
::before {
	content: "";
	position: absolute;
	top: 0; left: 0;
	width: 100%; height: 100%;
	background-image: url(${BattleWhite});
	background-size: cover;
}
`

const TLVS = styled.div`
width: 45%;
min-width: 500px;
height: 25vh;
min-height: 220px;
position: absolute;
display: flex;
flex-direction: row;
justify-content: space-between;
transform: skew(-3deg);
// pointer-events: none;
z-index: 102;
`

const TRVS = styled.div`
width: 45%;
min-width: 500px;
height: 25vh;
min-height: 220px;
position: absolute;
display: flex;
flex-direction: row;
justify-content: space-between;
transform: skew(3deg);
// pointer-events: none;
z-index: 102;
`

const BLVS = styled.div`
width: 45%;
min-width: 500px;
height: 25vh;
min-height: 220px;
position: absolute;
display: flex;
flex-direction: row;
justify-content: space-between;
transform: skew(-3deg);
// pointer-events: none;
z-index: 102;
margin-top: 5px;
`

const BRVS = styled.div`
width: 45%;
min-width: 500px;
height: 25vh;
min-height: 220px;
position: absolute;
display: flex;
flex-direction: row;
justify-content: space-between;
transform: skew(3deg);
// pointer-events: none;
z-index: 102;
margin-top: 5px;
`

const Options = !isMobile() ? styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
justify-content: space-around;
` : styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;`

const Divider = !isMobile() ? styled.div`
  width: 95%;
 
display: flex;
justify-content: center;
align-items: center;
` : styled.div`
width: 95%;
height: 70px;

display: flex;
justify-content: center;
align-items: center;`

const RecDesc = styled.div`
font-family: "Gilroy";
  font-size: 20px;
	font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
	`;

const Space = styled.div`
height: 80px;`

const SmallSpace = styled.div`
height: 30px;`

const VersusContainer = !isMobile() ? styled.div`
width: 40vw;
min-width: 600px;
height: 70vh;
min-height: 550px;
display: flex;
align-items: center;
font-size: 30px;
margin: 0 auto 3vh auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 2px;
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
	// background-color: rgba(256,256,256,0.08);
	border-radius: 8px;
// border: 2px solid rgba(255, 183, 0, 0.3);
`

const StyledContent = styled.div`
  display: flex;
	flex-direction: column;
	height: 100%;
	width: 30%;
	align-items: center;
	margin-top: 20px;
`

const SubTitle = !isMobile() ? styled.div`
font-family: "GilroyMedium";
margin-bottom: 5px;
font-size: 20px;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
` : styled.div`
font-family: "GilroyMedium";
margin-bottom: 2px;
font-size: 20px;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
`

const Text = !isMobile() ? styled.div`
font-family: "GilroyMedium";
font-size: 12px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
	margin-bottom: 2px;
	letter-spacing: 1px;
` : styled.div`
font-family: "GilroyMedium";
font-size: 12px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
	margin-bottom: 10px;
	letter-spacing: 1px;
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

const ModalBlock = styled.div`
width: 534px;
height: 0px;
margin-top: 23vh;
`

export default Versus