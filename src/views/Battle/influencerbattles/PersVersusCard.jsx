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
import BettingCard from "./VersusCard";
import BattleWhite from '../../../assets/img/battlewhite.png'
import BattleRed from '../../../assets/img/battlered.png'
import BattleGreen from '../../../assets/img/battlegreen.png'
import BattleBlue from '../../../assets/img/battleblue.png'
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
	// console.log(question);
	const yam = useYam()
	const { account, connect } = useWallet()
	// console.log(battles);
	const [voted, setVoted] = useState(false)
	const [checked1, setChecked1] = useState(0)
	const [checked2, setChecked2] = useState(0)

	const battle1 = {
		pers1: personalities.find(person => person.handle === battles[0].pool1.name),
		pers2: personalities.find(person => person.handle === battles[0].pool2.name)
	}
	const battle2 = {
		pers1: personalities.find(person => person.handle === battles[1].pool1.name),
		pers2: personalities.find(person => person.handle === battles[1].pool2.name)
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
		console.log(checked1, checked2);
		if (!checked1 || !checked2)
			return
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
				text: `Response: ${err}\n Please let us know and we'll take care of it.`,
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
			<Title>Who Will Win?</Title>
			<BattleContainer>
				<VersusContainer>
					<Options>
						<TLVersusItem onClick={() => pick1(1)}>
							{checked1 === 1 && <RainbowShadow />}
							<TopBar />
							<LeftBar />
							<RightBar />
							<BottomBar />
						</TLVersusItem>
						<TopVS>
							{!isMobile() ?
								<a class="twitter-timeline" data-width="58%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle1.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								: <a class="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle1.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
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
						</TopVS>
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
						</BLVersusItem>
						<BottomVS>
							{!isMobile() ?
								<a className="twitter-timeline" data-width="58%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle1.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
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
						</BottomVS>
					</Options>
				</VersusContainer>
				<VerticalSeperator />
				<VersusContainer>
					<Options>
						<TRVersusItem onClick={() => pick2(1)}>
							{checked2 === 1 && <RainbowShadow />}
							<TopBar />
							<LeftBar />
							<RightBar />
							<BottomBar />
						</TRVersusItem>
						<TopVS>
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
								<a className="twitter-timeline" data-width="58%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle2.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								: <a className="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle2.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
							}
							{useScript("https://platform.twitter.com/widgets.js")}
						</TopVS>
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
						</BRVersusItem>
						<BottomVS>
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
								<a className="twitter-timeline" data-width="58%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle2.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								: <a className="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" data-chrome="noheader nofooter" href={`https://twitter.com/${battle2.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
							}
							{useScript("https://platform.twitter.com/widgets.js")}
						</BottomVS>
					</Options>
				</VersusContainer>
			</BattleContainer>
			<BattleButtonContainer>
				<BattleButton onClick={castVote} >
					Battle
				</BattleButton>
				<BattleButton onClick={castVote} >
					Bet
				</BattleButton>
			</BattleButtonContainer>
			<Space />
		</>
	)
}

const BattleButton = styled.div`
font-family: "Edo";
	font-weight: normal;
	font-size: 50px;
	background: linear-gradient(yellow, red, black);
	-webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const BattleButtonContainer = styled.div`
position: absolute;
top: 480px;
z-index: 1001;
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
width: 10px;
position: absolute;
left: 0%;
bottom: 0%;
background-color: black;
`

const RightBar = styled.div`
height: 98%;
width: 10px;
position: absolute;
right: 0%;
top: 0%;
background-color: black;
`

const TopBar = styled.div`
width: 100%;
height: 30px;
position: absolute;
top: -5%;
left: 0%;
background-color: black;
`

const BottomBar = styled.div`
width: 100%;
height: 30px;
position: absolute;
bottom: -5%;
left: 0%;
background-color: black;
`

const VerticalSeperator = !isMobile() ? styled.div`
height: 700px;
width: 1px;
background-image: linear-gradient(180deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
	z-index: 100;
` : styled.div`
  width: 150px;
	height: 1px;
	position: absolute;
  background-image: linear-gradient(180deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
`

const Seperator = !isMobile() ? styled.div`
  width: 40%;
  min-width: 600px;
  margin-left: 2%;
	height: 35px;
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
width: 90%;
margin-top: 20px;
min-width: 1000px;
`

const StatBlock = styled.div`
margin-bottom: 5px;
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
`

const Picture = styled.img`
width: 160px;
height: 160px;
  border-radius: 50%;
	margin-bottom: 20px;

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


const TLVersusItem = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 100%;
padding: 9% 6% 6% 6%;
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
padding: 9% 6% 6% 6%;
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
padding: 9% 6% 6% 6%;
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
padding: 9% 6% 6% 6%;
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

const TopVS = styled.div`
width: 35%;
min-width: 500px;
position: absolute;
display: flex;
flex-direction: row;
justify-content: space-evenly;
transform: translate(40px, -185px);
pointer-events: none;
z-index: 102;
`

const BottomVS = styled.div`
width: 35%;
min-width: 500px;
position: absolute;
display: flex;
flex-direction: row;
justify-content: space-evenly;
transform: translate(40px, 170px);
pointer-events: none;
z-index: 102;
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

const VersusContainer = !isMobile() ? styled.div`
width: 40vw;
min-width: 600px;
height: 700px;
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
	background-color: rgba(256,256,256,0.08);
	border-radius: 8px;
border: 2px solid rgba(255, 183, 0, 0.3);`

const StyledContent = styled.div`
  display: flex;
	flex-direction: column;
	height: 100%;
	width: 30%;
	align-items: center;
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


export default Versus