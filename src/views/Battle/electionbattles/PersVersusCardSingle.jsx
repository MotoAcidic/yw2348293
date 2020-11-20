import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import CardIcon from '../../../components/CardIcon'
import checkedIcon from '../../../assets/img/checked.png'
import uncheckedIcon from '../../../assets/img/unchecked.png'

import useYam from '../../../hooks/useYam'
import { useWallet } from 'use-wallet'
import DailyQuestion from "./DailyQuestion.jsx";
import useFarms from '../../../hooks/useFarms'
import Cookie from 'universal-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import Warning from "../../../assets/img/warning@2x.png";
import BettingCardSingle from "./VersusCardSingle";
import './swal.css'
import Countdown from "./CountDown";
import moment from "moment";
import VotingBalance from "./VotingBalance";
import personalities from './personalities'

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
	battles = battles[0]
	const yam = useYam()
	const { account, connect } = useWallet()
	console.log(battles);
	const [voted, setVoted] = useState(false)
	const [checked, setChecked] = useState(false);

	let battle;
	if (battles) {

		battle = {
			pers1: personalities.find(person => person.handle === battles.pool1.name),
			pers2: personalities.find(person => person.handle === battles.pool2.name)
		}
	}

	const pick = (g) => {
		cookie.set(battles._id, g)
		setChecked(g)
	}

	const castVote = async () => {
		let vote;
		if (!checked)
			return

		if (!battles) {
			battles = {
				_id: null
			}
		}

		if (checked === 1)
			vote = battle.pers1.handle
		if (checked === 2)
			vote = battle.pers1.handle
		const signature = await yam.web3.eth.personal.sign(JSON.stringify({
			address: account,
			vote: [
				{
					vote: vote,
					_id: battles._id,
				}
			]
		}), account).catch(err => console.log(err))
		axios.post(`${getServerURI()}/api/pers-vote`, {
			address: account,
			vote: [
				{
					vote: vote,
					_id: battles._id,
				}
			],
			sig: signature
		}).then(res => {
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
			Swal.fire({
				title: `Error submitting your votes: ${err.response.status}`,
				icon: { Warning },
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
				console.log("here", res.data);
				setVoted(res.data)
			}).catch(err => {
				console.log(err);
			})
		}
		if (battles) {
			setChecked(cookie.get(battles._id))
		}
	}, [account, battles])

	return (
		<>
			{battles &&
				<VersusContainer>
					<Options>
						<VersusItem>
							<StyledContent>
								<StyledTitle>Bio</StyledTitle>
								<Text>{battle.pers1.handle}</Text>
								<SubTitle>Followers</SubTitle>
								<Text>{battle.pers1.followerCount}</Text>
							</StyledContent>
							<ButtonContainer onClick={() => pick(1)}>
								{checked === 1 ? (
									<img alt="check" src={checkedIcon} width="30px" />
								) : (
										<img alt="check" src={uncheckedIcon} width="30px" />
									)}
							</ButtonContainer>
						</VersusItem>
						<Divider />
						<VersusItem>
							<StyledContent>
								<StyledTitle>Bio</StyledTitle>
								<Text>{battle.pers2.handle}</Text>
								<SubTitle>Followers</SubTitle>
								<Text>{battle.pers2.followerCount}</Text>
							</StyledContent>
							<ButtonContainer onClick={() => pick(1)}>
								{checked === 1 ? (
									<img alt="check" src={checkedIcon} width="30px" />
								) : (
										<img alt="check" src={uncheckedIcon} width="30px" />
									)}
							</ButtonContainer>
						</VersusItem>
					</Options>
				</VersusContainer>
			}


			{account ? <Button size="lg" onClick={castVote} disabled={voted ? true : false}>{voted ? "Votes Received" : "Cast Your Votes"}</Button> :
				<RecDesc>
					connect your wallet to participate
				</RecDesc>
			}
			<Space />
		</>
	)
}
const VersusItem = styled.div`
display: flex;
flex-direction: column;`
const Options = !isMobile() ? styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-around;
` : styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;`
const Divider = !isMobile() ? styled.div`
background-color: rgba(256,256,256,0.3);
width: 2px;
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
width: 460px;
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
font-size: 30px;
margin: 20px auto 40px auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(256,256,256,0.08);
padding: 30px;
` : styled.div`
margin: 40px 0 40px 0;
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
	padding-top: 20px;
	padding-bottom: 20px;
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