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

import {
	placeElectionWARBet,
	getCurrentBets,
} from '../../../yamUtils'
import { isConstructorDeclaration } from 'typescript';

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
	const [farm, setFarm] = useState(battle.farm1.id);
	const [war, setWar] = useState(0);
	const [disabled, setDisabled] = useState(false)
	const [farmBets, setFarmBets] = useState({ trumpETHPot: 0, bidenETHPot: 0, trumpWARPot: 0, bidenWARPot: 0 });
	// const [presentRulesModal] = useModal(<RulesModal />);

	const yam = useYam()
	const { account, connect } = useWallet()

	const handleChange = e => {
		setFarm(e.value);
	}

	const handleInput = e => {
		setWar(e.value);
	}

	useEffect(() => {
		const getBets = async () => {
			const bets = await getCurrentBets(yam);
			console.log("gotbets", bets);
			setFarmBets(bets);
		}
		console.log("got da yams???", yam)
		if (yam) {
			console.log("got da yams");
			getBets();
		}

	}, [yam])

	const placeBet = () => {
		
	}

	return (
		<Container size="sm">
			<StyledModal>
				{/* <CardContent> */}
				<VersusContainer>
					<Text>
						$WAR Bets
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
						<Select onChange={handleChange}>
							<option value={battle.farm2.id}>
								{battle.farm1.name + " to Win"}
							</option>
							<option value={battle.farm1.id}>
								{battle.farm2.name + " to Win"}
							</option>
						</Select>
						<InputContainer>
							<Input value={war} onChange={handleInput} />
					WAR
					</InputContainer>
					</Top>
					<Space />
					<Text>
						$ETH Bets
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
						<Select onChange={handleChange}>
							<option value={battle.farm2.id}>
								{battle.farm1.name + " to Win"}
							</option>
							<option value={battle.farm1.id}>
								{battle.farm2.name + " to Win"}
							</option>
						</Select>
						<InputContainer>
							<Input value={war} onChange={handleInput} />
					ETH
					</InputContainer>
					</Top>

					<Button size="xlg" onClick={placeBet()} disabled={!account || disabled ? true : false}>Place a Bet</Button>
				</VersusContainer>
				{/* </CardContent> */}
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

const Top = styled.div`
width: 100%;
display: flex;
flex-direction: row;
flex-wrap: nowrap;
margin-bottom: 20px;
justify-content: space-between;`

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