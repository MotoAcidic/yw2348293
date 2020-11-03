import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import './swal.css'
import MiniBiden from "../../../assets/img/biden@2x.png";
import MiniTrump from "../../../assets/img/trump@2x.png";

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

const ElectionStatusDisplay = () => {
	return (
		<VotingBalance>
			<div align="center">
				<a href="https://www.270towin.com/maps/consensus-2020-electoral-map-forecast">
					<img src="https://www.270towin.com/map-images/consensus-2020-electoral-map-forecast.png" width="800" />
				</a>
				<br />
				<small>
					<img src="https://www.270towin.com/uploads/3rd_party_270_30px.png" alt="" />
					Click the map to create your own at
					<a href="https://www.270towin.com/maps/consensus-2020-electoral-map-forecast">
						270toWin.com
					</a>
				</small>
			</div>
    </VotingBalance>
  )
}


const SmallText = styled.div`
font-family: "Gilroy";
font-size: 20px;
font-weight: 100;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const CardIcon = styled.img`
	height: 50px;
  width: 50px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 15px;
`

const BalanceBar = styled.div`
width: calc(100% - 110px);
height: 22px;
background-color: #0C438C;
border: 3px solid black;
border-radius: 8px;
`

const SubTitle = styled.div`
font-family: "Gilroy";
margin-bottom: 5px;
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  
`

const VotingBalance = styled.div`
display: flex;
flex-direction: column;
width: 89%;
margin: 0 auto 15px auto;
`


const StyledContent = styled.div`
  display: flex;
	flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  align-items: center;
`

export default ElectionStatusDisplay;