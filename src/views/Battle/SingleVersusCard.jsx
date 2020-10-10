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
	const [checked, setChecked] = useState(false);
	const [questionResponse, setQuestionResponse] = useState("");
	const farmTemplate = {
		icon: "🤔",
		name: "THINKING Errors"
	}

	let battle;
	if (battles) {

		battle = {
			farm1: farms.find(farm => farm.id === battles.pool1.name) || farmTemplate,
			farm2: farms.find(farm => farm.id === battles.pool2.name) || farmTemplate
		}
	}

	const pick = (g) => {
		cookie.set(battles._id, g)
		setChecked(g)
	}

	const castVote = async () => {
		let vote;
		if (!checked && !questionResponse)
			return

		if (!battles) {
			battles = {
				_id: null
			}
		}

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
			cookie.set(question._id + "1", true);
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
		if (question) {
			const questionVoted = cookie.get(question._id + "1");
			if (questionVoted) {
				setVoted(true);
			}
		}
		if (account) {
			axios.post(`${getServerURI()}/api/status`, {
				address: account,
			}).then(res => {
				console.log("here", res.data);
				setVoted(res.data)
			}).catch(err => {
				console.log(err);
			})
		}
		if (question) {
			setQuestionResponse(cookie.get(question._id));
		}
		if (battles) {
			setChecked(cookie.get(battles._id))
		}
	}, [account, question, battles])

	return (
		<>
			{battles &&
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
			}

			{question &&
				<DailyQuestion question={question} setResponse={(response) => setQuestionResponse(response)} />
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

const RecDesc = styled.div`
font-family: Alegreya;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
	color: #ffffff;
`;

const Space = styled.div`
height: 80px;`

const ButtonContainer = styled.div``

const VersusItem = !isMobile() ? styled.div`
width: 540px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
font-size: 30px;
margin: 20px auto 40px auto;
font-family: Alegreya;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
` : styled.div`
margin: 40px 0 40px 0;
width: 90vw;
display: flex;
flex-direction: column;
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

const VersusCard = !isMobile() ? styled.div`
width: 220px;
  height: 247px;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677;
` : styled.div`width: 40%;
height: 247px;
border-radius: 8px;
border: solid 2px #0095f0;
background-color: #003677;
`

export default Versus