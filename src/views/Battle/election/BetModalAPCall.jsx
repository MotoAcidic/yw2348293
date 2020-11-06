
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import { useWallet } from "use-wallet";
import useModal from '../../../hooks/useModal'
import RulesModal from "./BetRulesModal";
import Cookie from 'universal-cookie'
import Container from '../../../components/Container'
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
import { placeWARBetAP, placeETHBetAP, getCurrentBetsAP, getCurrentBalancesAP, getRewardsAP, getFinishedAP, redeem } from '../../../yamUtils'
import Swal from 'sweetalert2';
import { getElectionContracts, harvest } from '../../../yamUtils'
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

const Bet = ({ candidateInfo, electionContract }) => {
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

	const [ethInput, setETHInput] = useState(0);
	const [warInput, setWARInput] = useState(0);
	const [disabled, setDisabled] = useState(false)
	const [farmBets, setFarmBets] = useState({ choice1ETHPot: 0, choice2ETHPot: 0, choice1WARPot: 0, choice2WARPot: 0 });
	const [farmBalances, setFarmBalances] = useState({ choice1ETHBal: 0, choice2ETHBal: 0, choice1WARBal: 0, choice2WARBal: 0 });
	const stakedBalance = useStakedBalance(contract)
	const { onUnstake } = useUnstake(contract)
	const [pending, setPending] = useState(false);

	const tokenContract = useMemo(() => {
		return getContract(ethereum, "0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde")
	}, [ethereum, "0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde"])

	const { onApprove } = useApprove(tokenContract, electionContract)
	const allowance = useAllowance(tokenContract, electionContract)
	// console.log(allowance);

	const [onPresentUnstake] = useModal(
		<UnstakeModal
			max={stakedBalance}
			onConfirm={onUnstake}
			tokenName={"WAR"}
		/>
	)

	const claimAndUnstake = () => {
		console.log(contract);
		console.log(account);
		harvest(contract, account);
		onPresentUnstake()
	}

	const fireUnstakeSWAL = () => {
		let cookie = new Cookie()
		if (cookie.get("seenUnstakeSWAL")) {
			return;
		}
		Swal.fire("Please make sure you have $WAR or $ETH in your MetaMask Wallet to place a bet.\n\n$WAR in your WARchest (below) needs to be unstaked to use it in a bet.\n\nView the full betting rules below.")
		cookie.set("seenUnstakeSWAL", true)
	}

	useEffect(() => {
		const getBets = async () => {
			const bets = await getCurrentBetsAP(yam);
			const balances = await getCurrentBalancesAP(yam, account);
			setFarmBalances(balances);
			// console.log("gotbets", bets);
			setFarmBets(bets);
		}
		// console.log("got da yams???", yam)
		if (yam) {
			getBets();
		}
		fireUnstakeSWAL();
	}, [yam, account])

	const placeBet = () => {
		if (yam && account) {
			// if (stakedBalance) {
			// 	claimAndUnstake()
			// 	return
			// }
			console.log("Betting", candidateInfo, warInput, ethInput)
			if (warInput < 0 || ethInput < 0) {
				Swal.fire('Please enter a valid value to bet!')
				return
			}
			if (!ethInput && !warInput) {
				Swal.fire("Place a bet!");
				return;
			}
			const candidate = candidateInfo === "choice1" ? 1 : 2;
			if (warInput) {
				setPending(true)
				placeWARBetAP(yam, candidate, parseFloat(warInput), account).then((ret) => setPending(false))
			}
			if (ethInput) {
				// console.log("Eth Bet", candidate, ethInput)
				setPending(true)
				placeETHBetAP(yam, candidate, parseFloat(ethInput), account).then((ret) => {
					setPending(false)
				})
			}
		}
	}

	const redeemRewards = async () => {
		const done = await getFinishedAP(yam);
		console.log("election finished?", done);
		getRewardsAP(yam, account);
	}

	const handleApprove = useCallback(async () => {
		try {
			const txHash = await onApprove()
			console.log(txHash);
			// user rejected tx or didn't go thru
			if (!txHash) {
			}
		} catch (e) {
			console.log(e)
		}
	}, [onApprove])

	const message = candidateInfo === "choice1" ? <Message><u>YES</u>, the AP&nbsp;<u>will</u>&nbsp;call the election before 00:00 UTC on Nov 7th.</Message> : <Message><u>NO</u>, the AP&nbsp;<u>will not</u>&nbsp;call the election before 00:00 UTC on Nov 7th.</Message>

	return (
		<Container size="sm">
			<VersusContainer>

				<TitleText>
					Your Bets
					</TitleText>
				<YourBets>
					{!farmBalances.choice1WARBal > 0 && !farmBalances.choice1ETHBal > 0 &&
						!farmBalances.choice2WARBal > 0 && !farmBalances.choice2ETHBal > 0 ?
						<SmallText>none, place a bet!</SmallText>
						: null
					}
					{farmBalances.choice1WARBal > 0 || farmBalances.choice1ETHBal > 0 ?
						<Column>
							<StyledText1>
								YES
							</StyledText1>
							<Space />
							{farmBalances.choice1WARBal > 0 &&
								<Bets>
									<AmountBet>
										{'$WAR: ' + farmBalances.choice1WARBal.toLocaleString()}
									</AmountBet>
								</Bets>
							}
							{farmBalances.choice1ETHBal > 0 &&
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.choice1ETHBal.toLocaleString()}
									</AmountBet>
								</Bets>}
						</Column>
						: null
					}
					{farmBalances.choice2WARBal > 0 || farmBalances.choice2ETHBal > 0 ?
						<Column>
							<StyledText2>
								NO
							</StyledText2>
							<Space />
							{farmBalances.choice2WARBal > 0 &&
								<Bets>
									<AmountBet>
										{'$WAR: ' + farmBalances.choice2WARBal.toLocaleString()}
									</AmountBet>
								</Bets>
							}
							{farmBalances.choice2ETHBal > 0 &&
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.choice2ETHBal.toLocaleString()}
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
						<StyledText1>
							YES
							</StyledText1>
						<AmountBet>
							{'$WAR: ' + farmBets.choice1WARPot.toLocaleString()}
						</AmountBet>
						<AmountBet>
							{'$ETH: ' + farmBets.choice1ETHPot.toLocaleString()}
						</AmountBet>
					</BetDisplay>
					<BetDisplay>
						<StyledText2>
							NO
							</StyledText2>
						<AmountBet>
							{'$WAR: ' + farmBets.choice2WARPot.toLocaleString()}
						</AmountBet>
						<AmountBet>
							{'$ETH: ' + farmBets.choice2ETHPot.toLocaleString()}
						</AmountBet>
					</BetDisplay>
				</AllBets>
				<Separator />
				{message}
				{allowance.toNumber() > 0 ?
					<Top>
						<Text>
							Bet $WAR:
							</Text>
						<InputContainer>
							<Input disabled={pending ? true : false} type="number" min="0" value={warInput} onChange={e => setWARInput(e.target.value)} />
								WAR
						</InputContainer>
					</Top>
					: <><Button size="xlg" onClick={() => handleApprove()}>Approve WAR</Button>
						<Space />
					</>
				}
				<Top>
					<Text>
						Bet $ETH:
					</Text>
					<InputContainer>
						<Input disabled={pending ? true : false} type="number" min="0" value={ethInput} onChange={e => setETHInput(e.target.value)} />
								ETH
						</InputContainer>
				</Top>
				{pending ?
					<BetPlaced>Your bet is pending. Check MetaMask for updates.</BetPlaced>
					:
					<Button size="xlg" onClick={() => placeBet()} disabled={!account || disabled ? true : false}>Place a Bet</Button>
				}
			</VersusContainer>
			{/* <Button size="xlg" onClick={() => redeemRewards()}>Redeem Rewards</Button> */}
		</Container>
	)
}

const Message = styled.div`
color: white;
font-family: Gilroy;
font-size: 22px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1.2;
letter-spacing: normal;
margin-top: 20px;
margin-bottom: 10px;
width: 85%;
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

const StyledText = styled.div`
	font-family: "Edo";
	font-weight: normal;
font-size: 30px;
`

const StyledText1 = styled.div`
	height: 40px;
  width: 40px;
	border-radius: 50%;
  display: flex;
  align-items: center;
	justify-content: center;
	margin-bottom: 10px;
	font-family: "Edo";
	font-weight: normal;
background-color: #AB1003;
font-size: 40px;
border-radius: 50%;
`
const StyledText2 = styled.div`
	height: 40px;
  width: 40px;
font-size: 40px;
border-radius: 50%;
  display: flex;
  align-items: center;
	justify-content: center;
	margin-bottom: 10px;
	font-family: "Edo";
	font-weight: normal;
	background-color: #15437F;
	border-radius: 50%;

`
const Bets = styled.div`
display: flex;
align-items: center;
margin-bottom: 10px;`

const Top = styled.div`
width: 80%;
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
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(4,2,43,1);
padding: 20px;
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