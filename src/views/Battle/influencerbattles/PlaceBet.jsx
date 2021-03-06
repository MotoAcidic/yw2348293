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

const Bet = ({ battle1, contender, id}) => {
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

	const [battle1Input, setBattle1Input] = useState(0);
	const [disabled, setDisabled] = useState(false)
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

	const placeBet = () => {
		if (yam && account) {
			// if (stakedBalance) {
			// 	claimAndUnstake()
			// 	return
			// }
			if (battle1Input) {
				const candidate = contender === battle1.pers1.handle ? 0 : 1;
				console.log(candidate);
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
					Bet $ETH
				</Text>
				<Top>
					{/* <Select onChange={handleBattle1Change}>
						<option value={null}>
							{"select victor"}
						</option>
						<option value={battle1.pers1.handle}>
							{battle1.pers1.handle + " to Win"}
						</option>
						<option value={battle1.pers2.handle}>
							{battle1.pers2.handle + " to Win"}
						</option>
					</Select> */}
					<Text>
						{contender + " to Win"}
					</Text>
					<InputContainer>
						<Input type="number" value={battle1Input} onChange={e => setBattle1Input(e.target.value)} />
							ETH
					</InputContainer>
				</Top>
				<Button size="xlg" onClick={() => placeBet()} disabled={!account || disabled ? true : false}>Place a Bet</Button>
			</VersusContainer>
		</Container>
	)
}

const Container = !isMobile() ? styled.div`
display:flex;
flex-direction: column;
width: 30%;
z-index: 10000;
` : styled.div`
display:flex;
flex-direction: column;
width: 95vw;
z-index: 10000;
`


const Top = !isMobile () ? styled.div`
width: 100%;
display: flex;
flex-direction: row;
flex-wrap: nowrap;
margin-bottom: 20px;
justify-content: space-between;`
: styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
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

const InputContainer = !isMobile() ? styled.div`
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
` : styled.div`
width: 176px;
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
padding-left: 10px;`

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
margin-bottom: 20px;
` : styled.div`
max-width: 100%;
display: flex;
flex-direction: column;
align-items: center;
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
	background-color: rgba(4,2,43,1);`

export default Bet