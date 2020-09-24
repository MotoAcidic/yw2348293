import React from 'react'
import styled from 'styled-components'

import logo from '../../assets/img/logo.png'

const Logo: React.FC = () => {
  return (
    <StyledLogo>
      <img src={logo} height="32" style={{ marginTop: -4 }} />
      <StyledText>YieldWars</StyledText>
    </StyledLogo>
  )
}

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
`

const StyledText = styled.span`
font-family: Alegreya;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-left: ${props => props.theme.spacing[2]}px;
`

export default Logo