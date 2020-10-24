import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import './swal.css'
import { Chart } from 'react-charts'
import moment from "moment";

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

function getGeckoId(coin) {
	coin = coin.toLowerCase();
	switch (coin) {
		case "snx":
			return "havven";
		case "yfi":
			return "yearn-finance";
		case "comp":
			return "compound-governance-token";
		case "chads":
			return "chads-vc";
		case "wbtc":
			return "wrapped-bitcoin";
		case "uni":
			return "uniswap";
		case "wnxm":
			return "wrapped-nxm";
		case "mkr":
			return "maker";
		case "bzrx":
			return "bzx-protocol";
		case "srm":
			return "serum";
		case "farm":
			return "harvest-finance";
		case "based":
			return "based-money";
		case "yam":
			return "yam-2";
		case "send":
			return "social-send";
		case "hate":
			return "heavens-gate";
		case "stbu":
			return "stobox-token";
		case "yfl":
			return "yflink";
		case "snow":
			return "snowswap";
		case "pickle":
			return "pickle-finance";
		case "meme":
			return "degenerator";
		case "cream":
			return "cream-2";
		case "value":
			return "value-liquidity";
		case "link":
			return "chainlink";
		default:
			return (coin);
	}
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

const calcPercentChange = (start, end) => {
	let final = 0;
	if (start > end) {
		final = -100 * (start - end) / start;
	} else if (start < end) {
		final = 100 * (end - start) / start
	}
	return final.toFixed(1);
}

const FarmGraph = ({ farm }) => {
	const [prices, setPrices] = useState(null);
	const [graphData, setGraphData] = useState(null);
	const [recentChange, setRecentChange] = useState(null);
	const [percentOfDay, setPercentOfDay] = useState(0);
	const [days, setDays] = useState({ prev: null, next: null });

	useEffect(() => {
		if (!prices) {
			axios.get(`https://api.coingecko.com/api/v3/coins/${getGeckoId(farm.id)}/market_chart?vs_currency=usd&days=1`).then(res => {
				let { prices } = res.data;

				let start;
				const format = 'hh:mm:ss';
				if (moment.utc().isBetween(moment.utc('18:00:00', format), moment.utc('23:59:59', format))) {
					start = moment.utc().startOf('hour').hours(18).unix()
				} else {
					start = moment.utc().subtract(1, 'days').startOf('hour').hours(18).unix();
				}

				setDays({ prev: moment.unix(start).utc().format('MM/DD'), next: moment.unix(start).utc().add(1, 'days').format('MM/DD') })
				for (let i = 0; i < prices.length; i++) {
					// console.log("price", prices[i][0], start);
					if (prices[i][0] / 1000 >= start) {
						prices = prices.slice(i);
						break;
					}
				}
				const curr = prices[prices.length - 1][0] / 1000;
				const percent = (curr - start) / 864;
				setPercentOfDay(percent);

				// console.log("curr: ", curr, "\nstart: ", start, "\ndiff: ", curr - start, "\n%: ", percent);

				setRecentChange(calcPercentChange(prices[0][1], prices[prices.length - 1][1]))
				setPrices(prices);
				let chartData = [];
				for (let i = 0; i < prices.length; i++) {
					chartData.push([i, prices[i][1]]);
				}
				setGraphData(chartData);

			})
		}
	}, [])

	const axes = React.useMemo(() => [
		{
			primary: true, type: 'time', position: 'bottom', show: false
		},
		{
			type: 'linear', position: 'left', showGrid: false, showTicks: false, show: false,
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

	// console.log("farm", farm)

	return (
		<StyledContent>
			<TopContent>
				<StyledCardIcon>{farm.icon}</StyledCardIcon>
				<TopArea>
					<StyledTitle>{farm.id}</StyledTitle>
					<Text>${prices && prices[prices.length - 1][1].toFixed(2)}</Text>
				</TopArea>
				<TopArea>
					<SubTitle>Recent Change</SubTitle>
					{recentChange >= 0 ?
						<GreenText>+{recentChange}%</GreenText>
						:
						<RedText>{recentChange}%</RedText>
					}
				</TopArea>
			</TopContent>
			{graphData &&
				<ChartContainer>


					<div style={{ width: `${percentOfDay}%`, height: '60px' }}>
						<Chart data={data} axes={axes} series={series} />
					</div>
					<ChartPrices>
						<Left>
							<Date>
								{days.prev}
							</Date>
							<Price>
								${prices && prices[0][1].toFixed(2)}
							</Price>
						</Left>
						<Right>
							<Date>
								{days.next}

							</Date>
							<Price>
								${prices && prices[prices.length - 1][1].toFixed(2)}
							</Price>

						</Right>
					</ChartPrices>
				</ChartContainer>
			}
		</StyledContent>
	)
}

const Price = styled.div`
font-family: "Gilroy";
font-size: 16px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;`

const Date = styled.div`
font-family: "GilroyMedium";
font-size: 16px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
margin-bottom: 10px;
`

const Right = styled.div`
display: flex;
flex-direction: column;
align-items: flex-end;`

const Left = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;`

const ChartPrices = styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-between;
margin-top: 10px;
`

const TopArea = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
height: 100%;
margin-right: 40px;
`

const StyledCardIcon = styled.div`
  font-size: 60px;
  align-items: center;
  display: flex;
	justify-content: center;
	margin-right: 20px;
`;

const TopContent = styled.div`
display: flex;
flex-direction: row;
flex-wrap: nowrap;
align-items: center;
width: 100%;
height: 80px;
margin-bottom: 20px;
`

const ChartContainer = styled.div`
width: 100%;
margin-bottom: 20px;
max-width: 420px;
`

const StyledContent = styled.div`
  display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	align-items: center;
`

const StyledTitle = styled.div`
font-family: "Gilroy";
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
margin-bottom: 16px;
`

const SubTitle = styled.div`
font-family: "Gilroy";
font-size: 20px;
margin-bottom: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
`
const Text = styled.div`
font-family: "GilroyMedium";
font-size: 18px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
	letter-spacing: 1px;
`
const GreenText = styled.div`
font-family: "GilroyMedium";
font-size: 18px;

font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
	text-align: left;
	letter-spacing: 1px;
	color: #38ff00;
`
const RedText = styled.div`
font-family: "GilroyMedium";
font-size: 18px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
	text-align: left;
	letter-spacing: 1px;
	color: #ff4343;

`

export default FarmGraph;