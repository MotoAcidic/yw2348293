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
import { placeElectionWARBet, getCurrentBets, getCurrentBalances } from '../../../yamUtils'
import Swal from 'sweetalert2';

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

const Bet = ({ battle, candidateInfo }) => {
	const yam = useYam()
	const { account, connect } = useWallet()
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
	console.log(useFarm('BATTLEPOOL'));
	const [ethContender, setETHContender] = useState(battle.farm1.id);
	const [warContender, setWARContender] = useState(battle.farm1.id);
	const [ethInput, setETHInput] = useState(0);
	const [warInput, setWARInput] = useState(0);
	const [disabled, setDisabled] = useState(false)
	const [farmBets, setFarmBets] = useState({ trumpETHPot: 0, bidenETHPot: 0, trumpWARPot: 0, bidenWARPot: 0 });
	const [farmBalances, setFarmBalances] = useState({ trumpETHBal: 0, bidenETHBal: 0, trumpWARBal: 0, bidenWARBal: 0 });
	const stakedBalance = useStakedBalance(contract)
	const { onUnstake } = useUnstake(contract)




	const handleETHChange = e => {
		setETHContender(e.target.value);
	}

	const handleWARChange = e => {
		setWARContender(e.target.value);
	}

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
			console.log("gotbets", bets);
			setFarmBets(bets);
		}
		console.log("got da yams???", yam)
		if (yam) {
			console.log("got da yams");
			getBets();
		}

	}, [yam, account])

	const placeBet = () => {
		if (yam && account) {
			if (stakedBalance) {
				claimAndUnstake()
				return
			}
			if (ethInput) {
				const candidate = ethContender === "Biden to Win" ? 1 : 2;
				placeElectionWARBet(yam, candidate, warInput, account);
			} else if (warInput) {
				const candidate = warContender === "Biden to Win" ? 1 : 2;
				placeElectionWARBet(yam, candidate, ethInput, account);
			} else {
				Swal.fire("Place a bet for a candidate!");
			}
		}
	}

	return (
		<Container size="sm">
			<StyledModal>
				<VersusContainer>
					<Text>
						Your Bets
					</Text>
					<Row style={{ marginBottom: '10px'}}>
						<CardIcon src={MiniTrump} />
						<CardIcon src={MiniBiden} />
					</Row>
					<Row>
						<Bets>
							<AmountBet>
								{'$WAR' + farmBalances.trumpWARBal.toLocaleString()}
							</AmountBet>
						</Bets>
						<Bets>
							<AmountBet>
								{'$WAR' + farmBalances.bidenWARBal.toLocaleString()}
							</AmountBet>
						</Bets>
					</Row>
					<Row>
						<Bets>
							<AmountBet>
								{'$ETH' + farmBalances.trumpETHBal.toLocaleString()}
							</AmountBet>
						</Bets>
						<Bets>
							<AmountBet>
								{'$ETH' + farmBalances.bidenETHBal.toLocaleString()}
							</AmountBet>

						</Bets>
					</Row>
					<Space />
					<Text>
						Bet $WAR
					</Text>
					<Bottom>
						<Bets>
							<CardIcon src={MiniTrump} />
							<AmountBet>
								{'$' + farmBets.trumpWARPot.toLocaleString()}
							</AmountBet>
						</Bets>
						<Bets>
							<AmountBet>
								{'$' + farmBets.bidenWARPot.toLocaleString()}
							</AmountBet>
							<CardIcon src={MiniBiden} />

						</Bets>
					</Bottom>
					<Top>
						<Select disabled onChange={handleWARChange}>
							<option value={candidateInfo.id}>
								{candidateInfo.name + " to Win"}
							</option>
							{/* <option value={battle.farm1.id}>
								{battle.farm2.name + " to Win"}
							</option> */}
						</Select>
						<InputContainer>
							<Input type="number" value={warInput} onChange={e => setWARInput(e.target.value)} />
							WAR
						</InputContainer>
					</Top>
					<Space />
					<Text>
						Bet $ETH
					</Text>
					<Bottom>
						<Bets>
							<CardIcon src={MiniTrump} />

							<AmountBet>
								{'$' + farmBets.trumpETHPot.toLocaleString()}
							</AmountBet>
						</Bets>
						<Bets>
							<AmountBet>
								{'$' + farmBets.bidenWARPot.toLocaleString()}
							</AmountBet>
							<CardIcon src={MiniBiden} />

						</Bets>
					</Bottom>
					<Top>
						<Select disabled onChange={handleETHChange}>
							<option value={candidateInfo.id}>
								{candidateInfo.name + " to Win"}
							</option>
							{/* <option value={battle.farm1.id}>
								{battle.farm2.name + " to Win"}
							</option> */}
						</Select>
						<InputContainer>
							<Input type="number" value={ethInput} onChange={e => setETHInput(e.target.value)} />
					ETH
					</InputContainer>
					</Top>
					<Button size="xlg" onClick={() => placeBet()} disabled={!account || disabled ? true : false}>Place a Bet</Button>
				</VersusContainer>
			</StyledModal>
		</Container>
	)
}

const Space = styled.div`
height: 20px;`

const StyledModal = styled.div`
border-radius: 8px;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 100000;
`

const AmountBet = styled.div`
font-family: Gilroy;
font-size: 18px;
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