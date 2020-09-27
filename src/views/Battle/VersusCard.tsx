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
import sushi from '../../assets/img/sushi.png'
import yamimg from '../../assets/img/yam.png'

import { getAPR, getPoolEndTime } from '../../yamUtils'
import useYam from '../../hooks/useYam'


import Landscape from '../../assets/img/landscapebig.png'
import Sky from '../../assets/img/skybig.png'
import TallSky from '../../assets/img/tallsky.png'
import useFarms from '../../hooks/useFarms'
import useFarm from '../../hooks/useFarm'
import { Farm } from '../../contexts/Farms'


function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

interface VersusProps {
	farm1: Farm,
	farm2: Farm,
}
const Versus: React.FC<VersusProps> = ({ farm1, farm2 }) => {
	let [farms] = useFarms()
	const yam = useYam()
	const [apr1, setAPR1] = useState(0)
	const [apr2, setAPR2] = useState(0)


	const aprVal = useCallback(async () => {
		const apr1 = farm1.id !== `CHADS` ? await getAPR(farm1, yam) : 0;
		const apr2 = farm2.id !== `CHADS` ? await getAPR(farm2, yam) : 0;
		setAPR1(apr1)
		setAPR2(apr2)
	}, [farm1, setAPR1])

	useEffect(() => {
		if (farm1.contract && !apr1 && yam) {
			aprVal()
		}
	}, [farm1, yam])


	return (
		<VersusItem>
			<VersusCard>
				<StyledContent>
					<CardIcon>{farm1.icon}</CardIcon>
					<StyledTitle>{farm1.name}</StyledTitle>
					<Button
						disabled={true}
						text={`Select`}
						size='lg'
					/>
					<StyledDetails><StyledDetail>{apr1.toFixed(2)}% Apr</StyledDetail></StyledDetails>
				</StyledContent>
			</VersusCard>
                    VS
			<VersusCard>
				<StyledContent>
					<CardIcon>{farm2.icon}</CardIcon>
					<StyledTitle>{farm2.name}</StyledTitle>
					<Button
						disabled={true}
						text={`Select`}
						size='lg'
					/>
					<StyledDetails><StyledDetail>{apr2.toFixed(2)}% Apr</StyledDetail></StyledDetails>
				</StyledContent>
			</VersusCard>
		</VersusItem>
	)
}


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
width: 240px;
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