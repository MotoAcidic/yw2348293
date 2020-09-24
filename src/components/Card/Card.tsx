import React from 'react'
import styled from 'styled-components'

const Card: React.FC = ({ children }) => (
  <StyledCard>
    {children}
  </StyledCard>
)

const StyledCard = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 50;
  border: 1px solid rgb(226, 214, 207);
  border-radius: 12px;
  box-shadow: rgb(247, 244, 242) 1px 1px 0px inset;
    background-color: #003677;
`

export default Card