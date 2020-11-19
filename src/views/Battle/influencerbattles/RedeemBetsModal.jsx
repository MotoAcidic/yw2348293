import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import { useWallet } from "use-wallet";
import useModal from '../../../hooks/useModal'
import RulesModal from "./BetRulesModal";
import Cookie from 'universal-cookie'
import Modal, { ModalProps } from '../../../components/Modal'
import Container from '../../../components/Container'
import MiniBiden from "../../../assets/img/biden@2x.png";
import MiniTrump from "../../../assets/img/trump@2x.png";
import useYam from '../../../hooks/useYam'
import './swal.css'
import { harvest, getBattleAPR } from '../../../yamUtils'
import UnstakeModal from './UnstakeModal'
import useFarm from '../../../hooks/useFarm'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useUnstake from '../../../hooks/useUnstake'
import { placeElectionWARBet, getCurrentBets, getCurrentBalances, getOutstandingBets, getRewards, getUserBet } from '../../../yamUtils'
import Swal from 'sweetalert2';
import axios from 'axios';
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

const Bet = ({ battle }) => {
	const [userBet, setUserBet] = useState(false);
	const [alreadyRedeemed, setAlreadyRedeemed] = useState(false);
	const [userLost, setUserLost] = useState(false);
	const yam = useYam()
	const { account, connect } = useWallet()

	const [outstandingBets, setOutstandingBets] = useState([])


	let battle1 = battle[0]
	console.log("battle1", battle1)

	const getRedeemable = async () => {
		const isRedeemable = await getUserBet(yam, battle1._id, account);
		if (isRedeemable) {
			setUserBet(true);
			if (isRedeemable.isClaimed) setAlreadyRedeemed(true);
			if (!isRedeemable.won) setUserLost(true);
		}
	}

	const getta = async () => {
		let outstandingBets = await getOutstandingBets(yam, account)
		setOutstandingBets(outstandingBets)
		console.log(outstandingBets);
	}

	useEffect(() => {
		if (yam && account) {
			getta()
		}
		if (account && yam) {
			getRedeemable();
		}
	}, [yam, account]);

	if (!battle1) {
		return <div/>
	}
	let winner1  = battle1.pool1.totalVotes > battle1.pool2.totalVotes ? battle1.pool1 : battle1.pool2
	let correctVote1 = winner1.votes.find(vote => vote.address === account)
	let person = personalities.find(person => person.handle === winner1.name)


	const redeemBet = (betId) => {
		getRewards(yam, betId, account)
	}





	if (!battle || !battle.length) {
		return null
	}

	// let bets = outstandingBets.map(bet => {
	// 	return (
	// 		<BetItem>
	// 			<Button onClick={() => redeemBet(bet.betId)} >Claim</Button>
	// 			<SmallText>{bet.betId}</SmallText>
	// 		</BetItem>
	// 	)
	// })

	const getClaim = () => {
		if (userLost) {
			return (
				<Text>😞 YOU LOST! 😞</Text>
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
			<>
					<Title>

			💰 YOU WON! 💰
			</Title>
			<Button size="lg" onClick={() => redeemBet(battle1._id)} >Claim ETH Bet</Button>
			</>
		)
	}

	return (
		<Container size="sm">
			<StyledModal>
				<VersusContainer>
					<Title>

						{/* {correctVote1 ? "💰 YOU WON! 💰" : "😞 YOU LOST! 😞"} */}
					</Title>
					<Picture src={person.picture} />
					<Text>
						The Winner is {winner1.name}!
					</Text>
					<Space />
					<Separator />
					<YourBets>
						{/* {bets} */}
						<BetItem>
							
					{getClaim()}

							{/* <Button size="lg" onClick={() => redeemBet(battle1._id)} >Claim ETH Bet</Button> */}
							{/* <SmallText>{battle1._id}</SmallText> */}
						</BetItem>
					</YourBets>
					{/* <Text>
						Your Bets
					</Text>
					<YourBets>
						{!farmBalances.bal1 > 0 && !farmBalances.bal2 > 0 &&
							!farmBalances.bal3 > 0 && !farmBalances.bal4 > 0 ?
							<SmallText>none</SmallText>
							: null
						}
						{farmBalances.bal1 > 0 ?
							<Column>
								<CardIcon src={battle1.pers1.picture} />
								<Space />
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.bal1.toLocaleString()}
									</AmountBet>
								</Bets>
							</Column>
							: null
						}
						{farmBalances.bal2 > 0 ?
							<Column>
								<CardIcon src={battle1.pers2.picture} />
								<Space />
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.bal2.toLocaleString()}
									</AmountBet>
								</Bets>
							</Column>
							: null
						}
						{farmBalances.bal3 > 0 ?
							<Column>
								<CardIcon src={battle2.pers1.picture} />
								<Space />
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.bal3.toLocaleString()}
									</AmountBet>
								</Bets>
							</Column>
							: null
						}{farmBalances.bal4 > 0 ?
							<Column>
								<CardIcon src={battle2.pers2.picture} />
								<Space />
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.bal4.toLocaleString()}
									</AmountBet>
								</Bets>
							</Column>
							: null
						}
					</YourBets>
					<Space />
					<Separator />
					<Text>
						Total Bets
					</Text>
					<AllBets>
						<BetContainer>
							<BetDisplay>
								<CardIcon src={battle1.pers1.picture} />
								<AmountBet>
									{farmBets.pot1.toLocaleString() + " $ETH"}
								</AmountBet>
							</BetDisplay>
							vs
							<BetDisplay>
								<CardIcon src={battle1.pers2.picture} />
								<AmountBet>
									{farmBets.pot2.toLocaleString() + " $ETH"}
								</AmountBet>
							</BetDisplay>
						</BetContainer>
						<BetContainer>
							<BetDisplay>
								<CardIcon src={battle2.pers1.picture} />
								<AmountBet>
									{farmBets.pot3.toLocaleString() + " $ETH"}
								</AmountBet>
							</BetDisplay>
							vs
							<BetDisplay>
								<CardIcon src={battle2.pers2.picture} />
								<AmountBet>
									{farmBets.pot4.toLocaleString() + " $ETH"}
								</AmountBet>
							</BetDisplay>
						</BetContainer>
					</AllBets> */}
					<Space />
				</VersusContainer>
			</StyledModal>
		</Container>
	)
}

const BetItem = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center
`

const Title = !isMobile() ? styled.div`
font-family: "Gilroy";
  font-size: 26px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin-bottom: 5px;
` : styled.div`
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin-bottom: 10px;
  margin-top: 40px;
`;

const Picture = styled.img`
height: 40%;
width: 40%;
min-width: 130px;
min-height: 130px;
max-width: 160px;
max-height: 160px;
border-radius: 50%;
margin-bottom: 20px;
`

const Separator = styled.div`
  width: 80%;
  height: 1px;
  margin: 15px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
`


const YourBets = styled.div`
display: flex;
width: 100%;
justify-content: space-evenly;
margin-top: 10px;
`

const Space = styled.div`
height: 20px;`

const StyledModal = styled.div`
border-radius: 8px;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 100000;
`

const Text = styled.div`
font-family: "Gilroy";
font-size: 22px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
margin-bottom: 5px;
`

const SmallText = styled.div`
font-family: "Gilroy";
font-size: 14px;
font-weight: 100;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
margin-top: 15px;
`


const VersusContainer = !isMobile() ? styled.div`
display: flex;
flex-direction: column;
align-items: center;
font-size: 30px;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(4,2,43,1);
padding: 20px;
` : styled.div`
margin: 0 0 40px 0;
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
	padding: 20px;
	border-radius: 8px;
	border: solid 2px rgba(255, 183, 0, 0.3);
	background-color: rgba(256,256,256,0.08);`

export default Bet