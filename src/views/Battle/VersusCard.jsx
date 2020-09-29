import React, { useCallback, useEffect, useState } from 'react'
import {
	Route,
	Switch,
	useRouteMatch,
} from 'react-router-dom'
import styled from 'styled-components'

import Button from '../../components/Button'
import Card from '../../components/Card'
import CardContent from '../../components/CardContent'
import CardIcon from '../../components/CardIcon'
import Page from '../../components/Page'
import checkedIcon from '../../assets/img/checked.png'
import uncheckedIcon from '../../assets/img/unchecked.png'

import { getAPR, getPoolEndTime } from '../../yamUtils'
import useYam from '../../hooks/useYam'
import { useWallet } from 'use-wallet'

import Landscape from '../../assets/img/landscapebig.png'
import Sky from '../../assets/img/skybig.png'
import TallSky from '../../assets/img/tallsky.png'
import useFarms from '../../hooks/useFarms'
import useFarm from '../../hooks/useFarm'
import { Farm } from '../../contexts/Farms'
import Cookie from 'universal-cookie'
import axios from 'axios'

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

let cookie = new Cookie()


const Versus = ({ farm1, farm2, cast, r }) => {
	let [farms] = useFarms()
	const yam = useYam()
	const [checked, setChecked] = useState(cookie.get(r._id))
	const { account, connect } = useWallet()
	console.log(cookie.get(r._id));
	const pick = (g) => {
		cookie.set(r._id, g)
		setChecked(g)
	}

	const castVote = async () => {
		let pool
		if (!checked)
			return
		if (checked === 1)
			pool = farm1
		if (checked === 2)
			pool = farm2
		const signature = await yam.web3.eth.sign({
			address: account,
			vote: pool.id,
			_id: r._id
		}, account).catch(err => console.log(err))
		console.log(signature);
		axios.post('http://localhost:5000/api/vote', {
			address: account,
			vote: pool.id,
			_id: r._id,
			sig: signature
		})

	}

	useEffect(() => {
		if (cast) {
			castVote()
		}
	}, [cast])

	return (
		<VersusItem>
			<VersusCard>
				<StyledContent>
					<CardIcon>{farm1.icon}</CardIcon>
					<StyledTitle>{farm1.name}</StyledTitle>
					{checked === 1 ? (
						<ButtonContainer onClick={() => pick(1)}>
							<img src={checkedIcon} width="40%"/>
						</ButtonContainer>
					) : (
							<ButtonContainer onClick={() => pick(1)}>
								<img src={uncheckedIcon} width="40%"/>
							</ButtonContainer>
						)}
				</StyledContent>
			</VersusCard>
                    VS
			<VersusCard>
				<StyledContent>
					<CardIcon>{farm2.icon}</CardIcon>
					<StyledTitle>{farm2.name}</StyledTitle>
					{checked === 2 ? (
						<ButtonContainer onClick={() => pick(2)}>
							<img src={checkedIcon} width="40%"/>
						</ButtonContainer>
					) : (
							<ButtonContainer onClick={() => pick(2)}>
								<img src={uncheckedIcon} width="40%" />
							</ButtonContainer>
						)}
				</StyledContent>
			</VersusCard>
		</VersusItem>
	)
}

const ButtonContainer = styled.div`

`


const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`

const StyledDetails = styled.div`
  text-align: center;
`

const StyledDetail = styled.div`
font-family: Alegreya;
font-size: 20px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const StyledTitle = styled.h4`
margin: 0;
font-family: Alegreya;
font-size: 25px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  padding: 0;
`

const VersusCard = styled.div`
width: 220px;
  height: 247px;
  border-radius: 8px;
  border: solid 2px #0095f0;
  background-color: #003677
`

const VersusItem = styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
font-size: 30px;
`

export default Versus