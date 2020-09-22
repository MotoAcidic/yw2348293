import React from 'react'
import styled from 'styled-components'

interface CardIconProps {
  children?: React.ReactNode,
}

const CardIcon: React.FC<CardIconProps> = ({ children }) => (
  <StyledCardIcon>
    {children}
  </StyledCardIcon>
)

const StyledCardIcon = styled.div`
  background-color: #002450;
  font-size: 36px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
`

export default CardIcon