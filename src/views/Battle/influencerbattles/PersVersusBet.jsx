import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import { useWallet } from "use-wallet";

import useYam from '../../../hooks/useYam'
import './swal.css'
import { harvest, getBattleAPR } from '../../../yamUtils'
import UnstakeModal from './UnstakeModal'
import useFarm from '../../../hooks/useFarm'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useUnstake from '../../../hooks/useUnstake'
import { placeETHBet, getPots, getUserBet } from '../../../yamUtils'
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

const Bet = ({ battle1, id, yesterday }) => {
	const yam = useYam()
	const { account, connect } = useWallet()
	// const {
	// 	contract,
	// 	depositToken,
	// 	depositTokenAddress,
	// 	earnToken,
	// 	name,
	// 	icon,
	// } = useFarm('BATTLEPOOL') || {
	// 	contract: null,
	// 	depositToken: '',
	// 	depositTokenAddress: '',
	// 	earnToken: '',
	// 	name: '',
	// 	icon: ''
	// }

	const [contender1, setContender1] = useState(null);
	const [battle1Input, setBattle1Input] = useState(0);
	const [disabled, setDisabled] = useState(false)
	const [farmBets, setFarmBets] = useState({ pot1: 0, pot2: 0 });
	const [farmBalances, setFarmBalances] = useState({ bal1: 0, bal2: 0 });
	// const stakedBalance = useStakedBalance(contract)
	// const { onUnstake } = useUnstake(contract)

	const handleBattle1Change = e => {
		setContender1(e.target.value);
	}

	// const [onPresentUnstake] = useModal(
	// 	<UnstakeModal
	// 		max={stakedBalance}
	// 		onConfirm={onUnstake}
	// 		tokenName={"WAR"}
	// 	/>
	// )

	// const claimAndUnstake = () => {
	// 	console.log(contract);
	// 	console.log(account);
	// 	harvest(contract, account);
	// 	onPresentUnstake()
	// }

	useEffect(() => {
		const getBets = async () => {
			let balances = await getUserBet(yam, id, account);
			if (balances) {
				if (balances.choiceId === battle1.pers1.handle)
					setFarmBalances({ bal1: balances.value, bal2: 0 });
				else
					setFarmBalances({ bal1: 0, bal2: balances.value });
			}
			let bets = await getPots(yam, id);
			setFarmBets({ pot1: bets[0].value, pot2: bets[1].value });

			// createNewContract(yam, account);
			// getPots(yam, "newId");
			// const bets = await getPots(yam);
			// const balances = await getCurrentBet(yam, account);
			// setFarmBalances(balances);
			// // console.log("gotbets", bets);
			// setFarmBets(bets);
		}
		console.log("got da yams???", yam)
		if (!yam.defaultProvider && account) {
			console.log("got da yams");
			getBets();
		}

	}, [yam, account])

	const placeBet = () => {
		if (yam && account) {
			// if (stakedBalance) {
			// 	claimAndUnstake()
			// 	return
			// }
			if (battle1Input && contender1) {
				const candidate = contender1 === battle1.pers1.handle ? 0 : 1;
				console.log(candidate);
				console.log(battle1.pers1);
				console.log(contender1)
				placeETHBet(yam, id, candidate, battle1Input, account)
				// placeElectionWARBet(yam, candidate, warInput, account);
			}
			else {
				Swal.fire("Place a bet for a candidate!");
			}
		}
	}

	return (
		<Container>
			<VersusContainer>
				<Text>
					Your Bets
					</Text>
				<YourBets>
					{!farmBalances.bal1 > 0 && !farmBalances.bal2 > 0 ?
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
				</YourBets>
				<Space />
				<Separator />
				<Text>
					Current Bets
					</Text>
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
				<Space />
				<Separator />
				<Text>
					Bet $ETH1
					</Text>
				<Top>
					<Select onChange={handleBattle1Change}>
						<option value={null}>
							{"select victor"}
						</option>
						<option value={battle1.pers1.handle}>
							{battle1.pers1.handle + " to Win"}
						</option>
						<option value={battle1.pers2.handle}>
							{battle1.pers2.handle + " to Win"}
						</option>
					</Select>
					<InputContainer>
						<Input type="number" value={battle1Input} onChange={e => setBattle1Input(e.target.value)} />
							ETH
					</InputContainer>
				</Top>
				<Button size="xlg" onClick={() => placeBet()} disabled={!account || disabled ? true : false}>Place a Bet</Button>
			</VersusContainer>
			{yesterday}
		</Container>
	)
}

const Container = styled.div`
width: 100%;
display:flex;
flex-direction: column;
width: 25%;
`

const Column = styled.div`
display: flex;
flex-direction: column;
align-items: center;`

const BetContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
width: 80%;
justify-content: space-evenly;
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
  margin-bottom: 10px;
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
margin-bottom: 10px;
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

const Input = styled.input`
font-family: "SF Mono Semibold";
font-size: 16px;
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
width: 30%;
border-radius: 8px;
box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
border: solid 1px rgba(255, 183, 0, 0.5);
background-color: rgba(255, 255, 255, 0.2);
font-family: "SF Mono Semibold";
font-size: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
letter-spacing: normal;
color: #ffb700;
text-align: right;
display: flex;
justify-content: flex-end;
align-items: center;
height: 30px;
padding-right: 10px;
`

const Select = styled.select`
	width: 60%;
  height: 30px;
  font-family: "Gilroy";
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  padding-left: 8px;
	font-size: 16px;
	border-radius: 8px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(255, 183, 0, 0.5);
	background-color: rgba(255, 255, 255, 0.2);
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
justify-content: space-evenly;
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
width: calc(100%-40px);
min-height: 45vh;
margin-bottom: 20px;
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