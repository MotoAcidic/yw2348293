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
import { placeElectionWARBet, placeElectionETHBet, getCurrentBets, getCurrentBalances } from '../../../yamUtils'
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
	const [isApproved, setIsApproved] = useState(false);
	// const [onApprove, setOnApprove] = useState(null);
	// const [allowance, setAllowance] = useState(0);

	const tokenContract = useMemo(() => {
		return getContract(ethereum, "0x5896e1c50e4d2d315052aad8383d7104c3891cd6")
	}, [ethereum, "0x5896e1c50e4d2d315052aad8383d7104c3891cd6"])

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


	useEffect(() => {
		const getBets = async () => {
			const bets = await getCurrentBets(yam);
			const balances = await getCurrentBalances(yam, account);
			setFarmBalances(balances);
			// console.log("gotbets", bets);
			setFarmBets(bets);
		}
		// console.log("got da yams???", yam)
		if (yam) {
			getBets();
		}

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
				const candidate = candidateInfo.name === "Biden" ? 1 : 2;
				// console.log("War Bet", candidate, warInput)
				setPending(true)
				placeElectionWARBet(yam, candidate, parseFloat(warInput), account).then((ret) => setPending(false))
			}
			if (ethInput) {
				const candidate = candidateInfo.name === "Biden" ? 1 : 2;
				// console.log("Eth Bet", candidate, ethInput)
				setPending(true)
				placeElectionETHBet(yam, candidate, parseFloat(ethInput), account).then((ret) => {
					setPending(false)
				})
			}
			if (!ethInput && !warInput) {
				Swal.fire("Place a bet for a candidate!");
			}
		}
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
				{/* <Pool3 /> */}
				{allowance.toNumber() > 0 ?
					<>
						<TitleText>
							Your Bets
					</TitleText>
						<YourBets>
							{!farmBalances.trumpWARBal > 0 && !farmBalances.trumpETHBal > 0 &&
							!farmBalances.bidenWARBal > 0 && !farmBalances.bidenETHBal > 0 ?
							<SmallText>none, place a bet!</SmallText> : null
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
								</Column> : null
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
								: null}
						</YourBets>
					</> :
					<Button size="xlg" onClick={() => handleApprove()}>Approve WAR</Button>
				}
				<Space />
				<Text>
					Bet $WAR
					</Text>
				<Bottom>
					<Bets>
						<CardIcon src={MiniTrump} />
						<AmountBet>
							{farmBets.trumpWARPot.toLocaleString() + " $WAR"}
						</AmountBet>
					</Bets>
					<Bets>
						<AmountBet>
							{farmBets.bidenWARPot.toLocaleString() + " $WAR"}
						</AmountBet>
						<CardIcon src={MiniBiden} />

					</Bets>
				</Bottom>
				{allowance.toNumber() > 0 &&

					<Top>
						<Text>
							{candidateInfo.name + " to Win"}
						</Text>
						<InputContainer>
							<Input disabled={pending ? true : false} type="number" min="0" value={warInput} onChange={e => setWARInput(e.target.value)} />
							WAR
						</InputContainer>
					</Top>}
				<Space />
				<Text>
					Bet $ETH
					</Text>
				<Bottom>
					<Bets>
						<CardIcon src={MiniTrump} />

						<AmountBet>
							{farmBets.trumpETHPot.toLocaleString() + " $ETH"}
						</AmountBet>
					</Bets>
					<Bets>
						<AmountBet>
							{farmBets.bidenETHPot.toLocaleString() + " $ETH"}
						</AmountBet>
						<CardIcon src={MiniBiden} />

					</Bets>
				</Bottom>
				{allowance.toNumber() > 0 &&

					<Top>
						<Text>
							{candidateInfo.name + " to Win"}
						</Text>
						<InputContainer>
							<Input disabled={pending ? true : false} type="number" min="0" value={ethInput} onChange={e => setETHInput(e.target.value)} />
							ETH
						</InputContainer>
					</Top>
				}
				{allowance.toNumber() > 0 &&
					<>
						{pending ?
							<BetPlaced>Your bet is pending. Check MetaMask for updates.</BetPlaced>
							:
							<Button size="xlg" onClick={() => placeBet()} disabled={!account || disabled ? true : false}>Place a Bet</Button>
						}
						<SmallText>
							Please unstake your $WAR from the $WARChest
					</SmallText>
					</>
				}
			</VersusContainer>
		</Container>
	)
}

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
justify-content: space-between;`

const Row = styled.div`
width: 100%;
display: flex;
justify-content: space-evenly;`

const Top = styled.div`
width: 100%;
display: flex;
flex-direction: row;
flex-wrap: nowrap;
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
color: #ffffff;
margin-bottom: 5px;
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
padding-right: 10px;
`

const Select = styled.select`
	width: 280px;
  height: 44px;
  font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  padding-left: 8px;
	font-size: 18px;
	border-radius: 8px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(255, 183, 0, 0.5);
	background-color: rgba(255, 255, 255, 0.2);
	padding-right: 20px;
  option {
		color: black;
		display: flex;
		position: absolute;
		top: 100%;
		font-size: 18px;
    white-space: pre;
		min-height: 20px;
		border: solid 1px rgba(255, 183, 0, 0.5);
		background-color: rgba(255, 255, 255, 0.2) !important;
		padding: 2px;
  }
`;



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