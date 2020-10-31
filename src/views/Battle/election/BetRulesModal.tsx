import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import logo from '../../../assets/img/logo.png'


import Label from '../../../components/Label'
import Modalmd, { ModalProps } from '../../../components/Modal'
import ModalTitle from '../../../components/ModalTitle'
import Container from '../../../components/Container'


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
                1. Your bet comes from you stake in your WARchest and is locked in until the battle you bet on ends
          </ModalContent>
              <ModalContent>
                2. Your bet is inactive unless someone else takes your bet, meaning you can not win or lose  unless someone else bets on the other side.
          </ModalContent>
              <ModalContent>
                For example, if you bet $10,000 and someone on the other side bets $5,000. Your bet will only be live for $5,000.
          </ModalContent>
              <ModalContent>
                3. 10% of winnings go to the house, which is redistributed to $WAR token holders
          </ModalContent>
          <ModalContent>
                4. Bet WAR is taken from your wallet. Please unstake your WAR from the $WARchest if you would like to use it to bet.
          </ModalContent>
            </ModalSpacer>
          </StyledCardContent>
        </StyledCard>
      </StyledModal>
  )
}

const Title = styled.div`
  font-family: "Gilroy";
  color: #ffb700;
  font-size: 30px;
  margin: 10px 0;
  `

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
  height: 100%;
`

const StyledCard = styled.div`
width: 100%;
margin: auto;
min-width: 300px;
  border-radius: 8px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(255, 183, 0, 0.5);
  background-color: rgba(4,2,43,0.7);
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
  color: #ffffff;
  margin-bottom: 40px;
`

const StyledModal = styled.div`
  border-radius: 12px;
  position: relative;
  width: 600px;
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