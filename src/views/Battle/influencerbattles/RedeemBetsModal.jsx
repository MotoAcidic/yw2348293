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
import axios from 'axios';

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

const Bet = () => {
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

	// const [contender1, setContender1] = useState(null);
	// const [contender2, setContender2] = useState(null);
	// const [battle1Input, setBattle1Input] = useState(0);
	// const [battle2Input, setBattle2Input] = useState(0);
	// const [disabled, setDisabled] = useState(false)
	const [battle, setBattle] = useState(null)
	const [farmBets, setFarmBets] = useState({ pot1: 0, pot2: 0, pot3: 0, pot4: 0 });
	const [farmBalances, setFarmBalances] = useState({ bal1: 0, bal2: 0, bal3: 0, bal4: 0 });
	// const stakedBalance = useStakedBalance(contract)
	// const { onUnstake } = useUnstake(contract)

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
		if (yam) {
			axios.get(`${getServerURI()}/api/prev-pers-battle`).then(res => {
				console.log("yesterdaybattle", res.data);
				setBattle(res.data)
			})
		}
	}, [yam, account])

	if (!battle || !battle.length) {
		return null
	}

	let battle1 = battle[0]
	let winner1 = battle1.pool1.totalVotes > battle1.pool2.totalVotes ? battle1.pool1 : battle1.pool2
	let correctVote1 = winner1.votes.find(vote => vote.address === account)

	return (
		<Container size="sm">
			<StyledModal>
				<VersusContainer>
					<SubTitle>
						{correctVote1 ? "💰 YOU WON! 💰" : "😞 YOU LOST! 😞"}
					</SubTitle>
					<Text>
						The Winner is {winner1.name}!!!
					</Text>
					<Space />
					<Separator />
					<Text>
						Your Claimable Bets
					</Text>
					<YourBets>
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

const SubTitle = !isMobile() ? styled.div`
font-family: "GilroyMedium";
margin-bottom: 5px;
font-size: 20px;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
` : styled.div`
font-family: "GilroyMedium";
margin-bottom: 2px;
font-size: 20px;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
	text-align: left;
`

const Column = styled.div`
display: flex;
flex-direction: column;
align-items: center;`

const BetContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
`

const StyledText1 = styled.div`
	height: 40px;
  width: 40px;
	border-radius: 50%;
  display: flex;
  align-items: center;
	justify-content: center;
	font-family: "Edo";
	font-weight: normal;
background-color: #AB1003;
font-size: 40px;
border-radius: 50%;
color: white;
`
const StyledText2 = styled.div`
	height: 40px;
  width: 40px;
color: white;
font-size: 40px;
border-radius: 50%;
  display: flex;
  align-items: center;
	justify-content: center;
	font-family: "Edo";
	font-weight: normal;
	background-color: #15437F;
  border-radius: 50%;
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