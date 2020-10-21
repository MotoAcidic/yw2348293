import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import checkedIcon from '../../assets/img/checked.png'
import uncheckedIcon from '../../assets/img/unchecked.png'
import useYam from '../../hooks/useYam'
import { useWallet } from 'use-wallet'
import DailyQuestion from "./DailyQuestion.jsx";

import useFarms from '../../hooks/useFarms'
import Cookie from 'universal-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import Warning from "../../assets/img/warning@2x.png";
import './swal.css'
import FarmGraph from "./FarmGraph";
import VotingBalance from "./VotingBalance";
import CountDown from "./CountDown";


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
	const [voted, setVoted] = useState(false)
	const [checked, setChecked] = useState(parseInt(cookie.get(battles._id)))
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
		battle.farm1.votes = battles.pool1.totalVotes.toFixed(0);
		battle.farm2.votes = battles.pool2.totalVotes.toFixed(0);
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

		if (checked === 1)
			vote = battle.farm1.id
		if (checked === 2)
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
			setVoted(true);
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

	console.log("farmzz", battle);

	return (
		<>
			{battles &&
				<VersusContainer>
					<RecDesc>
						Which token price will change by a greater % in 24 hours?
     	 	</RecDesc>
					<CountDown />
					<Options>
						<VersusItem>
							<FarmGraph farm={battle.farm1} order={1} />
							<ButtonContainer onClick={() => pick(1)}>
								{checked === 1 ? (
									<img src={checkedIcon} width="30px" />
								) : (
										<img src={uncheckedIcon} width="30px" />
									)}
							</ButtonContainer>
						</VersusItem>
						<Divider />
						<VersusItem>
							<FarmGraph farm={battle.farm2} order={2} />
							<ButtonContainer onClick={() => pick(2)}>
								{checked === 2 ? (
									<img src={checkedIcon} width="30px" />
								) : (
										<img src={uncheckedIcon} width="30px" />
									)}
							</ButtonContainer>
						</VersusItem>
					</Options>
					<VotingBalance farm1={battle.farm1} farm2={battle.farm2} />

				</VersusContainer>
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
	color: #ffffff;
	margin: 0 20px 20px 20px;
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

export default Versus