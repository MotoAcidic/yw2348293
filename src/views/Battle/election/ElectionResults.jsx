import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import './swal.css'
import ak from "../../../assets/img/stateflags/ak.jpg";
import al from "../../../assets/img/stateflags/al.jpg";
import ar from "../../../assets/img/stateflags/ar.jpg";
import az from "../../../assets/img/stateflags/az.jpg";
import ca from "../../../assets/img/stateflags/ca.jpg";
import co from "../../../assets/img/stateflags/co.jpg";
import ct from "../../../assets/img/stateflags/ct.jpg";
import de from "../../../assets/img/stateflags/de.jpg";
import fl from "../../../assets/img/stateflags/fl.jpg";
import ga from "../../../assets/img/stateflags/ga.jpg";
import hi from "../../../assets/img/stateflags/hi.jpg";
import ia from "../../../assets/img/stateflags/ia.jpg";
import id from "../../../assets/img/stateflags/id.jpg";
import il from "../../../assets/img/stateflags/il.jpg";
import indiana from "../../../assets/img/stateflags/in.jpg";
import ks from "../../../assets/img/stateflags/ks.jpg";
import ky from "../../../assets/img/stateflags/ak.jpg";
import la from "../../../assets/img/stateflags/la.jpg";
import ma from "../../../assets/img/stateflags/ma.jpg";
import md from "../../../assets/img/stateflags/md.jpg";
import me from "../../../assets/img/stateflags/me.jpg";
import mi from "../../../assets/img/stateflags/mi.jpg";
import mn from "../../../assets/img/stateflags/mn.jpg";
import mo from "../../../assets/img/stateflags/mo.jpg";
import ms from "../../../assets/img/stateflags/ms.jpg";
import mt from "../../../assets/img/stateflags/mt.jpg";
import nc from "../../../assets/img/stateflags/nc.jpg";
import nd from "../../../assets/img/stateflags/nd.jpg";
import ne from "../../../assets/img/stateflags/ne.jpg";
import nh from "../../../assets/img/stateflags/nh.jpg";
import nj from "../../../assets/img/stateflags/nj.jpg";
import nm from "../../../assets/img/stateflags/nm.jpg";
import nv from "../../../assets/img/stateflags/nv.jpg";
import ny from "../../../assets/img/stateflags/ny.jpg";
import oh from "../../../assets/img/stateflags/oh.jpg";
import ok from "../../../assets/img/stateflags/ok.jpg";
import or from "../../../assets/img/stateflags/or.jpg";
import pa from "../../../assets/img/stateflags/pa.jpg";
import ri from "../../../assets/img/stateflags/ri.jpg";
import sc from "../../../assets/img/stateflags/sc.jpg";
import sd from "../../../assets/img/stateflags/sd.jpg";
import tn from "../../../assets/img/stateflags/tn.jpg";
import tx from "../../../assets/img/stateflags/tx.jpg";
import ut from "../../../assets/img/stateflags/ut.jpg";
import va from "../../../assets/img/stateflags/va.jpg";
import vt from "../../../assets/img/stateflags/vt.jpg";
import wa from "../../../assets/img/stateflags/wa.jpg";
import wi from "../../../assets/img/stateflags/wi.jpg";
import wv from "../../../assets/img/stateflags/wv.jpg";
import wy from "../../../assets/img/stateflags/wy.jpg";
import us from "../../../assets/img/american-flag.jpg";
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

const getFlag = (state) => {
	let url;
	state = state.toLowerCase();
	switch (state) {
		case 'ak':
			url = ak;
			break
		case 'al':
			url = al;
			break
		case 'ar':
			url = ar;
			break
		case 'az':
			url = az;
			break
		case 'ca':
			url = ca;
			break
		case 'co':
			url = co;
			break
		case 'ct':
			url = ct;
			break
		case 'de':
			url = de;
			break
		case 'fl':
			url = fl;
			break
		case 'ga':
			url = ga;
			break
		case 'hi':
			url = hi;
			break
		case 'ia':
			url = ia;
			break
		case 'id':
			url = id;
			break
		case 'il':
			url = il;
			break
		case 'in':
			url = indiana;
			break
		case 'ks':
			url = ks;
			break
		case 'ky':
			url = ky;
			break
		case 'la':
			url = la;
			break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break
		// case 'co':
		// 	url = co;
		// 	break

		default:
			url = us;
	}

	return <IMG src={url} alt="flag" />
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
								{getFlag(results[i].name)}
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
								{getFlag(results[i].name)}
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
								{getFlag(results[i].name)}
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