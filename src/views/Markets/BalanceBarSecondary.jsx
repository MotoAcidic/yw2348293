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
      {/* <CardIcon src={MiniVitalik} /> */}
      {/* <Teams>
          <Team>
            {bet.pool1.name}
          </Team>
          <Team>
            {bet.pool2.name}
          </Team>
        </Teams> */}
      <BalanceBar>
        <SmallText>
          <Volume>

            💰${(votes1 + votes2).toLocaleString(undefined, { maximumFractionDigits: 2 })}💰
          </Volume>
        </SmallText>
        <div style={{ backgroundColor: 'rgb(154,220,180)', height: '100%', borderRadius: "2px 0 0 2px", width: percent1 + '%', borderRight: "2px solid black" }} />
      </BalanceBar>
      {/* <CardIcon src={MiniAlexandra} /> */}

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

const Volume = styled.div`
position: relative;
left: -50%;
font-family: "SF Mono Semibold";
font-size: 12px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: black;
border-radius: 2px;
padding: 1px 2px;
background: rgba(256,256,256,0.3);
`

const SmallText = styled.div`
left: 50%;
position: absolute;
`

const CardIcon = styled.img`
	height: 50px;
  width: 50px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 15px;
  background-color: black;
  filter: brightness(110%) contrast(110%) grayscale(60%);
`

const BalanceBar = styled.div`
// width: calc(100% - 110px);
width: 100%;
margin: 0 auto;
height: 14px;
background-color: rgb(154,180,220);
border: 1px solid black;
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
position: absolute;
z-index: 20004;
margin-left: 25%;
top: 12px;
width: 50%;
`

export default FarmGraph;