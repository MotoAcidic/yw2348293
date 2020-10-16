import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import CardIcon from '../../components/CardIcon'
import axios from 'axios'
import './swal.css'
import { Chart } from 'react-charts'

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

const calcPercentChange = (start, end) => {
	let final = 0;
	console.log("startr", start, end)
	if (start > end) {
		final = 100 * (start - end) / start;
	} else if (start < end) {
		final = 100 * (end - start) / start
	}
	return final
}

const FarmGraph = ({ farm }) => {
	const [price, setPrice] = useState(null);
	const [marketCap, setMarketCap] = useState(null);
	const [graphData, setGraphData] = useState(null);
	const [recentChange, setRecentChange] = useState(null);


	if (!price || !marketCap || !graphData) {
		axios.get(`https://api.coingecko.com/api/v3/coins/yieldwars-com/market_chart?vs_currency=usd&days=1`).then(res => {
			console.log("geck", res.data);
			const { market_caps, prices } = res.data;
			setMarketCap(market_caps[market_caps.length - 1][1]);
			setPrice(prices[prices.length - 1][1]);
			let chartData = [];
			// For using 2 days (24 data points)
			// const start = Math.floor(prices.length / 2);
			// for (let i = start; i < prices.length; i++) {
			// 	chartData.push([i, prices[i][1]]);
			// }
			for (let i = 0; i < prices.length; i++) {
				chartData.push([i, prices[i][1]]);
			}
			// 	const percentChange = 100 * (prices[prices.length - 1][1] - prices[0][1]) / prices[0][1];
			// setRecentChange(percentChange);
			setRecentChange(calcPercentChange(prices[0][1], prices[prices.length - 1][1]))
			console.log("mechart", chartData);
			setGraphData(chartData);
		})
	}

	const axes = React.useMemo(() => [
		{
			primary: true, type: 'time', position: 'bottom', showGrid: false, showTicks: false,
		},
		{
			type: 'linear', position: 'left', showGrid: false, showTicks: false,
		}
	])
	const data = React.useMemo(() => [
		{
			data: graphData
		}
	])
	const series = React.useMemo(
		() => ({
			showPoints: false,
		}),
		[]
	);


	return (
		<StyledContent>
			<CardIcon>{farm.icon}</CardIcon>
			<StyledTitle>{farm.name}</StyledTitle>
			{graphData &&
				<ChartContainer>
					<Chart data={data} axes={axes} series={series} />
				</ChartContainer>
			}
		</StyledContent>
	)
}

const ChartContainer = styled.div`height: 75px; width: 200px;`

const RecDesc = styled.div`
font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
	color: #ffffff;
`;

const Space = styled.div`
height: 80px;`

const ButtonContainer = styled.div``

const VersusItem = !isMobile() ? styled.div`
width: 540px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
font-size: 30px;
margin: 20px auto 40px auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
` : styled.div`
margin: 40px 0 40px 0;
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
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`

const StyledTitle = styled.h4`
margin: 0;
font-family: "Gilroy";
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
width: 220px;
  height: 247px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
` : styled.div`width: 40%;
height: 247px;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(256,256,256,0.08);
`

export default FarmGraph;