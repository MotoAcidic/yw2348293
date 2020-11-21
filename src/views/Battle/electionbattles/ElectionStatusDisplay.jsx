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
		<a href="https://www.270towin.com/maps/consensus-2020-electoral-map-forecast"
			target="_blank"
			rel="noopener noreferrer">
			<MapEmbed src="https://www.270towin.com/map-images/consensus-2020-electoral-map-forecast.png" width="800" />
		</a>
	)
}

const MapEmbed = styled.img`
border: 3px solid black;
border-radius: 8px;`

const VotingBalance = styled.div`
display: flex;
flex-direction: column;
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
