import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import Button from '../../components/Button'
import CardIcon from '../../components/CardIcon'
import checkedIcon from '../../assets/img/checked.png'
import uncheckedIcon from '../../assets/img/unchecked.png'

import useYam from '../../hooks/useYam'
import { useWallet } from 'use-wallet'
import DailyQuestion from "./DailyQuestion.jsx";
import useFarms from '../../hooks/useFarms'
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
	// console.log(question);
	let [farms] = useFarms()
	const yam = useYam()
	const { account, connect } = useWallet()
	// console.log(battles);
	const [voted, setVoted] = useState(false)
	const [checked1, setChecked1] = useState(cookie.get(battles[0]._id))
	const [checked2, setChecked2] = useState(cookie.get(battles[1]._id))
	const [questionResponse, setQuestionResponse] = useState(null);
	const farmTemplate = {
		icon: "🤔",
		name: "THINKING Errors"
	}
	const battle1 = {
		farm1: farms.find(farm => farm.id === battles[0].pool1.name) || farmTemplate,
		farm2: farms.find(farm => farm.id === battles[0].pool2.name) || farmTemplate
	}
	const battle2 = {
		farm1: farms.find(farm => farm.id === battles[1].pool1.name) || farmTemplate,
		farm2: farms.find(farm => farm.id === battles[1].pool2.name) || farmTemplate
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
		if (!checked1 || !checked2 || (question && !questionResponse))
			return
		if (checked1 == 1)
			vote1 = battle1.farm1.id
		if (checked1 == 2)
			vote1 = battle1.farm2.id
		if (checked2 == 1)
			vote2 = battle2.farm1.id
		if (checked2 == 2)
			vote2 = battle2.farm2.id
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
		axios.post(`${getServerURI()}/api/vote`, {
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
			questionResponse,
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
							<CardIcon>{battle1.farm1.icon}</CardIcon>
							<StyledTitle>{battle1.farm1.name}</StyledTitle>
							{checked1 == 1 ? (
								<ButtonContainer onClick={() => pick1(1)}>
									<img src={checkedIcon} width="30px" />
								</ButtonContainer>
							) : (
									<ButtonContainer onClick={() => pick1(1)}>
										<img src={uncheckedIcon} width="30px" />
									</ButtonContainer>
								)}
						</StyledContent>
					</VersusCard>
					<VS>
						VS
										</VS>

					<VersusCard>
						<StyledContent>
							<CardIcon>{battle1.farm2.icon}</CardIcon>
							<StyledTitle>{battle1.farm2.name}</StyledTitle>
							{checked1 == 2 ? (
								<ButtonContainer onClick={() => pick1(2)}>
									<img src={checkedIcon} width="30px" />
								</ButtonContainer>
							) : (
									<ButtonContainer onClick={() => pick1(2)}>
										<img src={uncheckedIcon} width="30px" />
									</ButtonContainer>
								)}
						</StyledContent>
					</VersusCard>
				</VersusItem>
				<VersusItem>
					<VersusCard>
						<StyledContent>
							<CardIcon>{battle2.farm1.icon}</CardIcon>
							<StyledTitle>{battle2.farm1.name}</StyledTitle>
							{checked2 == 1 ? (
								<ButtonContainer onClick={() => pick2(1)}>
									<img src={checkedIcon} width="30px" />
								</ButtonContainer>
							) : (
									<ButtonContainer onClick={() => pick2(1)}>
										<img src={uncheckedIcon} width="30px" />
									</ButtonContainer>
								)}
						</StyledContent>
					</VersusCard>
					<VS>
						VS
										</VS>
					<VersusCard>
						<StyledContent>
							<CardIcon>{battle2.farm2.icon}</CardIcon>
							<StyledTitle>{battle2.farm2.name}</StyledTitle>
							{checked2 == 2 ? (
								<ButtonContainer onClick={() => pick2(2)}>
									<img src={checkedIcon} width="30px" />
								</ButtonContainer>
							) : (
									<ButtonContainer onClick={() => pick2(2)}>
										<img src={uncheckedIcon} width="30px" />
									</ButtonContainer>
								)}
						</StyledContent>
					</VersusCard>
				</VersusItem>
			</VSContentContainer>
			{question &&
				<DailyQuestion question={question} setResponse={(response) => setQuestionResponse(response)} voted={voted} />
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
font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
	color: #ffffff;
`;

const VS = styled.div`
width: 10%;
`

const Space = styled.div`
height: 80px;`

const ButtonContainer = styled.div`

`
const VSContentContainer = !isMobile() ? styled.div`
width: 600px;
height: 600px;
display: flex;
flex-direction: column;
justify-content: space-evenly;
font-family: "Gilroy";
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
` : styled.div`
width: 90vw;
display: flex;
flex-direction: column;
justify-content: space-between;
font-family: "Gilroy";
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
font-family: "Gilroy";
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

// const VersusCard = styled.div`
// width: 220px;
//   height: 247px;
//   border-radius: 8px;
//     border: solid 2px rgba(255, 183, 0, 0.3);
//   background-color: #003677
// `

const VersusCard = !isMobile() ? styled.div`
width: 220px;
  height: 247px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
` : styled.div`width: 40%;
height: 247px;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(256,256,256,0.08);
`

const VersusItem = !isMobile() ? styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
font-size: 30px;
` : styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
font-size: 30px;
margin-bottom: 20px;
`

export default Versus