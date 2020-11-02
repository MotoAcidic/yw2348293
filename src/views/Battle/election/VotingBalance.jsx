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
        <CardIcon src={MiniTrump} />

        <BalanceBar>
          <div style={{ backgroundColor: '#AB1200', height: '100%', borderRadius: "8px 0 0 8px", width: percent1 + '%', borderRight: "3px solid black" }} />
        </BalanceBar>
        <CardIcon src={MiniBiden} />

      </StyledContent>
      <SmallText>Volume: ${(votes1 + votes2).toLocaleString(undefined, { maximumFractionDigits: 2 })}💰</SmallText>
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

export default FarmGraph;