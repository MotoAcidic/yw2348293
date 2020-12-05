import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import '../swal.css'
import moment from "moment";
import { Chart } from 'react-charts'

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
		case "sushiswap":
			return "sushi";
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
		case "coin":
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



const calcPercentChange = (start, end) => {
	let final = 0;
	if (start > end) {
		final = -100 * (start - end) / start;
	} else if (start < end) {
		final = 100 * (end - start) / start
	}
	return final.toFixed(1);
}

const FarmGraph = ({ battle, coin }) => {
	const [startPrice, setStartPrice] = useState(null)
	const [price, setPrice] = useState(null);
	const [marketCap, setMarketCap] = useState(null);
	const [graphData, setGraphData] = useState([]);
	const [recentChange, setRecentChange] = useState(null);
	const [percentDone, setPercentDone] = useState(0);

	useEffect(() => {
		if (!price) {
			axios.get(`https://api.coingecko.com/api/v3/coins/${getGeckoId(coin)}/market_chart?vs_currency=usd&days=2`).then(res => {
				let { market_caps, prices } = res.data;
				console.log(coin, market_caps, prices);
				setMarketCap(market_caps[market_caps.length - 1][1].toLocaleString(undefined, { maximumFractionDigits: 0 }));
				setPrice(prices[prices.length - 1][1].toFixed(2));
				const start = battle.bettingEnd;
				for (let i = 0; i < prices.length; i++) {
					// console.log("price", prices[i][0], start);
					if (prices[i][0] / 1000 >= start) {
						console.log("yea!", prices[i][0], i, prices)
						prices = prices.slice(i);
						break;
					}
				}
				const curr = prices[prices.length - 1][0] / 1000;
				const percent = 100 * (curr - start) / (battle.battleEnd - start);
				let chartData = [];
				for (let i = 0; i < prices.length; i++) {
					chartData.push([i, prices[i][1]]);
				}
				setPercentDone(percent);
				setStartPrice(prices[0][1].toFixed(2))
				setRecentChange(calcPercentChange(prices[0][1], prices[prices.length - 1][1]))
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

	console.log("coin", coin)

	return (
		<StyledContent>
			<Row>
				<Column>
					{/* <StyledTitle>{coin}</StyledTitle> */}
					<SubTitle>Initial Price</SubTitle>
					<Text>${startPrice}</Text>
				</Column>
				<Column>
					{/* <StyledTitle>{coin}</StyledTitle> */}
					<SubTitle>Current Price</SubTitle>
					<Text>${price}</Text>
				</Column>
				<Column>
					<SubTitle>Change</SubTitle>
					{/* <SubTitle>Market Cap</SubTitle>
					<Text>{marketCap !== "0" ? "$" + marketCap : "unknown"}</Text> */}
					{recentChange >= 0 ?
						<GreenText>+{recentChange}%</GreenText>
						:
						<RedText>{recentChange}%</RedText>
					}
				</Column>
			</Row>
			{/* <Change>
				<PriceTime>Change:</PriceTime>
				{recentChange >= 0 ?
					<GreenText>+{recentChange}%</GreenText>
					:
					<RedText>{recentChange}%</RedText>
				}
			</Change> */}
			{graphData &&
				<ChartContainer style={{ width: `${percentDone}%` }}>
					<Chart data={data} axes={axes} series={series} />
				</ChartContainer>
			}
			<XAxisTicks>
				<Date>
					{moment.unix(battle.bettingEnd).utc().format('MM/DD')}
				</Date>
				<Date>
					{moment.unix(battle.bettingEnd).utc().add(1, 'days').format('MM/DD')}
				</Date>
				<Date>
					{moment.unix(battle.bettingEnd).utc().add(2, 'days').format('MM/DD')}
				</Date>
				{/* <Date>
					{moment.unix(battle.bettingEnd).utc().add(3, 'days').format('MM/DD')}
				</Date> */}
			</XAxisTicks>
		</StyledContent>
	)
}

const Date = styled.div`
font-family: "GilroyMedium";
font-size: 12px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
margin-bottom: 10px;
`


const XAxisTicks = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
`

const Change = styled.div`
display: flex;
align-items: center;
margin-bottom: 15px;
`

const Row = styled.div`
display: flex;
justify-content: space-between;
margin-bottom: 20px;
`

const Column = styled.div`
display: flex;
flex-direction: column;`

const ChartContainer = styled.div`
height: 4vw;
width: 100%;
margin-bottom: 10px;
`

const StyledContent = styled.div`
  display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
`

const StyledTitle = styled.div`
font-family: "Gilroy";
font-size: 28px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
margin-bottom: 5px;
`

const SubTitle = styled.div`
font-family: "Gilroy";
margin-bottom: 5px;
font-size: 12px;
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
font-family: "Gilroy";
font-size: 14px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
	margin-bottom: 10px;
	letter-spacing: 1px;
`
const PriceTime = styled.div`
font-family: "SF Mono Semibold";
font-size: 14px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
	// padding: 2px 4px 2px 4px;
	// border: 1px solid white;
	// letter-spacing: 1px;
`

const GreenText = styled.div`
font-family: "SF Mono Semibold";
font-size: 14px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
	text-align: left;
	letter-spacing: 1px;
	color: #38ff00;
	// margin-left: 10px;
`
const RedText = styled.div`
font-family: "SF Mono Semibold";
font-size: 14px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
	text-align: left;
	letter-spacing: 1px;
	color: #ff4343;
	// margin-left: 10px;
`

export default FarmGraph;