import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useFarms from '../../hooks/useFarms'
import './swal.css'
import FarmGraph from "./InbetweenFarmGraph";
import VotingBalance from "./VotingBalance";
import CountDown from "./InbetweenCountDown";

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

const Inbetween = ({ battles }) => {
	let [farms] = useFarms()
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

	return (
		<>
			{battles &&
				<>
					<CountDown />
					<RecDesc>
						Which token price will perform better in 24 hours?
      		</RecDesc>
					<VersusContainer>
						<Options>
							<FarmGraph farm={battle1.farm1} />
							<Divider />
							<FarmGraph farm={battle1.farm2} />
						</Options>

						<VotingBalance farm1={battle1.farm1} farm2={battle1.farm2} />

					</VersusContainer>

					<VersusContainer>
						<Options>
							<FarmGraph farm={battle2.farm1} />
							<Divider />
							<FarmGraph farm={battle2.farm2} />
						</Options>
						<VotingBalance farm1={battle2.farm1} farm2={battle2.farm2} />
					</VersusContainer>
				</>
			}
			<Space />
		</>
	)
}

const Space = styled.div`
height: 80px;`

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
min-width: 2px;
margin: 0 40px 0 40px;
height: 200px;

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
	margin-bottom: 10px;
	`;

const VersusContainer = !isMobile() ? styled.div`
width: 920px;
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
background-color: rgba(256,256,256,0.08);
padding: 40px;
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

export default Inbetween