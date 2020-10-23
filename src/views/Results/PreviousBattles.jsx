import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import WinnerChalice from "../../assets/img/win@2x.png";
import useFarms from '../../hooks/useFarms'
import './swal.css'
import moment from 'moment';
import PriceHistoryCard from './PriceHistoryCard';

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

function getDay() {
	let day = Math.floor((((Date.now() / 1000) - 1601406000) / 86400) + 1)
	return day
}

const Versus = ({ history }) => {
	let [farms] = useFarms()
	if (!history.length) {
		return null
	}
	console.log("previousBattles", history);

	let currSeasonHistory = []

	const sortedHistory = history.sort((a, b) => {
		return a.day - b.day
	})
	for (let i = 0; i < sortedHistory.length; i++) {
		if (i + 1 < sortedHistory.length && sortedHistory[i].day === sortedHistory[i + 1].day) {
			currSeasonHistory.push([sortedHistory[i], sortedHistory[i + 1]]);
			i++;
		} else {
			currSeasonHistory.push([sortedHistory[i]]);
		}
	}

	currSeasonHistory.reverse()
	console.log("curr: ", currSeasonHistory);

	currSeasonHistory = currSeasonHistory.map(item => {
		let pool1, pool2, pool3, pool4, winner1, winner2
		if (item.length === 0) return null;
		const startDate = moment("09-28", 'MM-DD').add(item[0].day, 'day').format('MMM Do');
		if (item[0].usesPercentChange) {
			if (item[0].day === getDay() - 1) return null;
			return (<PriceHistoryCard farms={farms} startDate={startDate} item={item} />)
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
		console.log("?", item);
		return (
			<VSContentContainer>
				<div>{startDate}</div>
				{item.length === 1 && <Space />}
				<VersusItem>
					<VersusCard>
						<StyledContent>
							{winner1 === 1 ? <WinningCardIcon>{pool1.icon}</WinningCardIcon> : <StyledCardIcon>{pool1.icon}</StyledCardIcon>}
							{winner1 === 1 && <Chalice />}
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
							{winner1 === 2 && <Chalice />}

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
									{winner2 === 1 && <Chalice />}

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
									{winner2 === 2 && <Chalice />}

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

	if (currSeasonHistory.length % 3 === 2) {
		currSeasonHistory.push(<FillCard />)
	}

	return (
		<>
			{currSeasonHistory.length > 0 &&
				<Title>Season 2 Battle History</Title>}
			<SeasonContainer>
				{currSeasonHistory}
			</SeasonContainer>

		</>
	)
}

const FillCard = styled.div`
width: 30%;
min-width: 300px;
`

const Chalice = styled.div`
position: absolute;
margin-left: 95px;
margin-top: -55px;
background-repeat: no-repeat;
background-size: cover;
height: 30px;
width: 22px;
background-image: url(${WinnerChalice});
`

const Space = styled.div`height: 61px;`

const SeasonContainer = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-between;
width: 80%;
max-width: 1200px;
margin-bottom: 40px;
` : styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-around;
width: 90vw;
margin-bottom: 40px;
`

const Percent = styled.div`
	font-family: "Gilroy";
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
font-size: 40px;
height: 62px;
width: 62px;
border-radius: 40px;
align-items: center;
display: flex;
justify-content: center;
box-shadow: rgba(226, 214, 207, 0.3) 4px 4px 8px inset, rgba(247, 244, 242, 0.3) -6px -6px 12px inset;
margin: 2px;
`
const WinningCardIcon = styled.div`
font-size: 40px;
height: 62px;
width: 62px;
border-radius: 40px;
align-items: center;
display: flex;
justify-content: center;
box-shadow: rgba(226, 214, 207, 0.3) 4px 4px 8px inset, rgba(247, 244, 242, 0.3) -6px -6px 12px inset;
border: solid 2px rgba(255, 213, 0, 0.7);
margin: 2px;
`
const Title = styled.div`
font-family: "Gilroy";
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

const VSContentContainer = styled.div`
width: 30%;

min-width: 300px;
  height: 398px;
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
`

const StyledContent = styled.div`
width: 100px;
height: 140px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-around;
`

const StyledDetails = styled.div`
  text-align: center;
`

const StyledDetail = styled.div`
font-family: "Gilroy";
font-size: 20px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`
const StyledTitle = styled.h4`
width: 80%;
margin: 0;
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