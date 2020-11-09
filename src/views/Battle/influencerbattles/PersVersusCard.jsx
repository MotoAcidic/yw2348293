import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import Button from '../../../components/Button'
import CardIcon from '../../../components/CardIcon'
import checkedIcon from '../../../assets/img/checked.png'
import uncheckedIcon from '../../../assets/img/unchecked.png'
import VS from '../../../assets/img/VS.png'

import useYam from '../../../hooks/useYam'
import { useWallet } from 'use-wallet'
import DailyQuestion from "./DailyQuestion.jsx";
import useFarms from '../../../hooks/useFarms'
import Cookie from 'universal-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import personalities from './personalities'
import BettingCard from "./VersusCard";
import Battle from '../../../assets/img/battle.jpg'
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
	const [checked1, setChecked1] = useState(cookie.get(battles[0]._id))
	const [checked2, setChecked2] = useState(cookie.get(battles[1]._id))

	const battle1 = {
		pers1: personalities.find(person => person.handle === battles[0].pool1.name),
		pers2: personalities.find(person => person.handle === battles[0].pool2.name)
	}
	const battle2 = {
		pers1: personalities.find(person => person.handle === battles[1].pool1.name),
		pers2: personalities.find(person => person.handle === battles[1].pool2.name)
	}

	const pick1 = (g) => {
		cookie.set(battles[0]._id, g)
		setChecked1(g)
	}

	const pick2 = (g) => {
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
				text: `Response: ${err.response.data}\n Please let us know and we'll take care of it.`,
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
						<VersusItem image={Battle}>
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
							{!isMobile() ?
								<a class="twitter-timeline" data-width="50%" data-height="90%" data-dnt="true" data-theme="dark" href={`https://twitter.com/${battle1.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								: <a class="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" href={`https://twitter.com/${battle1.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
							}
							{useScript("https://platform.twitter.com/widgets.js")}
						</VersusItem>
						<Divider>
							<Seperator />
							<img src={VS} width="100px" style={{ position: 'absolute' }} />
						</Divider>
						<VersusItem>
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
							{!isMobile() ?
								<a class="twitter-timeline" data-width="50%" data-height="90%" data-dnt="true" data-theme="dark" href={`https://twitter.com/${battle1.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								: <a class="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" href={`https://twitter.com/${battle1.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
							}
							{useScript("https://platform.twitter.com/widgets.js")}
						</VersusItem>
					</Options>
				</VersusContainer>
				<VersusContainer>
					<Options>
						<VersusItem>
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
								<a class="twitter-timeline" data-width="50%" data-height="90%" data-dnt="true" data-theme="dark" href={`https://twitter.com/${battle2.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								: <a class="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" href={`https://twitter.com/${battle2.pers1.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
							}
							{useScript("https://platform.twitter.com/widgets.js")}
						</VersusItem>
						<Divider>
							<Seperator />

							<img src={VS} width="100px" style={{ position: 'absolute' }} />
						</Divider>
						<VersusItem>
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
								<a class="twitter-timeline" data-width="50%" data-height="90%" data-dnt="true" data-theme="dark" href={`https://twitter.com/${battle2.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
								: <a class="twitter-timeline" data-width="65%" data-height="250px" data-dnt="true" data-theme="dark" href={`https://twitter.com/${battle2.pers2.handle.substring(1)}?ref_src=twsrc%5Etfw`} />
							}
							{useScript("https://platform.twitter.com/widgets.js")}
						</VersusItem>
					</Options>
				</VersusContainer>
			</BattleContainer>
			{account ?
				<Button size="lg" onClick={castVote} disabled={voted ? true : false}>
					{voted ? "Votes Received" : "Cast Your Votes"}
				</Button>
				:
				<RecDesc>
					connect your wallet to participate
				</RecDesc>
			}
			<Space />
		</>
	)
}

const Seperator = !isMobile() ? styled.div`
  width: 500px;
	height: 1px;
	position: absolute;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
` : styled.div`
  width: 150px;
	height: 1px;
	position: absolute;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
`
const BattleContainer = styled.div`
display: flex;
flex-direction: row;
width: 85%;
margin-top: 10px;
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


const VersusItem = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
background-image: ${props => props.image};
height: 100%;
width: 90%;
padding: 5%;
margin-top: 10px;
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
height: 75vh;
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
background-color: rgba(256,256,256,0.08);
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
	width: 40%;
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