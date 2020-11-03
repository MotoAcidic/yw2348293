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

	const [votes, setVotes] = useState([]);
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
		if (votes) {
			let biden = [];
			let trump = [];
			let undecided = [];
			
		}
	}, [votes])

	return (
		<VersusContainer>
			<Column>
				<BigTitle>Trump</BigTitle>
			</Column>
			<Divider />
			<Column>
				<BigTitle>Undecided</BigTitle>
			</Column>
			<Divider />
			<Column>
				<BigTitle>Biden</BigTitle>
			</Column>
		</VersusContainer>
	)
}

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