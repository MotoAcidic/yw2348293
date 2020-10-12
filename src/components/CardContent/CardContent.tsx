import React from 'react'
import styled from 'styled-components'

const CardContent: React.FC = ({ children }) => (
  <StyledCardContent>
    {children}
  </StyledCardContent>
)

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
  height: 100%;
`

export default CardContent