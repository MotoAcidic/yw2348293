import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import useYam from '../../../hooks/useYam'
import { useWallet } from 'use-wallet'
import useFarms from '../../../hooks/useFarms'
import Cookie from 'universal-cookie'
import './swal.css'
import moment from 'moment';
import personalities from './personalities'

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
	if (!schedule || !schedule.length) {
		return <Title>Check Back Later</Title>
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
	// console.log(formattedSchedule);

	formattedSchedule = formattedSchedule.map(item => {
		let pool1, pool2, pool3, pool4
		if (item.length === 0) {
			return null
		}
		if (item.length === 1) {
			pool1 = personalities.find(person => person.handle === item[0].pool1.name)
			pool2 = personalities.find(person => person.handle === item[0].pool2.name)
		}
		if (item.length === 2) {
			pool1 = personalities.find(person => person.handle === item[0].pool1.name)
			pool2 = personalities.find(person => person.handle === item[0].pool2.name)
			pool3 = personalities.find(person => person.handle === item[1].pool1.name)
			pool4 = personalities.find(person => person.handle === item[1].pool2.name)
		}
		if (!pool1 || !pool2) {
			return null
		}

		const startDate = moment("09-28", 'MM-DD').add(item[0].day, 'day').format('MMM Do');

		return (
			<VSContentContainer>
				<div>{startDate}</div>
				<Container>
					<VersusItem>
						<VersusCard>
							<StyledContent>
								<Picture src={pool1.picture} />
								<StyledTitle>{pool1.handle}</StyledTitle>
							</StyledContent>
						</VersusCard>
                    VS
					<VersusCard>
							<StyledContent>
								<Picture src={pool2.picture} />
								<StyledTitle>{pool2.handle}</StyledTitle>
							</StyledContent>
						</VersusCard>
					</VersusItem>
					{item.length === 2 && (
						<>
							<Divider />
							<VersusItem>
								<VersusCard>
									<StyledContent>
										<Picture src={pool3.picture} />
										<StyledTitle>{pool3.handle}</StyledTitle>
									</StyledContent>
								</VersusCard>
                    VS
								<VersusCard>
									<StyledContent>
										<Picture src={pool4.picture} />
										<StyledTitle>{pool4.handle}</StyledTitle>
									</StyledContent>
								</VersusCard>
							</VersusItem>
						</>
					)}
				</Container>
			</VSContentContainer>
		)
	})

	return (
		<ScheduleContainer>{formattedSchedule}</ScheduleContainer>
	)
}

const Picture = styled.img`
width: 80px;
height: 80px;
border-radius: 50%;
margin-bottom: 20px;
`

const Divider = !isMobile() ? styled.div`
width: 3px;
  height: 80%;
  background-color: rgba(255, 256, 256, 0.5);
` : styled.div`
margin: 20px 0 20px 10%;
width: 80%;
  height: 2px;
  background-color: rgba(255, 256, 256, 0.5);
`

const StyledCardIcon = styled.div`
font-size: 50px;
height: 62px;
width: 62px;
border-radius: 40px;
align-items: center;
display: flex;
justify-content: center;
margin: 2px;
`

const ScheduleContainer = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-between;
width: 80%;
max-width: 1200px;
margin-bottom: 60px;
` : styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-evenly;
width: 80vw;
margin-bottom: 30px;
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
	height: 189px;
	max-width: 48%;
	min-width: 420px;
	flex: 1 1 300px;
  border-radius: 8px;
    border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
font-family: "Gilroy";
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
	color: #ffffff;
	margin-bottom: 40px;
	` : styled.div`
width: 97%;
  border-radius: 8px;
    border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
font-family: "Gilroy";
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 40px;
  padding: 20px 0 20px 0;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 80%;
`

const StyledTitle = styled.div`
margin: 0;
font-family: "Gilroy";
font-size: 14px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  padding: 0;
`

const Title = styled.div`
width: 80%;
margin: 0 auto 80px auto;
font-family: "Gilroy";
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