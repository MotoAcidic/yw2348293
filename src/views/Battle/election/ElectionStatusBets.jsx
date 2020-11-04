
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import { useWallet } from "use-wallet";
import useModal from '../../../hooks/useModal'
import RulesModal from "./BetRulesModal";
import Cookie from 'universal-cookie'
import Container from '../../../components/Container'
import MiniBiden from "../../../assets/img/biden@2x.png";
import MiniTrump from "../../../assets/img/trump@2x.png";
import useFarm from '../../../hooks/useFarm'
import useYam from '../../../hooks/useYam'
import { getDisplayBalance } from '../../../utils/formatBalance'
import { provider } from 'web3-core'
import useApprove from '../../../hooks/useApprove'
import './swal.css'
import UnstakeModal from './UnstakeModal'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useUnstake from '../../../hooks/useUnstake'
import useAllowance from '../../../hooks/useAllowance'
import { placeElectionWARBet, placeElectionETHBet, getCurrentBets, getCurrentBalances, getElectionRewards, getElectionFinished, redeem } from '../../../yamUtils'
import Swal from 'sweetalert2';
import { getElectionContracts, harvest } from '../../../yamUtils'
import Pool3 from "./Pool3";
import { getContract } from '../../../utils/erc20'


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

const Status = ({ battle, candidateInfo, electionContract }) => {
	const yam = useYam()
	const { account, connect, ethereum } = useWallet()

	const [farmBets, setFarmBets] = useState({ trumpETHPot: 0, bidenETHPot: 0, trumpWARPot: 0, bidenWARPot: 0 });
	const [farmBalances, setFarmBalances] = useState({ trumpETHBal: 0, bidenETHBal: 0, trumpWARBal: 0, bidenWARBal: 0 });

	useEffect(() => {
		const getBets = async () => {
			const bets = await getCurrentBets(yam);
			const balances = await getCurrentBalances(yam, account);
			setFarmBalances(balances);
			setFarmBets(bets);
		}
		if (yam) {
			getBets();
		}
	}, [yam, account])

	const redeemRewards = async () => {
		const done = await getElectionFinished(yam);
		console.log("election finished?", done);
		getElectionRewards(yam, account);
	}

	return (
		<Container size="sm">
			<VersusContainer>

				<TitleText>
					Your Bets
				</TitleText>
				<YourBets>
					{!farmBalances.trumpWARBal > 0 && !farmBalances.trumpETHBal > 0 &&
						!farmBalances.bidenWARBal > 0 && !farmBalances.bidenETHBal > 0 ?
						<SmallText>none</SmallText>
						: null
					}
					{farmBalances.trumpWARBal > 0 || farmBalances.trumpETHBal > 0 ?
						<Column>
							<CardIcon src={MiniTrump} />
							<Space />
							{farmBalances.trumpWARBal > 0 &&
								<Bets>
									<AmountBet>
										{'$WAR: ' + farmBalances.trumpWARBal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
									</AmountBet>
								</Bets>
							}
							{farmBalances.trumpETHBal > 0 &&
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.trumpETHBal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
									</AmountBet>
								</Bets>}
						</Column>
						: null
					}
					{farmBalances.bidenWARBal > 0 || farmBalances.bidenETHBal > 0 ?
						<Column>
							<CardIcon src={MiniBiden} />
							<Space />
							{farmBalances.bidenWARBal > 0 &&
								<Bets>
									<AmountBet>
										{'$WAR: ' + farmBalances.bidenWARBal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
									</AmountBet>
								</Bets>
							}
							{farmBalances.bidenETHBal > 0 &&
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.bidenETHBal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
									</AmountBet>
								</Bets>
							}

						</Column>
						: null
					}
				</YourBets>

				<Separator />

				<Text>
					All Bets
					</Text>
				<AllBets>
					<BetDisplay>
						<CardIcon src={MiniTrump} />
						<AmountBet>
							{"$WAR: " + farmBets.trumpWARPot.toLocaleString(undefined, { maximumFractionDigits: 2 })}
						</AmountBet>
						<AmountBet>
							{"$ETH: " + farmBets.trumpETHPot.toLocaleString(undefined, { maximumFractionDigits: 2 })}
						</AmountBet>
					</BetDisplay>
					<BetDisplay>
						<CardIcon src={MiniBiden} />
						<AmountBet>
							{"$WAR: " + farmBets.bidenWARPot.toLocaleString(undefined, { maximumFractionDigits: 2 })}
						</AmountBet>
						<AmountBet>
							{"$ETH: " + farmBets.bidenETHPot.toLocaleString(undefined, { maximumFractionDigits: 2 })}
						</AmountBet>
					</BetDisplay>
				</AllBets>
			</VersusContainer>
			{/* <Button size="xlg" onClick={() => redeemRewards()}>Redeem Rewards</Button> */}
		</Container>
	)
}


const Separator = styled.div`
  width: 80%;
  height: 1px;
  margin: 15px;
  background-image: linear-gradient(90deg, rgba(256, 256, 256, 0), rgba(256, 256, 256, 0.6) 20%, rgba(256, 256, 256, 0.6) 80%, rgba(256, 256, 256, 0));
`

const BetDisplay = styled.div`
display: flex;
flex-direction: column;
justify-content: space-evenly;
align-items: center;
`

const AllBets = styled.div`
width: 100%;
height: 100px;
display: flex;
flex-direction: row;
justify-content: space-evenly;
`

const YourBets = styled.div`
display: flex;
width: 100%;
justify-content: space-evenly;`

const Column = styled.div`
display: flex;
flex-direction: column;
align-items: center;`


const Space = styled.div`
height: 20px;`


const AmountBet = styled.div`
font-family: Gilroy;
font-size: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;`

const CardIcon = styled.img`
	height: 40px;
  width: 40px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 15px;
`
const Bets = styled.div`
display: flex;
align-items: center;
margin-bottom: 10px;`


const TitleText = styled.div`
font-family: "Gilroy";
font-size: 22px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: rgb(255, 190, 26);
margin-bottom: 10px;
`

const Text = styled.div`
font-family: "Gilroy";
color: rgb(255, 190, 26);
font-size: 22px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
margin-bottom: 5px;
align-items: center;
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
margin-top: 10px;
`

const VersusContainer = !isMobile() ? styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-around;
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
height: 550px;
min-width: 300px;
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

export default Status