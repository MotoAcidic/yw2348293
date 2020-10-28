import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import useFarms from '../../hooks/useFarms'
import moment from 'moment';
import './swal.css'
import PopularityCard from "./PopularityCard";

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

const S1Battles = ({ history }) => {
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
			return (<PopularityCard key={startDate} farms={farms} startDate={startDate} item={item} />);
		})
		if (currSeasonHistory.length % 3 === 2) {
			currSeasonHistory.push(<FillCard />)
		}

		setSeasonHistory(currSeasonHistory);
	}, [history])


	return (
		<>
			{seasonHistory.length > 0 &&
				<Title>Season 1 Battle History</Title>
			}
			<SeasonContainer>
				{seasonHistory}
			</SeasonContainer>
		</>
	)
}

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
margin-bottom: 20px;
` : styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-around;
margin-bottom: 20px;
width: 90vw;
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

export default S1Battles