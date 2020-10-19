import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import './swal.css'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

const FarmGraph = ({ farm1, farm2 }) => {

  const votes1 = parseInt(farm1.votes);
  const votes2 = parseInt(farm2.votes);

  const percent1 = 100 * (votes1 / (votes1 + votes2))
  console.log('v1, v2, %: ', votes1, votes2, percent1);
  return (
    <VotingBalance>
      <SubTitle>
        Voting Balance
      </SubTitle>
      <StyledContent>
        <CardIcon1>{farm1.icon}</CardIcon1>
        <BalanceBar>
          <div style={{ backgroundColor: '#fcae00', height: '100%', borderRadius: "0 0 2px 2px", width: percent1 }} />
        </BalanceBar>
        <CardIcon2>{farm2.icon}</CardIcon2>
      </StyledContent>
    </VotingBalance>
  )
}

const BalanceBar = styled.div`
width: calc(100% - 100px);
height: 20px;
background-color: #d20064;
border-radius: 2px;
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
margin: 20px auto 0 auto;
`

const CardIcon1 = styled.div`
	font-size: 40px;
	height: 40px;
  width: 40px;
  margin-
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-right: 10px;
`

const CardIcon2 = styled.div`
	font-size: 40px;
	height: 40px;
  width: 40px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-left: 10px;
`

const StyledContent = styled.div`
  display: flex;
	flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  align-items: center;
`

export default FarmGraph;