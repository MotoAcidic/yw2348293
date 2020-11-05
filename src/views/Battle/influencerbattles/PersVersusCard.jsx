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
import './swal.css';

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
	}, [account])

	return (
		<>
			<Title>Who Will Win?</Title>
			<BattleContainer>
				<VersusContainer>
					<Options>
						<VersusItem>
							<StyledContent>
								<InfluencerContainer>
									<Picture src={battle1.pers1.picture} />
								</InfluencerContainer>
								<StatBlock>
									<SubTitle>{battle1.pers1.name}</SubTitle>
									<Text>{battle1.pers1.handle}</Text>
								</StatBlock>
								<StatBlock>
									<SubTitle>Followers</SubTitle>
									<Text>{battle1.pers1.followerCount}</Text>
								</StatBlock>
							</StyledContent>

						</VersusItem>
						<Divider>
							<img src={VS} width="100px" style={{position: 'absolute'}} />
						</Divider>
						<VersusItem>
							<StyledContent>
								<InfluencerContainer>
									<Picture src={battle1.pers2.picture} />
								</InfluencerContainer>
								<StatBlock>
									<SubTitle>{battle1.pers2.name}</SubTitle>
									<Text>{battle1.pers2.handle}</Text>
								</StatBlock>
								<StatBlock>
									<SubTitle>Followers</SubTitle>
									<Text>{battle1.pers2.followerCount}</Text>
								</StatBlock>
							</StyledContent>

						</VersusItem>
					</Options>
				</VersusContainer>
				<VersusContainer>
					<Options>
						<VersusItem>
							<StyledContent>
								<InfluencerContainer>
									<Picture src={battle2.pers1.picture} />
								</InfluencerContainer>
								<StatBlock>
									<SubTitle>{battle2.pers1.name}</SubTitle>
									<Text>{battle2.pers1.handle}</Text>
								</StatBlock>
								<StatBlock>
									<SubTitle>Followers</SubTitle>
									<Text>{battle2.pers1.followerCount}</Text>
								</StatBlock>
							</StyledContent>

						</VersusItem>
						<Divider>
							<img src={VS} width="100px" style={{position: 'absolute'}} />
						</Divider>
						<VersusItem>
							<StyledContent>
								<InfluencerContainer>
									<Picture src={battle2.pers2.picture} />
								</InfluencerContainer>
								<StatBlock>
									<SubTitle>{battle2.pers2.name}</SubTitle>
									<Text>{battle2.pers2.handle}</Text>
								</StatBlock>
								<StatBlock>
									<SubTitle>Followers</SubTitle>
									<Text>{battle2.pers2.followerCount}</Text>
								</StatBlock>
							</StyledContent>

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

const BattleContainer = styled.div`
display: flex;
flex-direction: row;
width: 85%;
`

const StatBlock = styled.div`
margin-bottom: 30px;
`

const Picture = styled.img`
width: 60px;
height: 60px;
  border-radius: 50%;

`

const InfluencerContainer = styled.div`
display: flex;
flex-direction: row;
height: 60px;
margin-bottom: 30px;
`

const InfoBlock = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
margin-left: 10px;
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
flex-direction: column;
height: 100%;
width: 100%;
padding: 3%;
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
  height: 1px;
  margin: 15px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
display: flex;
justify-content: center;
align-items: center;
` : styled.div`
height: 2px;
width: 80%;
margin: 20px auto 30px auto;
background-color: rgba(256,256,256,0.3);`

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

const ButtonContainer = styled.div`
display: flex;
align-items: flex-start;
height: 31px;`

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

const ChartContainer = styled.div`
height: 40px;
width: 170px;
margin-bottom: 10px;
`

const StyledContent = styled.div`
  display: flex;
	flex-direction: column;
	height: 100%;
`

const StyledTitle = styled.div`
font-family: "Gilroy";
font-size: 28px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
margin-bottom: 5px;
`

const SubTitle = styled.div`
font-family: "Gilroy";
margin-bottom: 5px;
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
`
const Text = styled.div`
font-family: "Gilroy";
font-size: 16px;
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
const GreenText = styled.div`
font-family: "Gilroy";
font-size: 16px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
	text-align: left;
	margin-bottom: 10px;
	letter-spacing: 1px;
	color: #38ff00;
`
const RedText = styled.div`
font-family: "Gilroy";
font-size: 16px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
	text-align: left;
	margin-bottom: 10px;
	letter-spacing: 1px;
	color: #ff4343;

`

export default Versus