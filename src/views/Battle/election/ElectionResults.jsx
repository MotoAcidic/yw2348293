import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import './swal.css'
import states from './states'
import { getLiveElectionResults } from '../../../yamUtils/index'
import useYam from "../../../hooks/useYam";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import MiniBiden from "../../../assets/img/biden@2x.png";
import MiniTrump from "../../../assets/img/trump@2x.png";
import Biden from "../../../assets/img/biden.png";
import Trump from "../../../assets/img/trump.png";
import loading from "../../../assets/img/loading.gif";


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
			<SmallColumn>
				<BigTitle>Undecided</BigTitle>
				<SubTitle>Votes: {undecidedTotal}</SubTitle>
				<VotesColumn>
					{!results && <div>Loading...</div>}
					{undecidedVotes}
				</VotesColumn>
			</SmallColumn>
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
height: 580px;
min-width: 1000px;
display: flex;
align-items: center;
justify-content: center;
`

const Candidate = styled.img`
width: 95%;
border-radius: 8px;
`

const CardIcon = styled.img`
	height: 200px;
  width: 200px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 0 10px 0;
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
margin-top: 3px;`

const IMG = styled.img`
width: 25px;
height: auto;
margin-right: 10px;`

const Votes = styled.div`
font-family: "Gilroy";
font-size: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
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
	align-items: center;
`

const BigTitle = styled.div`
font-family: "Gilroy";
font-size: 16px;
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

const SmallColumn = styled.div`
display: flex;
width: 50%;
flex-direction: column;
align-items: center;
`

const Divider = styled.div`
height: 80%;
background-color: white;
width: 1px;
margin: auto 0 auto 0;
`

const VersusContainer = !isMobile() ? styled.div`
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
height: 580px;
min-width: 1000px;
margin-left: 20px;
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
	padding: 20px;
	border-radius: 8px;
	border: solid 2px rgba(255, 183, 0, 0.3);
	background-color: rgba(256,256,256,0.08);`


export default ElectionStatusDisplay;