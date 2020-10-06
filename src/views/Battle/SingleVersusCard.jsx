import React, { useCallback, useEffect, useState } from 'react'
import {
	Route,
	Switch,
	useRouteMatch,
} from 'react-router-dom'
import styled from 'styled-components'

import Button from '../../components/Button'
import Card from '../../components/Card'
import CardContent from '../../components/CardContent'
import CardIcon from '../../components/CardIcon'
import Page from '../../components/Page'
import checkedIcon from '../../assets/img/checked.png'
import uncheckedIcon from '../../assets/img/unchecked.png'

import { getAPR, getPoolEndTime } from '../../yamUtils'
import useYam from '../../hooks/useYam'
import { useWallet } from 'use-wallet'

import Landscape from '../../assets/img/landscapebig.png'
import Sky from '../../assets/img/skybig.png'
import TallSky from '../../assets/img/tallsky.png'
import FightInstructions from '../../assets/img/flightinstructions.png'
import DailyQuestion from "./DailyQuestion.jsx";

import useFarms from '../../hooks/useFarms'
import useFarm from '../../hooks/useFarm'
import { Farm } from '../../contexts/Farms'
import Cookie from 'universal-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import './swal.css'

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


const Versus = ({ battles, question }) => {
	battles = battles[0]
	let [farms] = useFarms()
	const yam = useYam()
	const { account, connect } = useWallet()
	console.log(battles);
	const [voted, setVoted] = useState(false)
	const [checked, setChecked] = useState(cookie.get(battles._id))
	const [questionResponse, setQuestionResponse] = useState("");
	const farmTemplate = {
		icon: "🤔",
		name: "THINKING Errors"
	}
	const battle = {
		farm1: farms.find(farm => farm.id === battles.pool1.name) || farmTemplate,
		farm2: farms.find(farm => farm.id === battles.pool2.name) || farmTemplate
	}

	const pick = (g) => {
		cookie.set(battles._id, g)
		setChecked(g)
	}

	const castVote = async () => {
		let vote
		if (!checked|| !questionResponse)
			return
		if (checked == 1)
			vote = battle.farm1.id
		if (checked == 2)
			vote = battle.farm2.id
		const signature = await yam.web3.eth.personal.sign(JSON.stringify({
			address: account,
			vote: [
				{
					vote: vote,
					_id: battles._id,
				}
			]
		}), account).catch(err => console.log(err))
		axios.post(`${getServerURI()}/api/vote`, {
			address: account,
			vote: [
				{
					vote: vote,
					_id: battles._id,
				}
			],
			questionResponse,
			sig: signature
		}).then(res => {
			setVoted(true)
			Swal.fire({
				title: 'Your votes have been recorded successfully!',
				text: 'Check back tomorrow to see the victors and rewards',
				width: '600',
				height: '465',
				padding: '10',
				customClass: {
					container: 'container-class',
					// popup: 'popup-class',
					// header: 'header-class',
					title: 'title-class',
					// text: 'text-class',
					// closeButton: 'close-button-class',
					// icon: 'icon-class',
					// image: 'image-class',
					content: 'text-class',
					// input: 'input-class',
					// actions: 'actions-class',
					confirmButton: 'confirm-button-class',
					// denyButton: 'confirm-button-class',
					// cancelButton: 'cancel-button-class',
					// footer: 'footer-class'
				}
			})
		}).catch(err => {
			Swal.fire({
				title: `Error submitting your votes: ${err.response.status}`,
				text: `Response: ${err.response.data}\n Please let us know and we'll take care of it.`,
				width: '600',
				height: '465',
				padding: '10',
				customClass: {
					container: 'container-class',
					// popup: 'popup-class',
					// header: 'header-class',
					title: 'title-class',
					// text: 'text-class',
					// closeButton: 'close-button-class',
					// icon: 'icon-class',
					// image: 'image-class',
					content: 'text-class',
					// input: 'input-class',
					// actions: 'actions-class',
					confirmButton: 'confirm-button-class',
					// denyButton: 'confirm-button-class',
					// cancelButton: 'cancel-button-class',
					// footer: 'footer-class'
				}
			})
		})
	}

	useEffect(() => {
		if (account) {
			axios.post(`${getServerURI()}/api/status`, {
				address: account,
			}).then(res => {
				console.log(res.data);
				setVoted(res.data)
			}).catch(err => {
				console.log(err);
			})
		}
		if (question) {
			setQuestionResponse(cookie.get(question._id));
		}
	}, [account, question])

	return (
		<>
			<VSContentContainer>
				<VersusItem>
					<VersusCard>
						<StyledContent>
							<CardIcon>{battle.farm1.icon}</CardIcon>
							<StyledTitle>{battle.farm1.name}</StyledTitle>
							{checked == 1 ? (
								<ButtonContainer onClick={() => pick(1)}>
									<img src={checkedIcon} width="40%" />
								</ButtonContainer>
							) : (
									<ButtonContainer onClick={() => pick(1)}>
										<img src={uncheckedIcon} width="40%" />
									</ButtonContainer>
								)}
						</StyledContent>
					</VersusCard>
                    VS
					<VersusCard>
						<StyledContent>
							<CardIcon>{battle.farm2.icon}</CardIcon>
							<StyledTitle>{battle.farm2.name}</StyledTitle>
							{checked == 2 ? (
								<ButtonContainer onClick={() => pick(2)}>
									<img src={checkedIcon} width="40%" />
								</ButtonContainer>
							) : (
									<ButtonContainer onClick={() => pick(2)}>
										<img src={uncheckedIcon} width="40%" />
									</ButtonContainer>
								)}
						</StyledContent>
					</VersusCard>
				</VersusItem>
			</VSContentContainer>
			{question &&
				<DailyQuestion question={question} setResponse={(response) => setQuestionResponse(response)} />
			}

			{account && <Button size="lg" onClick={castVote} disabled={voted ? true : false}>{voted ? "Votes Received" : "Cast Your Votes"}</Button>}
			<Title style={{ marginTop: '6vh' }}>How the battles work </Title>
			<StyledContainer>
				<StyledCard>
					<StyledCardContent>
						<img src={FightInstructions} width="100%" />
					</StyledCardContent>
				</StyledCard>
			</StyledContainer>
		</>
	)
}

const Title = styled.div`
font-family: Alegreya;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-top: 1%;
`

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;

`

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 3vh;
  max-width: 730px;
  height: 570px;
  width: 100%;
`

const StyledCard = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  border-radius: 8px;
    background-color: #003677;
`

const StyledText = styled.p`
font-family: Alegreya;
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const ButtonContainer = styled.div`

`
const VSContentContainer = styled.div`
margin-top: 1vh;
width: 600px;
margin: 40px 0 40px 0;
display: flex;
flex-direction: column;
justify-content: space-evenly;
font-family: Alegreya;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`

const StyledDetails = styled.div`
  text-align: center;
`

const StyledDetail = styled.div`
font-family: Alegreya;
font-size: 20px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const StyledTitle = styled.h4`
margin: 0;
font-family: Alegreya;
font-size: 25px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  padding: 0;
`

const VersusCard = styled.div`
width: 220px;
  height: 247px;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677
`

const VersusItem = styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
font-size: 30px;
`

export default Versus