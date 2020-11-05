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

const FarmGraph = ({ votes1, votes2 }) => {
  const percent1 = 100 * (votes1 / (votes1 + votes2))
  console.log('v1, v2, %: ', votes1, votes2, percent1);
  return (
    <VotingBalance>
      {/* <SubTitle>
        Voting Balance
      </SubTitle> */}
      <StyledContent>
      <StyledText1>
								YES
							</StyledText1>

        <BalanceBar>
          <div style={{ backgroundColor: '#AB1200', height: '100%', borderRadius: "8px 0 0 8px", width: percent1 + '%', borderRight: "3px solid black" }} />
        </BalanceBar>
        <StyledText2>
								NO
							</StyledText2>
      </StyledContent>
      <SmallText>Volume: ${(votes1 + votes2).toLocaleString(undefined, { maximumFractionDigits: 2 })}💰</SmallText>
    </VotingBalance>
  )
}

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
`
const StyledText2 = styled.div`
	height: 40px;
  width: 40px;
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

const BalanceBar = styled.div`
width: 100%;
height: 22px;
margin: 0 25px;
background-color: #0C438C;
border: 3px solid black;
border-radius: 8px;
`

const VotingBalance = styled.div`
display: flex;
flex-direction: column;
width: 50%;
margin: 0 auto 15px auto;
`


const StyledContent = styled.div`
  display: flex;
	flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  align-items: center;
`

export default FarmGraph;