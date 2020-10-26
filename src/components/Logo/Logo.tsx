import React from 'react'
import styled from 'styled-components'

import logo from '../../assets/img/logo.png'

const Logo: React.FC = () => {
  return (
    <StyledLogo>
      <img src={logo} alt="logo" height="40px"/>
      <StyledText>YieldWars</StyledText>
    </StyledLogo>
  )
}

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
`

const StyledText = styled.span`
font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-left: ${props => props.theme.spacing[2] * 1.5}px;
`

export default Logo