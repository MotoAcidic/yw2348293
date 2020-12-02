import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import { useWallet } from "use-wallet";
import useModal from '../../hooks/useModal'
import RulesModal from "./BetRulesModal";
import Cookie from 'universal-cookie'
import Container from '../../components/Container'
import MiniBiden from "../../assets/img/alexandraicon.png";
import MiniTrump from "../../assets/img/vitalikicon.jpg";
import useFarm from '../../hooks/useFarm'
import useYam from '../../hooks/useYam'
import { getDisplayBalance } from '../../utils/formatBalance'
import { provider } from 'web3-core'
import useApprove from '../../hooks/useApprove'
import './swal.css'
import UnstakeModal from './UnstakeModal'
import useStakedBalance from '../../hooks/useStakedBalance'
import useUnstake from '../../hooks/useUnstake'
import useAllowance from '../../hooks/useAllowance'
import { placeChessWARBet, placeChessETHBet, getChessBets, getChessBalances, getChessRewards, getChessFinished, redeem } from '../../yamUtils'
import Swal from 'sweetalert2';
import { getElectionContracts, harvest } from '../../yamUtils'
import Pool3 from "./Pool3";
import { getContract } from '../../utils/erc20'


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

	const [ethInput, setETHInput] = useState(0);
	const [warInput, setWARInput] = useState(0);
	const [disabled, setDisabled] = useState(false)
	const [farmBets, setFarmBets] = useState({ trumpETHPot: 0, bidenETHPot: 0, trumpWARPot: 0, bidenWARPot: 0 });
	const [farmBalances, setFarmBalances] = useState({ trumpETHBal: 0, bidenETHBal: 0, trumpWARBal: 0, bidenWARBal: 0 });
	const stakedBalance = useStakedBalance(contract)
	const { onUnstake } = useUnstake(contract)
	const [pending, setPending] = useState(false);

	const tokenContract = useMemo(() => {
		return getContract(ethereum, "0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde")
	}, [ethereum, "0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde"])

	console.log(tokenContract);
	const { onApprove } = useApprove(tokenContract, electionContract)
	const allowance = useAllowance(tokenContract, electionContract)
	console.log(allowance);

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
		if (cookie.get("seenChessUnstakeSWAL")) {
			return;
		}
		Swal.fire("Please make sure you have $WAR or $ETH in your MetaMask Wallet to place a bet.\n\n$WAR in your WARchest (below) needs to be unstaked to use it in a bet.\n\nView the full betting rules below.")
		cookie.set("seenChessUnstakeSWAL", true)
	}

	useEffect(() => {
		const getBets = async () => {
			const bets = await getChessBets(yam);
			const balances = await getChessBalances(yam, account);
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
			if (warInput < 0 || ethInput < 0) {
				Swal.fire('Please enter a valid value to bet!')
				return
			}
			if (warInput) {
				const candidate = candidateInfo.name === "Vitalik" ? 1 : 2;
				// console.log("War Bet", candidate, warInput)
				setPending(true)
				placeChessWARBet(yam, candidate, parseFloat(warInput), account).then((ret) => setPending(false))
			}
			if (ethInput) {
				const candidate = candidateInfo.name === "Vitalik" ? 1 : 2;
				// console.log("Eth Bet", candidate, ethInput)
				setPending(true)
				placeChessETHBet(yam, candidate, parseFloat(ethInput), account).then((ret) => {
					setPending(false)
				})
			}
			if (!ethInput && !warInput) {
				Swal.fire("Place a bet for a candidate!");
			}
		}
	}

	const redeemRewards = async () => {
		const done = await getChessFinished(yam);
		console.log("election finished?", done);
		getChessRewards(yam, account);
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

	return (
		<Container size="sm">
			<VersusContainer>

				<TitleText>
					Your Bets
				</TitleText>
				<YourBets>
					{!farmBalances.trumpWARBal > 0 && !farmBalances.trumpETHBal > 0 &&
						!farmBalances.bidenWARBal > 0 && !farmBalances.bidenETHBal > 0 ?
						<SmallText>none, place a bet!</SmallText>
						: null
					}
					{farmBalances.trumpWARBal > 0 || farmBalances.trumpETHBal > 0 ?
						<Column>
							<CardIcon src={MiniTrump} />
							<Space />
							{farmBalances.trumpWARBal > 0 &&
								<Bets>
									<AmountBet>
										{'$WAR: ' + farmBalances.trumpWARBal.toLocaleString()}
									</AmountBet>
								</Bets>
							}
							{farmBalances.trumpETHBal > 0 &&
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.trumpETHBal.toLocaleString()}
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
										{'$WAR: ' + farmBalances.bidenWARBal.toLocaleString()}
									</AmountBet>
								</Bets>
							}
							{farmBalances.bidenETHBal > 0 &&
								<Bets>
									<AmountBet>
										{'$ETH: ' + farmBalances.bidenETHBal.toLocaleString()}
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
							{farmBets.trumpWARPot.toLocaleString() + " $WAR"}
						</AmountBet>
						<AmountBet>
							{farmBets.trumpETHPot.toLocaleString() + " $ETH"}
						</AmountBet>
					</BetDisplay>
					<BetDisplay>
						<CardIcon src={MiniBiden} />
						<AmountBet>
							{farmBets.bidenWARPot.toLocaleString() + " $WAR"}
						</AmountBet>
						<AmountBet>
							{farmBets.bidenETHPot.toLocaleString() + " $ETH"}
						</AmountBet>
					</BetDisplay>
				</AllBets>

				<Separator />

				{allowance.toNumber() > 0 ?
					<>
						<Text>
							Bet $WAR
					</Text>
						<Top>
							<Text>
								{candidateInfo.name + " to Win"}
							</Text>
							<InputContainer>
								<Input disabled={pending ? true : false} type="number" min="0" value={warInput} onChange={e => setWARInput(e.target.value)} />
								WAR
						</InputContainer>
						</Top>
					</>
					: <Button size="xlg" onClick={() => handleApprove()}>Approve WAR</Button>
				}

				<Space />
				<Text>
					Bet $ETH
					</Text>
				<Top>
					<Text>
						{candidateInfo.name + " to Win"}
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
border: solid 2px white;
background-color: rgb(40,40,40);
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