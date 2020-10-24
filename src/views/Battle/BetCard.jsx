import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import { useWallet } from "use-wallet";
import Cookie from 'universal-cookie'
import './swal.css'

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



const Bet = ({ battle, bet, setBet }) => {
	const getFarm = () => {
		if (!bet.farm) return battle.farm1.id;
		return battle.farm2.id;
	}
	const [farm, setFarm] = useState(getFarm());
	const [war, setWar] = useState(bet.war);

	const { account, connect } = useWallet()

	// const otherFarm = battle.find(farm => farm.id !== bet.farm);

	console.log("bet bet bet?", battle);

	const handleChange = e => {
		setFarm(e.value);
	}

	const handleInput = e => {
		setWar(e.value);
	}

	return (
		<>
			<Title>Step 3: Increase your bet with additional $WAR (optional)
        </Title>
			<VersusContainer>
				<Top>
					<Select onChange={handleChange}>
						<option value={battle.farm1.id}>
							{battle.farm1.name + " to Win"}
						</option>
						<option value={battle.farm2.id}>
							{battle.farm2.name + " to Win"}
						</option>
					</Select>
					<InputContainer>
						<Input value={war} onChange={handleInput} />
					WAR
					</InputContainer>
				</Top>
				<Button size="xlg" onClick={setBet(farm, war)} disabled={!account ? true : false}>Increase Your Bet</Button>
			</VersusContainer>
			<Space />
		</>
	)
}

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
}
`

const InputContainer = styled.div`
width: 170px;
padding-top: 2px;
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

const Title = styled.div`
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 80vw;
  margin-bottom: 20px;
`;

const Space = styled.div`
height: 80px;`


const VersusContainer = !isMobile() ? styled.div`
width: 480px;
display: flex;
flex-direction: column;
align-items: center;
font-size: 30px;
margin: 0 auto 20px auto;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(256,256,256,0.08);
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