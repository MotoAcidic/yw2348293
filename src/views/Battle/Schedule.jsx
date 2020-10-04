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
import Win from '../../assets/img/win.png'
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


const Versus = ({ schedule }) => {
	let [farms] = useFarms()
	const yam = useYam()
	const { account, connect } = useWallet()
	if (!schedule.length) {
		return null
	}
	let offset = schedule[0].day
	for (let i = 0; i < schedule.length; i++) {
		if (schedule[i].day < offset) {
			offset = schedule[i].day
		}
	}
	let formattedSchedule = []
	for (let i = 0; i < schedule.length / 2; i++) {
		formattedSchedule.push(schedule.filter(item => item.day === i + offset))
	}
	console.log(formattedSchedule);

	formattedSchedule = formattedSchedule.map(item => {
		let pool1 = farms.find(farm => farm.id === item[0].pool1.name)
		let pool2 = farms.find(farm => farm.id === item[0].pool2.name)
		let pool3 = farms.find(farm => farm.id === item[1].pool1.name)
		let pool4 = farms.find(farm => farm.id === item[1].pool2.name)

		return (
			<VSContentContainer>
				<div>Oct {item[0].day - 1}</div>
				<Container>
					<VersusItem>
						<VersusCard>
							<StyledContent>
								<StyledCardIcon>{pool1.icon}</StyledCardIcon>
								<StyledTitle>{pool1.name}</StyledTitle>
							</StyledContent>
						</VersusCard>
                    VS
					<VersusCard>
							<StyledContent>
								<StyledCardIcon>{pool2.icon}</StyledCardIcon>
								<StyledTitle>{pool2.name}</StyledTitle>
							</StyledContent>
						</VersusCard>
					</VersusItem>
					<Divider />
					<VersusItem>
						<VersusCard>
							<StyledContent>
								<StyledCardIcon>{pool3.icon}</StyledCardIcon>
								<StyledTitle>{pool3.name}</StyledTitle>
							</StyledContent>
						</VersusCard>
                    VS
					<VersusCard>
							<StyledContent>
								<StyledCardIcon>{pool4.icon}</StyledCardIcon>
								<StyledTitle>{pool4.name}</StyledTitle>
							</StyledContent>
						</VersusCard>
					</VersusItem>
				</Container>
			</VSContentContainer>
		)
	})

	return (
		<ScheduleContainer>{formattedSchedule}</ScheduleContainer>
	)
}

const Percent = styled.div`
width: 20%;
font-family: Alegreya;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const Divider = !isMobile() ? styled.div`` : styled.div`
margin: 20px 0 20px 10%;
width: 80%;
  height: 2px;
  opacity: 0.5;
  background-color: #ffffff;
`


const StyledCardIcon = styled.div`
background-color: #002450;
font-size: 36px;
height: 62px;
width: 62px;
border-radius: 40px;
align-items: center;
display: flex;
justify-content: center;
box-shadow: rgb(226, 214, 207) 4px 4px 8px inset, rgb(247, 244, 242) -6px -6px 12px inset;
margin: 2px;
`

const WinningCardIcon = styled.div`
background-color: #002450;
font-size: 36px;
height: 62px;
width: 62px;
border-radius: 40px;
align-items: center;
display: flex;
justify-content: center;
box-shadow: rgb(226, 214, 207) 4px 4px 8px inset, rgb(247, 244, 242) -6px -6px 12px inset;
border: solid 2px #ffd500;

margin: 2px;
`

const Title = styled.div`
font-family: Alegreya;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-top: 1%;
`

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;

`

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 3vh;
  max-width: 730px;
  height: 570px;
  width: 100%;
`

const StyledCard = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  border-radius: 8px;
    background-color: #003677;
`

const StyledText = styled.p`
font-family: Alegreya;
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const ScheduleContainer = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
width: 1100px;
margin-top: 3vh;
` : styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-evenly;
width: 80vw;
margin-top: 3vh;
`;

const Container = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
` : styled.div`
flex-wrap: wrap;
justify-content: space-around;
flex-direction: row;
`


const VSContentContainer = !isMobile() ? styled.div`
width: 499px;
  height: 189px;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
font-family: Alegreya;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
` : styled.div`
width: 100%;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
font-family: Alegreya;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 20px;
  padding: 20px 0 20px 0;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`

const StyledDetails = styled.div`
  text-align: center;
`

const StyledDetail = styled.div`
font-family: Alegreya;
font-size: 20px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const StyledTitle = styled.div`
width: 50%;
margin: 0;
font-family: Alegreya;
font-size: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  padding: 0;
`

const VersusCard = styled.div`
width: 100px;
  height: 120px;

`

const VersusItem = styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
font-size: 16px;

`

export default Versus