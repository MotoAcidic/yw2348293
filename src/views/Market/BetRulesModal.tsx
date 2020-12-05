import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import logo from '../../assets/img/newlogo.png'


import Label from '../../components/Label'
import Modalmd, { ModalProps } from '../../components/Modal'
import ModalTitle from '../../components/ModalTitle'

const BetRulesModal: React.FC<ModalProps> = ({ onDismiss }) => {
  return (
    <Modalmd>
      <Image src={logo} alt="logo" />
      <ModalTitle text="Betting Rules" />
      <ModalSpacer>
        <Label />
        <ModalContent>
          1. Your bet comes from your connected Web3 Wallet and is locked in until the battle you bet on ends
          </ModalContent>
        <ModalContent>
          2. Bets are winner-takes all. If you bet on the winning side, your reward will be proportional to the percent of your bet pool you contributed to.
        <ModalContent>
            For example, if you bet $100 of a $1,000 pool, and win against a $10,000 pool, your rewards will be approximately $1,000.
          </ModalContent>
        </ModalContent>
        {/* <ModalContent>
          3. 10% of winnings go to the house, which is redistributed to $WAR token holders
          </ModalContent> */}
      </ModalSpacer>
    </Modalmd>
  )
}

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
color: #003677;
margin: 10px;
}`

const ModalSpacer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const ModalSpacerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing[4]}px;
`

const ModalSpacerActions = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: ${props => props.theme.spacing[4]}px;
`
const StyledInputWrapper = styled.div`
  align-items: center;
  background-color: ${props => props.theme.color.grey[200]};
  border-radius: ${props => props.theme.borderRadius}px;
  box-shadow: 4px 4px 8px ${props => props.theme.color.grey[300]},
    inset -6px -6px 12px ${props => props.theme.color.grey[100]};
  display: flex;
  width: 300px;
  height: 50px;
  text-align: left;
  padding: 0 ${props => props.theme.spacing[1]}px;
`
const StyledtextField = styled.div`
  align-items: center;
  background-color: ${props => props.theme.color.grey[200]};
  border-radius: ${props => props.theme.borderRadius}px;
  box-shadow: inset 4px 4px 8px ${props => props.theme.color.grey[300]},
    inset -6px -6px 12px ${props => props.theme.color.grey[100]};
  display: flex;
  width: 300px;
  height: 100px;
  text-align: left;
  padding: 0 ${props => props.theme.spacing[2]}px;
`

const StyledInput = styled.textarea`
  background: none;
  border: 0;
  color: ${props => props.theme.color.grey[600]};
  font-size: 18px;
  flex: 1;
  height: 100px;
  margin: 2px;
  padding: 0;
  outline: none;
`

const Styledsubmit = styled.input`
  cursor: pointer;
  text-align: center;
  background: none;
  border: 0;
  color: ${props => props.theme.color.grey[600]};
  font-size: 18px;
  flex: 1;
  height: 30px;
  margin: 0;
  padding: 0;
  outline: none;
`

export default BetRulesModal