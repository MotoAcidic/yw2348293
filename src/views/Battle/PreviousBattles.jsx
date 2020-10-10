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


const Versus = ({ history }) => {
	let [farms] = useFarms()
	const yam = useYam()
	const { account, connect } = useWallet()
	if (!history.length) {
		return null
	}

	let prevSeasonHistory = []
	let currSeasonHistory = []

	const sortedHistory = history.sort((a, b) => {
		return a.day - b.day
	})
	for (let i = 0; i < sortedHistory.length; i++) {
		if (sortedHistory[i].season < 2) {
			// checks if another battle exists in array, then adds as group
			// if it was on the same day
			if (i + 1 < sortedHistory.length && sortedHistory[i].day === sortedHistory[i + 1].day) {
				prevSeasonHistory.push([sortedHistory[i], sortedHistory[i + 1]]);
				i++;
			} else {
				prevSeasonHistory.push([sortedHistory[i]]);
			}
		} else {
			if (i + 1 < sortedHistory.length && sortedHistory[i].day === sortedHistory[i + 1].day) {
				currSeasonHistory.push([sortedHistory[i], sortedHistory[i + 1]]);
				i++;
			} else {
				currSeasonHistory.push([sortedHistory[i]]);
			}
		}
	}

	// for (let i = 0; i < history.length / 2; i++) {
	// 	prevSeasonHistory.push(history.filter(item => item.day - 1 === i))
	// }

	prevSeasonHistory.reverse()
	currSeasonHistory.reverse()

	console.log("prev: ", prevSeasonHistory, "\ncurr: ", currSeasonHistory);

	currSeasonHistory = currSeasonHistory.map(item => {
		let pool1, pool2, pool3, pool4, winner1, winner2
		if (item.length === 0) {
			return null
		}
		if (item.length === 2) {
			pool1 = farms.find(farm => farm.id === item[0].pool1.name)
			pool2 = farms.find(farm => farm.id === item[0].pool2.name)
			pool3 = farms.find(farm => farm.id === item[1].pool1.name)
			pool4 = farms.find(farm => farm.id === item[1].pool2.name)
			winner1 = item[0].pool1.totalVotes - item[0].pool2.totalVotes > 0 ? 1 : 2
			winner2 = item[1].pool1.totalVotes - item[1].pool2.totalVotes > 0 ? 1 : 2
		} else {
			pool1 = farms.find(farm => farm.id === item[0].pool1.name)
			pool2 = farms.find(farm => farm.id === item[0].pool2.name)
			winner1 = item[0].pool1.totalVotes - item[0].pool2.totalVotes > 0 ? 1 : 2
		}

		console.log(item[0].pool1.totalVotes);
		return (
			<VSContentContainer>
				<div>Oct {item[0].day - 1}</div>
				{item.length === 1 && <Space />}
				<VersusItem>
					<VersusCard>
						<StyledContent>
							{winner1 === 1 ? <WinningCardIcon>{pool1.icon}</WinningCardIcon> : <StyledCardIcon>{pool1.icon}</StyledCardIcon>}
							<StyledTitle>{pool1.name}</StyledTitle>
							<Percent>{
								((parseInt(item[0].pool1.totalVotes, 10) /
									(parseInt(item[0].pool1.totalVotes, 10) + parseInt(item[0].pool2.totalVotes, 10)))
									* 100).toFixed(0)
							}%</Percent>
						</StyledContent>
					</VersusCard>
                    VS
					<VersusCard>
						<StyledContent>
							{winner1 === 2 ? <WinningCardIcon>{pool2.icon}</WinningCardIcon> : <StyledCardIcon>{pool2.icon}</StyledCardIcon>}
							<StyledTitle>{pool2.name}</StyledTitle>
							<Percent>{
								((parseInt(item[0].pool2.totalVotes, 10) /
									(parseInt(item[0].pool1.totalVotes, 10) + parseInt(item[0].pool2.totalVotes, 10)))
									* 100).toFixed(0)
							}%</Percent>
						</StyledContent>
					</VersusCard>
				</VersusItem>
				{item.length === 1 && <Space />}
				{item.length === 2 && (
					<>
						<Divider />
						<VersusItem>
							<VersusCard>
								<StyledContent>
									{winner2 === 1 ? <WinningCardIcon>{pool3.icon}</WinningCardIcon> : <StyledCardIcon>{pool3.icon}</StyledCardIcon>}
									<StyledTitle>{pool3.name}</StyledTitle>
									<Percent>{
										((parseInt(item[1].pool1.totalVotes, 10) /
											(parseInt(item[1].pool1.totalVotes, 10) + parseInt(item[1].pool2.totalVotes, 10)))
											* 100).toFixed(0)
									}%</Percent>
								</StyledContent>
							</VersusCard>
              		VS
							<VersusCard>
								<StyledContent>
									{winner2 === 2 ? <WinningCardIcon>{pool4.icon}</WinningCardIcon> : <StyledCardIcon>{pool4.icon}</StyledCardIcon>}
									<StyledTitle>{pool4.name}</StyledTitle>
									<Percent>{
										((parseInt(item[1].pool2.totalVotes, 10) /
											(parseInt(item[1].pool1.totalVotes, 10) + parseInt(item[1].pool2.totalVotes, 10)))
											* 100).toFixed(0)
									}%</Percent>
								</StyledContent>
							</VersusCard>
						</VersusItem>
					</>
				)}
			</VSContentContainer>
		)
	})

	prevSeasonHistory = prevSeasonHistory.map(item => {
		let pool1, pool2, pool3, pool4, winner1, winner2
		if (item.length === 0) {
			return null
		}
		if (item.length === 2) {
			pool1 = farms.find(farm => farm.id === item[0].pool1.name)
			pool2 = farms.find(farm => farm.id === item[0].pool2.name)
			pool3 = farms.find(farm => farm.id === item[1].pool1.name)
			pool4 = farms.find(farm => farm.id === item[1].pool2.name)
			winner1 = item[0].pool1.totalVotes - item[0].pool2.totalVotes > 0 ? 1 : 2
			winner2 = item[1].pool1.totalVotes - item[1].pool2.totalVotes > 0 ? 1 : 2
		} else {
			pool1 = farms.find(farm => farm.id === item[0].pool1.name)
			pool2 = farms.find(farm => farm.id === item[0].pool2.name)
			winner1 = item[0].pool1.totalVotes - item[0].pool2.totalVotes > 0 ? 1 : 2
		}

		console.log(item[0].pool1.totalVotes);
		return (
			<VSContentContainer>
				{item[0].day - 1 ? <div>Oct {item[0].day - 1}</div> : <div>Sept 30th</div>}
				{item.length === 1 && <Space />}
				<VersusItem>
					<VersusCard>
						<StyledContent>
							{winner1 === 1 ? <WinningCardIcon>{pool1.icon}</WinningCardIcon> : <StyledCardIcon>{pool1.icon}</StyledCardIcon>}
							<StyledTitle>{pool1.name}</StyledTitle>
							<Percent>{
								((parseInt(item[0].pool1.totalVotes, 10) /
									(parseInt(item[0].pool1.totalVotes, 10) + parseInt(item[0].pool2.totalVotes, 10)))
									* 100).toFixed(0)
							}%</Percent>
						</StyledContent>
					</VersusCard>
                    VS
					<VersusCard>
						<StyledContent>
							{winner1 === 2 ? <WinningCardIcon>{pool2.icon}</WinningCardIcon> : <StyledCardIcon>{pool2.icon}</StyledCardIcon>}
							<StyledTitle>{pool2.name}</StyledTitle>
							<Percent>{
								((parseInt(item[0].pool2.totalVotes, 10) /
									(parseInt(item[0].pool1.totalVotes, 10) + parseInt(item[0].pool2.totalVotes, 10)))
									* 100).toFixed(0)
							}%</Percent>
						</StyledContent>
					</VersusCard>
				</VersusItem>
				{item.length === 1 && <Space />}
				{item.length === 2 && (
					<>
						<Divider />
						<VersusItem>
							<VersusCard>
								<StyledContent>
									{winner2 === 1 ? <WinningCardIcon>{pool3.icon}</WinningCardIcon> : <StyledCardIcon>{pool3.icon}</StyledCardIcon>}
									<StyledTitle>{pool3.name}</StyledTitle>
									<Percent>{
										((parseInt(item[1].pool1.totalVotes, 10) /
											(parseInt(item[1].pool1.totalVotes, 10) + parseInt(item[1].pool2.totalVotes, 10)))
											* 100).toFixed(0)
									}%</Percent>
								</StyledContent>
							</VersusCard>
              		VS
							<VersusCard>
								<StyledContent>
									{winner2 === 2 ? <WinningCardIcon>{pool4.icon}</WinningCardIcon> : <StyledCardIcon>{pool4.icon}</StyledCardIcon>}
									<StyledTitle>{pool4.name}</StyledTitle>
									<Percent>{
										((parseInt(item[1].pool2.totalVotes, 10) /
											(parseInt(item[1].pool1.totalVotes, 10) + parseInt(item[1].pool2.totalVotes, 10)))
											* 100).toFixed(0)
									}%</Percent>
								</StyledContent>
							</VersusCard>
						</VersusItem>
					</>
				)}
			</VSContentContainer>
		)
	})


	return (
		<>
			{currSeasonHistory.length > 0 &&
				<Title>Season 2</Title>
			}
			<SeasonContainer>
				{currSeasonHistory}
			</SeasonContainer>
			{prevSeasonHistory.length > 0 &&
				<Title>Season 1</Title>
			}
			<SeasonContainer>
				{prevSeasonHistory}
			</SeasonContainer>
		</>
	)
}

const Space = styled.div`height: 61px;`

const SeasonContainer = !isMobile() ? styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-around;
width: 1200px;
` : styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-around;
width: 90vw;
`

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

const Divider = styled.div`
margin-left: 10%;
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
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin: 20px auto 20px auto;
`;

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

const ButtonContainer = styled.div`
`
const VSContentContainer = styled.div`
width: 332px;
  height: 398px;
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
`

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

const StyledTitle = styled.h4`
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