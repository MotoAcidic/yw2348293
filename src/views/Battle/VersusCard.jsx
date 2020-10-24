import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import checkedIcon from '../../assets/img/checked.png'
import uncheckedIcon from '../../assets/img/unchecked.png'
import useYam from '../../hooks/useYam'
import { useWallet } from 'use-wallet'
import useFarms from '../../hooks/useFarms'
import Button from '../../components/Button'
import Cookie from 'universal-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import './swal.css'
import FarmGraph from "./FarmGraph";
import VotingBalance from "./VotingBalance";
import DailyQuestion from "./DailyQuestion.jsx";
import CountDown from "./BigCountDown";
import BetCard from "./BetCard";

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
	let [farms] = useFarms()
	const yam = useYam()
	const { account, connect } = useWallet()
	const [voted, setVoted] = useState(false)
	const [checked1, setChecked1] = useState(parseInt(cookie.get(battles[0]._id)))
	const [checked2, setChecked2] = useState(parseInt(cookie.get(battles[1]._id)))
	const [questionResponse, setQuestionResponse] = useState(null);
	const [bet, setBet] = useState({ farm: "", war: 0 });
	const farmTemplate = {
		icon: "🤔",
		name: "THINKING Errors"
	}

	let battle1 = {
		farm1: farms.find(farm => farm.id === battles[0].pool1.name) || farmTemplate,
		farm2: farms.find(farm => farm.id === battles[0].pool2.name) || farmTemplate
	}
	let battle2 = {
		farm1: farms.find(farm => farm.id === battles[1].pool1.name) || farmTemplate,
		farm2: farms.find(farm => farm.id === battles[1].pool2.name) || farmTemplate
	}
	battle1.farm1.votes = battles[0].pool1.totalVotes;
	battle1.farm2.votes = battles[0].pool2.totalVotes;
	battle2.farm1.votes = battles[1].pool1.totalVotes;
	battle2.farm2.votes = battles[1].pool2.totalVotes;

	const pick1 = (g) => {
		console.log("battleID", battles[0]._id, g);
		console.log("cook", cookie.get(battles[0]._id));

		cookie.set(battles[0]._id, g)

		setChecked1(g)
	}

	const pick2 = (g) => {
		console.log("battleID", battles[1]._id, g);
		console.log("cook", cookie.get(battles[1]._id));

		cookie.set(battles[1]._id, g)
		setChecked2(g)
	}

	const castVote = async () => {
		let vote1
		let vote2
		console.log(checked1, checked2);
		if (!checked1 || !checked2 || (question && !questionResponse))
			return
		if (checked1 === 1)
			vote1 = battle1.farm1.id
		if (checked1 === 2)
			vote1 = battle1.farm2.id
		if (checked2 === 1)
			vote2 = battle2.farm1.id
		if (checked2 === 2)
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
			],
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
				text: 'Come back tomorrow. All rewards will be distributed tomorrow at 19:00 UTC',
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
				console.log("here", res.data);
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
			{battles &&
				<>
					<RecDesc>
						Voting Ends and the Battle Begins in
      		</RecDesc>
					<CountDown />
					<VersusContainer>
						<Options>
							<VersusItem>
								<FarmGraph farm={battle1.farm1} />
								<ButtonContainer onClick={() => pick1(1)}>
									{checked1 === 1 ? (
										<img alt="check" src={checkedIcon} width="30px" />
									) : (
											<img alt="check" src={uncheckedIcon} width="30px" />
										)}
								</ButtonContainer>
							</VersusItem>
							<Divider />
							<VersusItem>
								<FarmGraph farm={battle1.farm2} />
								<ButtonContainer onClick={() => pick1(2)}>
									{checked1 === 2 ? (
										<img alt="check" src={checkedIcon} width="30px" />
									) : (
											<img alt="check" src={uncheckedIcon} width="30px" />
										)}
								</ButtonContainer>
							</VersusItem>
						</Options>
						<VotingBalance farm1={battle1.farm1} farm2={battle1.farm2} />
					</VersusContainer>

					<VersusContainer>
						<Options>
							<VersusItem>
								<FarmGraph farm={battle2.farm1} />
								<ButtonContainer onClick={() => pick2(1)}>
									{checked2 === 1 ? (
										<img alt="check" src={checkedIcon} width="30px" />
									) : (
											<img alt="check" src={uncheckedIcon} width="30px" />
										)}
								</ButtonContainer>
							</VersusItem>
							<Divider />
							<VersusItem>
								<FarmGraph farm={battle2.farm2} />
								<ButtonContainer onClick={() => pick2(2)}>
									{checked2 === 2 ? (
										<img alt="check" src={checkedIcon} width="30px" />
									) : (
											<img alt="check" src={uncheckedIcon} width="30px" />
										)}
								</ButtonContainer>
							</VersusItem>
						</Options>
						<VotingBalance farm1={battle2.farm1} farm2={battle2.farm2} />
					</VersusContainer>
				</>
			}
			{question &&
				<DailyQuestion question={question} setResponse={(response) => setQuestionResponse(response)} voted={voted} />
			}
			{/* {battles && <BetCard battles={battles} bet={bet} setBet={() => setBet(bet)} />} */}
			{account ? <Button size="lg" onClick={castVote} disabled={voted ? true : false}>{voted ? "Votes Received" : "Cast Your Votes"}</Button> :
				<RecDesc>
					connect your wallet to participate
		</RecDesc>
			}
			<Space />
		</>
	)
}

const Space = styled.div`
height: 80px;`

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

const ButtonContainer = styled.div`
display: flex;
align-items: flex-start;
height: 31px;`

const VersusContainer = !isMobile() ? styled.div`
width: 460px;
display: flex;
flex-direction: column;
align-items: center;
font-size: 30px;
margin: 0 auto 20px auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: #142C49;
padding: 60px 40px 60px 40px;
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
	padding-top: 20px;
	padding-bottom: 20px;
	border-radius: 8px;
	border: solid 2px rgba(255, 183, 0, 0.3);
	background-color: rgba(256,256,256,0.08);`

export default Versus