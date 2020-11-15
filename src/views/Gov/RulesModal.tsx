import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import logo from '../../assets/img/logo.png'


import Label from '../../components/Label'
import Modalmd, { ModalProps } from '../../components/Modal'
import ModalTitle from '../../components/ModalTitle'

const BetRulesModal: React.FC<ModalProps> = ({ onDismiss }) => {
  return (
    <Modalmd>
      <Image src={logo} alt="logo"/>    
      <Space/>
      <ModalTitle text="Help suggest what we should battle over next!" />
      <ModalSpacer>
        <Label />
        <ModalContent>
          You must have $WAR staked to participate in community governance. The more $WAR you have staked, the more voting power you weild.
          </ModalContent>
        <ModalContent>
          You can make one suggestion every 24 hours.
          </ModalContent>
      </ModalSpacer>
    </Modalmd>
  )
}

const Space = styled.div`height: 30px;`

const Image = styled.img`
height: 80px;
width: 80px;
margin: 0 auto 10px auto;`

const ModalContent = styled.div`
font-family: Gilroy;
font-size: 18px;
font-weight: bold;
font-stretch: normal;
text-align: center;
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

export default BetRulesModal