import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import WinnerChalice from "../../assets/img/win@2x.png";
import './swal.css'
import VotesModal from "./PersVotesModal.jsx";
import useModal from '../../hooks/useModal'
import personalities from '../Battle/influencerbattles/personalities'
import Button from '../../components/Button'
import useYam from '../../hooks/useYam'
import { useWallet } from "use-wallet";
import { getRewards, getUserBet } from '../../yamUtils'

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

const PopularityCard = ({ farms, startDate, item }) => {
	const [userBet, setUserBet] = useState(false);
	const [alreadyRedeemed, setAlreadyRedeemed] = useState(false);
	const [userLost, setUserLost] = useState(false);
	const yam = useYam()
	const { account, connect } = useWallet()
	let pool1, pool2, pool3, pool4, winner1, winner2
	if (item.length === 2) {
		pool1 = personalities.find(person => person.handle === item[0].pool1.name)
		pool2 = personalities.find(person => person.handle === item[0].pool2.name)
		pool3 = personalities.find(person => person.handle === item[1].pool1.name)
		pool4 = personalities.find(person => person.handle === item[1].pool2.name)
		winner1 = item[0].pool1.totalVotes - item[0].pool2.totalVotes > 0 ? 1 : 2
		winner2 = item[1].pool1.totalVotes - item[1].pool2.totalVotes > 0 ? 1 : 2
	} else {
		pool1 = personalities.find(person => person.handle === item[0].pool1.name)
		pool2 = personalities.find(person => person.handle === item[0].pool2.name)
		winner1 = item[0].pool1.totalVotes - item[0].pool2.totalVotes > 0 ? 1 : 2
	}
	const [presentVotesModal1] = useModal(<VotesModal battleId={item[0]._id} farms={farms} pool1={pool1} pool2={pool2} winner={winner1} />);
	const [presentVotesModal2] = useModal(<VotesModal battleId={item[1] ? item[1]._id : ""} pool1={pool3} pool2={pool4} winner={winner2} />);

	const redeemBet = (betId) => {
		setTimeout(() => {
			getRewards(yam, betId, account)
		}, 1000);
	}

	const getRedeemable = async () => {
		const isRedeemable = await getUserBet(yam, item[0]._id, account);
		if (isRedeemable) {
			setUserBet(true);
			if (isRedeemable.isClaimed) setAlreadyRedeemed(true);
			if (!isRedeemable.won) setUserLost(true);
		}
	}

	useEffect(() => {
		if (account && yam) {
			getRedeemable();
		}
	}, [account, yam])



	const getClaim = () => {
		if (userLost) {
			return (
				<Text>you lost the bet</Text>
			)
		} else if (alreadyRedeemed) {
			return (
				<Text>bet rewards redeemed</Text>
			)
		} else if (!userBet) {
			return (
				<Text>you didn't bet</Text>
			)
		}
		return (
			<Button size="lg" onClick={() => redeemBet(item[0]._id)} >Claim ETH Bet</Button>
		)
	}

	return (
		<VSContentContainer>
			<div>{startDate}</div>
			<VersusItem
				onClick={presentVotesModal1}
			>
				<VersusCard>
					<StyledContent>
						{winner1 === 1 ? <WinningCardIcon src={pool1.picture} /> : <StyledCardIcon src={pool1.picture} />}
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
						{winner1 === 2 ? <WinningCardIcon src={pool2.picture} /> : <StyledCardIcon src={pool2.picture} />}
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
			{account ? getClaim() : <Text>connect wallet to claim</Text>}

		</VSContentContainer>
	)
}

const Text = styled.div`
font-family: "Gilroy";
font-size: 18px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
margin-top: 5px;
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

const Space = styled.div`height: 10px;`

const Divider = styled.div`
	margin-left: 10%;
	width: 80%;
  height: 2px;
  opacity: 0.5;
  background-color: #ffffff;
`

const StyledCardIcon = styled.img`
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
const WinningCardIcon = styled.img`
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

const VSContentContainer = styled.div`
width: 30%;

min-width: 300px;
  height: 300px;
  border-radius: 8px;
    border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
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
`

const VersusItem = styled.div`
width: 85%;
margin: 0 auto;
justify-content: space-around;
display: flex;
flex-direction: row;
align-items: center;
font-size: 16px;
border-radius: 10px;
cursor: pointer;
transition: all .1s linear;
&:hover {
  background-color: rgba(256,256,256,0.05);
}
`

export default PopularityCard