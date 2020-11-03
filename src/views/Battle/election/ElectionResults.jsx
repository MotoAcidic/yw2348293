import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import './swal.css'
import states from './states'
import { getLiveElectionResults } from '../../../yamUtils/index'
import useYam from "../../../hooks/useYam";

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
	const [trumpVotes, setTrumpVotes] = useState([]);
	const [undecidedVotes, setUndecidedVotes] = useState([]);
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
			let trump = [];
			let undecided = [];

			for (let i = 0; i < results.length; i++) {
				if (results[i].name === "US") continue;
				if (results[i].winner === "Biden") {
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
			}
			setBidenVotes(biden);
			setTrumpVotes(trump);
			setUndecidedVotes(undecided);
		}
	}, [results])

	return (
		<VersusContainer>
			<Column>
				<BigTitle>Trump</BigTitle>
				<VotesColumn>

					{trumpVotes}
				</VotesColumn>
			</Column>
			<Divider />
			<Column>
				<BigTitle>Undecided</BigTitle>
				<VotesColumn>

					{undecidedVotes}
				</VotesColumn>
			</Column>
			<Divider />
			<Column>
				<BigTitle>Biden</BigTitle>
				<VotesColumn>

					{bidenVotes}
				</VotesColumn>
			</Column>
		</VersusContainer>
	)
}

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
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: rgb(255, 204, 74);
  max-width: 80vw;
  margin: 0 auto 40px;
`

const Column = styled.div`
display: flex;
width: 200px;
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
justify-content: space-between;
font-size: 30px;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(4,2,43,1);
padding: 20px 0 20px;
height: 470px;
min-width: 602px;
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