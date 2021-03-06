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
import BattleWhite from '../../../assets/img/battlewhite.png'
import BattleRed from '../../../assets/img/battlered.png'
import BattleGreen from '../../../assets/img/battlegreen.png'
import BattleBlue from '../../../assets/img/battleblue.png'
import Metal from '../../../assets/img/sheetmetal.png'
import Lightning from '../../../assets/img/lightning.png'
import useFarm from '../../../hooks/useFarm'
import useStakedBalance from '../../../hooks/useStakedBalance'
import { getDisplayBalance } from '../../../utils/formatBalance'
import PersVersusBet from './PersVersusBet'
import PlaceBet from './PlaceBet'
import loading from "../../../assets/img/loading.gif";
import useModal from '../../../hooks/useModal'


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
	const [betModal, setBetModal] = useState(false)
	const [isLoading, setLoading] = useState(true)
	let stakedBalance = useStakedBalance(contract)

	const battle1 = {
		pers1: personalities.find(person => person.handle === battles[0].pool1.name),
		pers2: personalities.find(person => person.handle === battles[0].pool2.name)
	}

	const stopProp = (e) => {
		e.stopPropagation()
	}

	const pick1 = (g) => {
		if (!account) {
			connect('injected')
			setTimeout(() => {
				setChecked1(g)
				return
			}, 1300);
		}
		else {
			setChecked1(g)
		}
	}

	const castVote = async () => {
		let vote1
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
		if (!checked1) {
			Swal.fire({
				title: 'Pick your Champion!',
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
		const signature = await yam.web3.eth.personal.sign(JSON.stringify({
			address: account,
			vote: [
				{
					vote: vote1,
					_id: battles[0]._id,
				}
			]
		}), account).catch(err => console.log(err))
		if (!signature) {
			return
		}
		axios.post(`${getServerURI()}/api/pers-vote`, {
			address: account,
			vote: [
				{
					vote: vote1,
					_id: battles[0]._id,
				}
			],
			sig: signature
		}).then(res => {
			console.log(res);
			setVoted(true)
			Swal.fire({
				title: 'Your vote has been recorded successfully!',
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
				title: `Error submitting your vote: ${err.response.status}`,
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
			setTimeout(() => {
				setLoading(false)
			}, 1500);
			return () => {
				document.body.removeChild(script);
			}
		}, [url]);
	};

	const [onPresentBet] = useModal(
		<PlaceBet
			battle1={battle1}
			contender={checked1 === 1 ? battle1.pers1.handle : battle1.pers2.handle}
			id={battles[0]._id}
		/>
	)

	const openBetModal = () => {
		if (!account) {
			connect('injected')
		}
		if (!checked1) {
			Swal.fire({
				title: 'Pick your Champion!',
				customClass: {
					container: 'container-class',
					title: 'title-class',
					content: 'text-class',
					confirmButton: 'confirm-button-class',
				}
			})
			return
		}
		onPresentBet()
	}

	useEffect(() => {
		if (account && yam && !yam.defaultProvider) {
			axios.post(`${getServerURI()}/api/pers-status`, {
				address: account,
			}).then(res => {
				if (res.data === 2 || res.data === 1) {
					console.log(res.data);
					setChecked1(res.data)
					setVoted(true)
				}
				else {
					setVoted(res.data)
				}
			}).catch(err => {
				console.log(err);
			})
		}

	}, [account, yam]);

	let selectedCSS1
	let selectedCSS2
	if (checked1 === 0) {
		selectedCSS1 = { paddingLeft: '3%', paddingRight: '3%' }
		selectedCSS2 = { paddingLeft: '3%', paddingRight: '3%' }
	}
	if (checked1 === 1) {
		selectedCSS1 = { paddingLeft: '6%', paddingRight: '6%' }
		selectedCSS2 = { paddingLeft: '0%', paddingRight: "0%" }
	}
	if (checked1 === 2) {
		selectedCSS1 = { paddingLeft: '0%', paddingRight: "0%" }
		selectedCSS2 = { paddingLeft: '6%', paddingRight: '6%' }
	}

	return (
		<>
			<Container>
				<VersusContainer>
					<Options>
						<TLVersusItem onClick={() => pick1(1)} style={selectedCSS1} checked={checked1 === 1}>
							{checked1 === 1 && <RainbowShadow />}
							<TopBar />
							<LeftBar />
							<BigRightBar />
							<BottomBar />
							<TLVS checked={checked1 === 1}>
								<StyledContent>
									<Picture src={battle1.pers1.picture} />
									<StatBlock>
										<SubTitle>{battle1.pers1.name}</SubTitle>
										<Text>{battle1.pers1.handle}</Text>
										<Text>Followers: {battle1.pers1.followerCount}</Text>
									</StatBlock>
								</StyledContent>
								{isLoading && <Loading src={loading} />}
								{!isMobile() ?
									<a style={{ zIndex: 2000000, position: "relative" }} className="twitter-timeline" data-width="130%" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle1.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
									: <a className="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter noscrollbar" href={`https://twitter.com/${battle1.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								}
								{useScript("https://platform.twitter.com/widgets.js")}
							</TLVS>
						</TLVersusItem>
						{
							isMobile() ? 					<BattleButtonWrapper >
							<BattleButtonContainer>
								{!voted ?
									<BattleButton onClick={castVote} >
										Vote
									</BattleButton>
									:
									<BattleText>Voted</BattleText>
								}
							</BattleButtonContainer>
							<BetButtonContainer>
								<BattleButton onClick={openBetModal} >
									Bet
								</BattleButton>
							</BetButtonContainer>
						</BattleButtonWrapper> :
						<Divider>
							<img src={VSPNG} width="85px" style={{ position: 'absolute', zIndex: 10000 }} />
						</Divider>
						}
						<BLVersusItem onClick={() => pick1(2)} style={selectedCSS2} checked={checked1 === 2}>
							{checked1 === 2 && <RainbowShadow />}
							<TopBar />
							<BigLeftBar />
							<RightBar />
							<BottomBar />
							<BLVS checked={checked1 === 2}>
								<StyledContent>
									<Picture src={battle1.pers2.picture} />
									<StatBlock>
										<SubTitle>{battle1.pers2.name}</SubTitle>
										<Text>{battle1.pers2.handle}</Text>
										<Text>Followers: {battle1.pers2.followerCount}</Text>
									</StatBlock>
								</StyledContent>
								{isLoading && <Loading src={loading} />}
								{!isMobile() ?
									<a className="twitter-timeline" data-width="130%" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle1.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
									: <a className="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter noscrollbar" href={`https://twitter.com/${battle1.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								}
								{useScript("https://platform.twitter.com/widgets.js")}
							</BLVS>
						</BLVersusItem>
					</Options>
					{!isMobile() &&

					<BattleButtonWrapper >
						<BattleButtonContainer>
							{!voted ?
								<BattleButton onClick={castVote} >
									Vote
								</BattleButton>
								:
								<BattleText>Voted</BattleText>
							}
						</BattleButtonContainer>
						<BetButtonContainer>
							<BattleButton onClick={openBetModal} >
								Bet
							</BattleButton>
						</BetButtonContainer>
					</BattleButtonWrapper>
}
				</VersusContainer>

				{/* <PersVersusBet
					battle1={battle1}
					id={battles[0]._id}
					yesterday={yesterday}
				/> */}


				{/* <div style={betModal ? { display: 'block' } : { display: 'none' }}>
					<Modal onClick={() => setBetModal(false)}>
						<ModalBlock onClick={(e) => stopProp(e)}  >
							{yam && <PlaceBet
								battle1={battle1}
								id={battles[0]._id}
								yesterday={yesterday}
							/>}
						</ModalBlock>
					</Modal>
				</div> */}
			</Container>

			<TotalVotesSection>
				{voted && 'Come back tomorrow and claim your victory!'}
				{!voted && account && `You currently have ${getDisplayBalance(stakedBalance)} votes available for BATTLE and you may BET with ETH.`}
			</TotalVotesSection>
			<SmallSpace />
		</>
	)
}

const Loading = styled.img`
	width: 80px;
	height: 80px;
	position: relative;
`

const Container = styled.div`
display: flex;
width: 60%;
justify-content: space-evenly;
align-items: center;
`


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
  margin-top: 50px;
`

const BattleButtonWrapper = !isMobile() ? styled.span`
position: relative;
bottom: 0%;
width: 100%;
pointer-events: none;
display: flex;
user-select: none;
justify-content: center;
` : styled.span`
position: relative;
bottom: 0%;
width: 100%;
pointer-events: none;
display: flex;
user-select: none;
justify-content: center;
z-index: 100000;
`

const BattleButton = styled.div`
font-family: "Edo";
	font-weight: normal;
	font-size: 50px;
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
transform: skew(3deg);
width: 160px;
background-image: url(${Metal});
border: 10px black solid;
border-width: 10px 5px 10px 5px;
background-size: 250px 100px;
pointer-events: all;
margin-right: 10px;
margin-left: -10px;
`

const BetButtonContainer = styled.div`
transform: skew(3deg);
width: 120px;
background-image: url(${Metal});
border: 10px black solid;
border-width: 10px 5px 10px 5px;
background-size: 300px 100px;
pointer-events: all;
`

const BattleText = styled.div`
font-family: "Edo";
	font-weight: normal;
	font-size: 50px;
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
pointer-events: none;
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
top: -2px;
right: -8px;
bottom: -2px;
left: -8px;
z-index: -1;
`

const LeftBar = styled.div`
height: 100%;
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

const BigLeftBar = styled.div`
height: 100%;
width: 24px;
position: absolute;
left: -12px;
top: 0%;
background-color: black;
`

const BigRightBar = styled.div`
height: 100%;
width: 24px;
position: absolute;
right: -12px;
top: 0%;
background-color: black;
`

const TopBar = styled.div`
width: 100%;
height: 16px;
position: absolute;
top: 0%;
left: 0%;
background-color: black;
`

const BottomBar = styled.div`
width: 100%;
height: 16px;
position: absolute;
bottom: 0%;
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

const Divider = !isMobile() ? styled.div` 
display: flex;
justify-content: center;
align-items: center;
height: 100%;
` : styled.div`
width: 95%;
height: 70px;

display: flex;
justify-content: center;
align-items: center;
`

const Seperator = !isMobile() ? styled.div`
  	// height: 27.25%;
  	// min-height: 520px;
	// width: 30px;
	// position: absolute;
	// background-color: black;
	// z-index: 100;
	// transform: skew(3deg);
//   ::before {
// 	content: "";
// 	position: absolute;
// 	top: 17.5px;
// 	// left: 10%;
// 	width: 2px;
// 	height: 28%;
// 	background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
// }
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
justify-content: space-evenly;
width: 100%;
height: 65vh;
min-height: 600px;
margin-top: 40px;
margin-bottom: 30px;
min-width: 1300px;
`

const StatBlock = styled.div`
margin-bottom: 5px;
display: flex;
flex-direction: column;
justify-content: space-evenly;
align-items: center;
height: 50%;
`

const Picture = !isMobile () ? styled.img`
width: 170px;
height: 170px;
border-radius: 50%;
margin-bottom: 20px;
` : styled.img`
width: 120px;
height: 120px;
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


const TLVersusItem = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 92%;
width: 50%;
transform: skew(3deg);
will-change: padding;
will-change: transform;
transition: all .2s ease-out 10ms;
z-index: 100;
padding-top: 2%;
padding-bottom: 2%;
&:hover {
	transform: skew(3deg) scale(${props => props.checked ? 1 : 1.025});
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
` : styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 350px;
width: 74vw;
transform: skew(3deg);
will-change: padding;
will-change: transform;
transition: all .2s ease-out 10ms;
z-index: 100;
padding-top: 2%;
padding-bottom: 2%;
&:hover {
	transform: skew(3deg) scale(${props => props.checked ? 1 : 1.025});
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

const BLVersusItem = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 92%;
width: 50%;
transform: skew(3deg);
will-change: padding;
will-change: transform;
transition: all .2s ease-out 10ms ;
z-index: 100;
padding-top: 2%;
padding-bottom: 2%;
&:hover {
	transform: skew(3deg) scale(${props => props.checked ? 1 : 1.025});
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
}` : styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 350px;
width: 74vw;
transform: skew(3deg);
will-change: padding;
will-change: transform;
transition: all .2s ease-out 10ms ;
z-index: 100;
padding-top: 2%;
padding-bottom: 2%;
&:hover {
	transform: skew(3deg) scale(${props => props.checked ? 1 : 1.025});
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


const TLVS = styled.div`
width: 100%;
min-width: 300px;
height: 95%;
min-height: 180px;
display: flex;
flex-direction: column;
// justify-content: flex-start;
align-items: center;
transform: skew(-3deg) scale(${props => props.checked ? 1.1 : 1});
transition: transform .2s ease-out 15ms;
will-change: transform;
// pointer-events: none;
z-index: 102;
margin-top: 30px;
`


const BLVS = styled.div`
width: 100%;
min-width: 300px;
height: 100%;
min-height: 180px;
display: flex;
flex-direction: column;
// justify-content: flex-start;
align-items: center;
transform: skew(-3deg) scale(${props => props.checked ? 1.1 : 1});
transition: transform .2s ease-out 15ms;
will-change: transform;
// pointer-events: none;
z-index: 102;
margin-top: 30px;
margin-bottom: 30px;
`


const Options = !isMobile() ? styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: row;
justify-content: space-evenly;
` : styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
`


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
// width: 65vw;
// min-width: 600px;
// height: 100%;
// min-height: 550px;
width: 75%;
height: 55vh;
min-height: 480px;
margin-top: 15px;
margin-bottom: 20px;
min-width: 830px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
font-size: 30px;
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
	flex-direction: row;
	height: 40%;
	width: 75%;
	align-items: center;
	justify-content: space-evenly;
`

const SubTitle = !isMobile() ? styled.div`
font-family: "GilroyMedium";
margin-bottom: 5px;
font-size: 26px;
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
font-size: 16px;
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