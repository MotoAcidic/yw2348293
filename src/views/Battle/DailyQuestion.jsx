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
import FightInstructions from '../../assets/img/flightinstructions.png'

import useFarms from '../../hooks/useFarms'
import useFarm from '../../hooks/useFarm'
import { Farm } from '../../contexts/Farms'
import Cookie from 'universal-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import './swal.css'
import { forEachChild } from 'typescript'
import { options } from 'numeral'

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

const Question = ({ question, setResponse, voted }) => {
	const [checked, setChecked] = useState(cookie.get(question._id))

	const pick = (g) => {
		if (voted) {
			return;
		}
		cookie.set(question._id, g);
		setChecked(g);
		setResponse(g)
	}

	let questionOptions = [];
	question.options.forEach((option) => {
		questionOptions.push(
			<StyledContent>
				<StyledTitle>{option.name}</StyledTitle>
				{checked == option.name ? (
					<ButtonContainer onClick={() => pick(option.name)}>
						<img src={checkedIcon} width="40%" />
					</ButtonContainer>
				) : (
						<ButtonContainer onClick={() => pick(option.name)}>
							<img src={uncheckedIcon} width="40%" />
						</ButtonContainer>
					)}
			</StyledContent>
		)
	})

	return (
		<VersusCard>

			<RecDesc>
				Community question
      </RecDesc>
			<RecTitle>{question.description}</RecTitle>
			{(question.link && question.link.text) &&

				<a href={question.link.url} target="_blank" style={{ textDecoration: "none" }}>
					<RecDesc>
						{question.link.text} »
      </RecDesc>
				</a>
			}
			{questionOptions}
		</VersusCard>

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

const RecTitle = styled.div`
font-family: Alegreya;
margin: 20px 0 20px 0;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.24;
  letter-spacing: normal;
  text-align: center;
	color: #ffffff;
`;


const ButtonContainer = styled.div`

`


const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
	justify-content: space-between;
	margin: auto;
	margin-top: 20px;
	width: 80%;
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
width: 480px;
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 30px;
  border-radius: 8px;
  border: solid 2px #0095f0;
	background-color: #003677;
	margin-bottom: 40px;
` : styled.div`
width: calc(90vw - 60px);
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 30px;
  border-radius: 8px;
  border: solid 2px #0095f0;
	background-color: #003677;
	margin-bottom: 40px;
`


export default Question