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

const { account, connect } = useWallet()


const Bet = ({ battles }) => {

	const increaseBet = () => {}

	return (
		<>
			{battles &&
				<>
					<Title>Step 3: Increase your bet with additional $WAR (optional)
        </Title>
					<VersusContainer>
						<Button size="lg" onClick={increaseBet} disabled={!account ? true : false}>Increase Your Bet</Button>
					</VersusContainer>
				</>
			}
			<Space />
		</>
	)
}
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

const VersusItem = styled.div`
display: flex;
flex-direction: column;`

const Options = !isMobile() ? styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-around;
` : styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;`

const Divider = !isMobile() ? styled.div`
background-color: rgba(256,256,256,0.3);
width: 2px;
` : styled.div`
height: 2px;
width: 80%;
margin: 20px auto 30px auto;
background-color: rgba(256,256,256,0.3);`


const RecDesc = styled.div`
font-family: "Gilroy";
  font-size: 20px;
	font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
	`;

const ButtonContainer = styled.div`
display: flex;
align-items: flex-start;
height: 31px;`

const VersusContainer = !isMobile() ? styled.div`
width: 460px;
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
background-color: #142C49;
padding: 60px 40px 60px 40px;
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
	padding-top: 20px;
	padding-bottom: 20px;
	border-radius: 8px;
	border: solid 2px rgba(255, 183, 0, 0.3);
	background-color: rgba(256,256,256,0.08);`

export default Bet