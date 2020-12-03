import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import './swal.css'
import MiniVitalik from "../../assets/img/vitalikicon.jpg";
import MiniAlexandra from "../../assets/img/alexandraicon.png";

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

const FarmGraph = ({ bet, votes1, votes2 }) => {
  const percent1 = 100 * (votes1 / (votes1 + votes2))
  console.log('v1, v2, %: ', votes1, votes2, percent1);
  return (
    <VotingBalance>
      {/* <SubTitle>
        Voting Balance
      </SubTitle> */}
      <StyledContent>
        {/* <CardIcon src={MiniVitalik} /> */}
        <Teams>
          <Team>
            {bet.pool1.name}
          </Team>
          <Team>
            {bet.pool2.name}
          </Team>
        </Teams>
        <BalanceBar>
          <div style={{ backgroundColor: 'rgb(154,220,180)', height: '100%', borderRadius: "2px 0 0 2px", width: percent1 + '%', borderRight: "2px solid white" }} />
        </BalanceBar>
        {/* <CardIcon src={MiniAlexandra} /> */}

      </StyledContent>
      {/* <SmallText>Volume: ${(votes1 + votes2).toLocaleString(undefined, { maximumFractionDigits: 2 })}💰</SmallText> */}
    </VotingBalance>
  )
}

const Team = styled.div`
font-family: "SF Mono Semibold";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
display: flex;
font-size: 12px;
align-items: flex-end;
`

const Teams = styled.div`
display: flex;
width: 90%;
margin: 0 auto 5px auto;
justify-content: space-between;`

const SmallText = styled.div`
font-family: "Gilroy";
margin: -5px auto 0px;
font-size: 14px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
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
  background-color: white;
  filter: brightness(110%) contrast(110%) grayscale(60%);
`

const BalanceBar = styled.div`
// width: calc(100% - 110px);
width: 100%;
margin: 0 auto;
height: 10px;
background-color: rgb(154,180,220);
border: 1px solid white;
border-radius: 3px;
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
width: 90%;
    height: 100%;
    margin: -15px auto 0px auto;
    justify-content: center;
    padding-top: 7px;
`


const StyledContent = styled.div`
  display: flex;
	flex-direction: column;
  width: 100%;
`

export default FarmGraph;