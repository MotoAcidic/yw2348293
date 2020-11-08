import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import './swal.css'
import states from './BetStates'
import { getLiveElectionResults } from '../../yamUtils/index'
import useYam from "../../hooks/useYam";
import Biden from "../../assets/img/biden.png";
import Trump from "../../assets/img/trump.png";
import loading from "../../assets/img/loading.gif";

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

const ElectionStatusDisplay = () => {
	const yam = useYam()
	const [bidenVotes, setBidenVotes] = useState([]);
	const [bidenTotal, setBidenTotal] = useState(0);
	const [trumpVotes, setTrumpVotes] = useState([]);
	const [trumpTotal, setTrumpTotal] = useState(0);
	const [undecidedVotes, setUndecidedVotes] = useState([]);
	const [undecidedTotal, setUndecidedTotal] = useState(0);
	let [results, setResults] = useState([])

	useEffect(() => {
		if (yam) {
			getResults()
		}
		var intervalID = window.setInterval(getResults, 30000);
	}, [yam]);

	const getResults = async () => {
		let results = await getLiveElectionResults(yam, states)
		setResults(results)
		console.log(results);
	}

	useEffect(() => {
		if (results) {
			let biden = [];
			let totalBiden = 0;
			let trump = [];
			let totalTrump = 0;
			let undecided = [];
			let totalUndecided = 0;

			results.sort(function (a, b) {
				if (a.electoralVotes < b.electoralVotes) {
					return 1;
				} else {
					return -1;
				}
			});

			for (let i = 0; i < results.length; i++) {
				if (results[i].name === "US") continue;
				if (results[i].winner === "Biden") {
					totalBiden += results[i].electoralVotes;
					biden.push(
						<StateVote>
							<Left>
								<IMG src={results[i].image} />
								<Name>
									{results[i].name}
								</Name>
							</Left>
							<Votes>
								{results[i].electoralVotes}
							</Votes>
						</StateVote>
					)
				} else if (results[i].winner === "Trump") {
					totalTrump += results[i].electoralVotes;
					trump.push(
						<StateVote>
							<Left>
								<IMG src={results[i].image} />
								<Name>
									{results[i].name}
								</Name>
							</Left>
							<Votes>
								{results[i].electoralVotes}
							</Votes>
						</StateVote>
					)
				} else {
					totalUndecided += results[i].electoralVotes;
					undecided.push(
						<StateVote>
							<Left>
								<IMG src={results[i].image} />
								<Name>
									{results[i].name}
								</Name>
							</Left>
							<Votes>
								{results[i].electoralVotes}
							</Votes>
						</StateVote>
					)
				}
				setBidenTotal(totalBiden);
				setTrumpTotal(totalTrump);
				setUndecidedTotal(totalUndecided);
				setBidenVotes(biden);
				setTrumpVotes(trump);
				setUndecidedVotes(undecided);
			}
		}
	}, [results])

	if (!results.length) {
		return (
			<Container>

				<Loading src={loading} />
			</Container>
		)
	}

	return (
		<VersusContainer>
			<Column>
				<Candidate src={Trump} />
				<SubTitle>Votes: {trumpTotal}</SubTitle>
				<VotesColumn>
					{!results && <div>Loading...</div>}
					{trumpVotes}
				</VotesColumn>
			</Column>
			{/* <SmallColumn>
					<BigTitle>Undecided</BigTitle>
					<SubTitle>Votes: {undecidedTotal}</SubTitle>
					<VotesColumn>
						{!results && <div>Loading...</div>}
						{undecidedVotes}
					</VotesColumn>
				</SmallColumn> */}
			<Column>
				<Candidate src={Biden} />
				<SubTitle>Votes: {bidenTotal}</SubTitle>
				<VotesColumn>
					{!results && <div>Loading...</div>}
					{bidenVotes}
				</VotesColumn>
			</Column>
		</VersusContainer>
	)
}

const Loading = styled.img`
	width: 200px;
	height: 200px;
`

const Container = styled.div`
width: 45%;
display: flex;
align-items: center;
justify-content: center;
`

const Candidate = styled.img`
width: 95%;
border-radius: 8px;
`

const SubTitle = styled.div`
font-family: "Gilroy";
font-size: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
	color: white;
	margin-bottom: 10px;
	margin-top: 10px;
`

const VotesColumn = styled.div`
width: 80%;
margin: 0 auto;
overflow-y: auto;
::-webkit-scrollbar {
  width: 8px;
}
/* Track */
::-webkit-scrollbar-track {
  background: rgba(256,256,256,0.1); 
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(256,256,256,0.2); 
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(256,256,256,0.5); 
}
`
const Name = styled.div`
margin-top: 4px;`

const IMG = styled.img`
width: 25px;
height: auto;
margin: 0 10px 0 5px;`

const Votes = styled.div`
font-family: "Gilroy";
font-size: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
margin-top: 4px;
  color: rgb(255, 204, 74);
`

const Left = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	font-family: "Gilroy";
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
	letter-spacing: normal;
	align-items: center;
	color: white;
`

const StateVote = styled.div`
display: flex;
flex-direction: row;
flex-wrap: nowrap;
	width: 90%;
	margin: 0 auto 5px auto;
	justify-content: space-between;
	background-color: rgba(256,256,256,0.1);
	display: flex;
	border-radius: 2px;
	padding: 2px;
	align-items: center;
`

const BigTitle = styled.div`
font-family: "Gilroy";
font-size: 30px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: rgb(255, 204, 74);
margin-bottom: 10px;
margin-top: 10px;
`

const Column = styled.div`
display: flex;
width: 95%;
flex-direction: column;
align-items: center;
`

const VersusContainer = styled.div`
display: flex;
flex-direction: row;
flex-wrap: nowrap;
justify-content: space-evenly;
font-size: 30px;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
height: 400px;
width: 45%;
`


export default ElectionStatusDisplay;