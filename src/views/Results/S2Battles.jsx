import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import useFarms from '../../hooks/useFarms'
import './swal.css'
import moment from 'moment';
import PercentChangeCard from './PercentChangeCard';
import PopularityCard from "./PopularityCard";

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

const S2Battles = ({ history }) => {
	let [farms] = useFarms()
	const [seasonHistory, setSeasonHistory] = useState([]);

	useEffect(() => {
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
		currSeasonHistory = currSeasonHistory.map(item => {
			if (item.length === 0) return null;
			const startDate = moment("09-28", 'MM-DD').add(item[0].day, 'day').format('MMM Do');
			if (item[0].usesPercentChange) {
				if (item[0].day === getDay() - 1) return null;
				return (<PercentChangeCard key={startDate} farms={farms} startDate={startDate} item={item} />)
			}
			return (<PopularityCard key={startDate} farms={farms} startDate={startDate} item={item} />);
		})
		if (currSeasonHistory.length % 3 === 2) {
			currSeasonHistory.push(<FillCard />)
		}

		setSeasonHistory(currSeasonHistory);
	}, [history])

	return (
		<>
			{seasonHistory.length > 0 && <>
				<Title>Season 2 Battle History</Title>
				<SubTitle>listed dates are when voting occured</SubTitle>
			</>}
			<SeasonContainer>
				{seasonHistory}
			</SeasonContainer>

		</>
	)
}

const SubTitle = styled.div`
font-family: "GilroyMedium";
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin: 0 auto 20px auto;
`;

const FillCard = styled.div`
width: 30%;
min-width: 300px;
`

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
  margin: 20px auto 5px;
`

export default S2Battles