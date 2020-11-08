import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import useFarms from '../../hooks/useFarms'
import './swal.css'
import moment from 'moment';
import PercentChangeCard from './PercentChangeCard';
import PopularityCard from "./PopularityCard";
import axios from "axios";


function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

function getServerURI() {
	if (window.location.hostname === "localhost") {
		return "http://localhost:5000";
	}
	return "https://yieldwars-api.herokuapp.com";
}

function getDay() {
	let day = Math.floor((((Date.now() / 1000) - 1601406000) / 86400) + 1)
	return day
}

const S2Battles = () => {
	let [leaderboard, setLeaderboard] = useState([])
	let [battles, setBattles] = useState([]);


	let [farms] = useFarms()
	const [seasonHistory, setSeasonHistory] = useState([]);

	useEffect(() => {
		axios.post(`${getServerURI()}/api/season-info`, ({ season: 2 })).then(res => {
			let lb = res.data.leaderboard.leaderboard.sort((a, b) => {
				return b.votes - a.votes;
			}).slice(0, 5);
			const leaderboardContent = lb.map((item, index) => {
				const votes = Number(item.votes.toFixed(0));
				let pool = farms.find(farm => farm.id === item.pool);
				let rank = "th";
				if (index === 0) rank = "st";
				if (index === 1) rank = "nd";
				if (index === 2) rank = "rd";
				return (
					<LeaderBoardItem key={index}>
						<StyledContent>
							{index + 1}
							{rank}
							<StyledCardIcon>{pool.icon}</StyledCardIcon>
							<StyledTitle>{pool.name}</StyledTitle>
							<StyledVotes>{votes.toLocaleString(navigator.language, { minimumFractionDigits: 0 })} votes</StyledVotes>
						</StyledContent>
					</LeaderBoardItem>
				)
			})

			const history = res.data.history;
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

			setSeasonHistory(currSeasonHistory);
			setLeaderboard(leaderboardContent);
			setBattles(currSeasonHistory);
		}).catch(err => {
			console.log(err);
		})
	}, []);


	return (
		<>
			<Title>Season 2 Leaderboard</Title>
			<LeaderBoard>{leaderboard}</LeaderBoard>
			{seasonHistory.length > 0 &&
				<Title>Season 2 Battle History</Title>
			}
			<SeasonContainer>
				{battles}
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


const LeaderBoardItem = !isMobile()
	? styled.div`
  text-align: center;
  min-width: 120px;
  width: 17%;
  height: 200px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-bottom: 20px;`
	: styled.div`
  text-align: center;
  width: 40%;
  min-width: 200px;
  height: 200px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  padding: 20px 0 20px 0;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;`;

const LeaderBoard = !isMobile() ? styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 80%;
  max-width: 1200px;
  margin-bottom: 60px;
` : styled.div`
  display: flex;
  width: 90vw;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-bottom: 60px;
`;

const S1LeaderBoard = !isMobile() ? styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 80%;
  max-width: 1200px;
  margin-bottom: 60px;
` : styled.div`
  display: flex;
  width: 90vw;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-bottom: 60px;
`;

const StyledVotes = styled.h4`
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
`;

const StyledTitle = styled.h4`
  margin: 0;
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  padding: 0;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`;

const StyledCardIcon = styled.div`
  font-size: 60px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
`;


export default S2Battles