import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import { useWallet } from "use-wallet";
import useModal from '../../../hooks/useModal'
import Cookie from 'universal-cookie'
import Container from '../../../components/Container'
import useFarm from '../../../hooks/useFarm'
import useYam from '../../../hooks/useYam'
import { provider } from 'web3-core'
import useApprove from '../../../hooks/useApprove'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useUnstake from '../../../hooks/useUnstake'
import useAllowance from '../../../hooks/useAllowance'
import { placeTestWARBet, placeTestETHBet, getTestBets, getTestBalances, getTestRewards, getTestFinished, redeem } from '../../../yamUtils'
import { getPotVals, getUserBet, getRewards, getBet } from "../../../yamUtils";
import Swal from 'sweetalert2';
import { getElectionContracts, harvest } from '../../../yamUtils'
import BigNumber from 'bignumber.js'
import VotingBalance from '../VotingBalance'


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

const Bet = ({ battle, candidateInfo, electionContract }) => {
	const yam = useYam()
	const { account, connect, ethereum } = useWallet()
	const {
		contract,
		depositToken,
		depositTokenAddress,
		earnToken,
		name,
		icon,
	} = useFarm('BATTLEPOOL') || {
		contract: null,
		depositToken: '',
		depositTokenAddress: '',
		earnToken: '',
		name: '',
		icon: ''
	}

	// const tokenContract = useMemo(() => {
	// 	return getContract(ethereum, depositTokenAddress)
	// }, [ethereum, depositTokenAddress])
	const [userBet, setUserBet] = useState(false);
	const [alreadyRedeemed, setAlreadyRedeemed] = useState(false);
	const [userLost, setUserLost] = useState(false);
	const [pending, setPending] = useState(false)
	const [farmBets, setFarmBets] = useState({ pool1ETHPot: { value: 0, choice: "" }, pool2ETHPot: { value: 0, choice: "" } });
	const [farmBalances, setFarmBalances] = useState({ value: 0 });

	// const tokenContract = useMemo(() => {
	// 	return getContract(ethereum, "0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde")
	// }, [ethereum, "0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde"])

	// console.log(tokenContract);
	// const { onApprove } = useApprove(tokenContract, electionContract)
	// const allowance = useAllowance(tokenContract, electionContract)
	// console.log(allowance);

	useEffect(() => {
		const getBets = async () => {
			let precision = new BigNumber(10).pow(18)
			let bets = await getPotVals(yam, battle._id);
			bets = {
				pool1ETHPot: {
					choice: bets.choice0,
					value: bets.choice0ETHVal,
					regValue: bets.choice0Val
				},
				pool2ETHPot: {
					choice: bets.choice1,
					value: bets.choice1ETHVal,
					regValue: bets.choice1Val
				}
			}
			let balances = await getUserBet(yam, battle._id, account);
			balances = {
				choiceId: balances.choiceId,
				value: new BigNumber(balances.value).div(precision).toNumber()
			}
			setFarmBalances(balances);
			// console.log("gotbets", bets);
			setFarmBets(bets);
		}
		// console.log("got da yams???", yam)
		if (yam) {
			getBets();
			getRedeemable()
		}
	}, [yam, account])


	const getRedeemable = async () => {
		const bet = await getBet(yam, battle._id)
		const isRedeemable = await getUserBet(yam, battle._id, account);
		if (isRedeemable) {
			setUserBet(true);
			if (isRedeemable.isClaimed) setAlreadyRedeemed(true);
			if (!isRedeemable.won) setUserLost(true);
			if (!bet.winner) {
				setPending(true)
			}
		}
	}

	const redeemBet = (betId) => {
		getRewards(yam, betId, account)
	}

	// const handleApprove = useCallback(async () => {
	// 	try {
	// 		const txHash = await onApprove()
	// 		console.log(txHash);
	// 		// user rejected tx or didn't go thru
	// 		if (!txHash) {
	// 		}
	// 	} catch (e) {
	// 		console.log(e)
	// 	}
	// }, [onApprove])



	let status;

	if (!account) {
		status = "connect wallet to claim"
	}
	else if (userBet && !userLost && !alreadyRedeemed) {
		status = <Button size="lg" onClick={() => redeemBet(battle._id)} >Claim ETH Bet</Button>
	}
	else if (userLost) {
		status = "you lost this bet"
	}
	else if (alreadyRedeemed) {
		status = "bet successfully redeemed"
	}
	if (pending) {
		status = "waiting on results"
	}

	return (
		<Section>
			<InfoBlock >
				The Battle is now Complete
        	</InfoBlock>
			<VersusContainer>
				<TitleText>
					Your Bets
				</TitleText>
				<YourBets>
					{!farmBalances.value > 0 ?
						<NoBetsText>none, place a bet!</NoBetsText>
						: null
					}
					{farmBalances.value > 0 ?
						<Column>
							{farmBalances.value > 0 &&
								<Bets>
									<AmountBet>
										<SmallText>{farmBalances.choiceId}</SmallText>
										{'$ETH: ' + farmBalances.value.toLocaleString(undefined, {
											minimumFractionDigits: 3,
											maximumFractionDigits: 3
										})}
									</AmountBet>
								</Bets>}
						</Column>
						: null
					}
				</YourBets>

				<Separator />

				<TitleText>
					All Bets
				</TitleText>
				<AllBets>
					<BetDisplay>
						<CardIcon src={battle.pool1.icon} />
						<AmountBet>
							<SmallText>{farmBets.pool1ETHPot.choice}</SmallText>
							{'$ETH: ' + farmBets.pool1ETHPot.value.toLocaleString(undefined, {
								minimumFractionDigits: 3,
								maximumFractionDigits: 3
							})}
						</AmountBet>
					</BetDisplay>
					<BetDisplay>
						<CardIcon src={battle.pool2.icon} />
						<AmountBet>
							<SmallText>{farmBets.pool2ETHPot.choice}</SmallText>
							{'$ETH: ' + farmBets.pool2ETHPot.value.toLocaleString(undefined, {
								minimumFractionDigits: 3,
								maximumFractionDigits: 3
							})}
						</AmountBet>
					</BetDisplay>
				</AllBets>
				<Separator style={{ marginBottom: '30px', marginTop: '20px' }} />
				<VotingBalance votes1={farmBets.pool1ETHPot.regValue} votes2={farmBets.pool2ETHPot.regValue} icon1={battle.pool1.icon} icon2={battle.pool2.icon} />
			</VersusContainer>
			<InfoBlock>
				{status}
			</InfoBlock>
		</Section>
	)
}

const Section = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 20%;
height: 85%;
`

const InfoBlock = styled.a`
font-family: "Gilroy";
color: rgb(255, 204, 160);
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
align-items: center;
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
max-width: 80%;
padding-left: 10px;
padding-right: 10px;
margin-bottom: 20px;
margin-top: 8px;
// background-color: rgba(0,0,0,0.6);
border-radius: 8px;
color: white;
text-shadow: -1px 0 1px black, 0 1px 1px black, 1px 0 1px black, 0 -1px 1px black;
`
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

const BetPlaced = styled.div`
color: rgb(255, 190, 26);
font-family: Gilroy;
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
`

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
	height: 50px;
  width: 50px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0px 10px 10px 10px;
`
const Bets = styled.div`
display: flex;
align-items: center;
margin-bottom: 10px;`

const Bottom = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
`

const Row = styled.div`
width: 100%;
display: flex;
justify-content: space-evenly;`

const Top = styled.div`
width: 100%;
display: flex;
flex-direction: row;
flex-wrap: nowrap;
align-items: center;
margin-bottom: 20px;
justify-content: space-between;`

const TitleText = styled.div`
font-family: "Gilroy";
font-size: 22px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: rgb(255, 204, 160);
margin-bottom: 10px;
margin-top: 10px;

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
margin-bottom: 5px;
`

const NoBetsText = styled.div`
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

const Input = styled.input`
font-family: "SF Mono Semibold";
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
letter-spacing: normal;
color: #ffb700;
text-align: right;
height: 35px;
width: 90%;
background: none;
border: none;
margin-right: 10px;
:focus{
	outline: none;
}`

const InputContainer = styled.div`
width: 170px;
border-radius: 8px;
box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
border: solid 1px rgba(255, 183, 0, 0.5);
background-color: rgba(255, 255, 255, 0.2);
font-family: "SF Mono Semibold";
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
letter-spacing: normal;
color: #ffb700;
text-align: right;
display: flex;
justify-content: flex-end;
align-items: center;
padding-right: 10px;`

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
border: solid 2px rgba(255, 255, 255, 0.2);
background-color: rgb(40,40,40);
padding: 10px;
padding-top: 20px;
width: 100%;
height: 100%;
` : styled.div`
margin: 0 0 40px 0;
max-width: 95wvw;
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
	background-color: rgba(4,2,43,1);
	`

export default Bet