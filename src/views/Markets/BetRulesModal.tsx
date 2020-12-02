import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import logo from '../../assets/img/logo.png'


import Label from '../../components/Label'
import Modalmd, { ModalProps } from '../../components/Modal'
import ModalTitle from '../../components/ModalTitle'
import Container from '../../components/Container'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}


const BetRulesModal: React.FC<ModalProps> = ({ onDismiss }) => {
  return (
    <StyledModal>
      <StyledCard>
        <StyledCardContent>
          <Image src={logo} alt="logo" />
          <Title>
            Betting Rules
            </Title>
          <ModalSpacer>
            <Label />
            <ModalContent>
              1. Betting on YieldWars is winner takes all. Meaning if Vitalik wins then those who bet split the Alexandra betting pool equally per how much they bet, and vice versa.
          </ModalContent>
            <ModalContent>
              2. You can bet with $WAR or $ETH. If you bet $WAR then you can only win $WAR, and vice versa. Once you place a bet it is locked in and can not be changed. 
          </ModalContent>
            <ModalContent>
              3. You can only bet from your wallet and not from your WARchest. If you have funds in your WARchest you will need to unstake them. There are no longer fees for staking/unstaking from WARchest.
          </ModalContent>
            <ModalContent>
              4. 10% of winnings go to the house, which will be split between current $WAR stakers/betters and the $WAR Community DAO.
          </ModalContent>
            <ModalContent>
              5. Betting will end at 21:00 EST on Nov 22nd. This is when the chess match starts.
          </ModalContent>
          <ModalContent>
          6. The battle will be resolved using Botez’s Twitch livestream. In the event that multiple chess matches are played, then only the first match counts. In addition, the first match counts even if one or both players play with a handicap.
          </ModalContent>
          </ModalSpacer>
        </StyledCardContent>
      </StyledCard>
    </StyledModal>
  )
}

const Title = styled.div`
  font-family: "Gilroy";
  color: rgb(255,204,160);
  font-size: 30px;
  margin: 10px 0;
  `

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 30px;
  height: 100%;
`

const StyledCard = styled.div`
width: 100%;
margin: auto;
min-width: 300px;
  border-radius: 8px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px white;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  font-family: "Gilroy";
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: black;
  margin-bottom: 40px;
`

const StyledModal = !isMobile() ? styled.div`
  border-radius: 12px;
  position: relative;
  width: 600px;
` : styled.div`
border-radius: 12px;
position: relative;
width: 95vw;
`

const Image = styled.img`
height: 80px;
width: 80px;
margin: 0 auto 10px auto;`

const ModalContent = styled.div`
font-family: Gilroy;
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1.5;
letter-spacing: normal;
color: white;
margin: 10px;
text-align: left;
`

const ModalSpacer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
export default BetRulesModal