import React from 'react'
import styled from 'styled-components'

const Card: React.FC = ({ children }) => (
  <StyledCard>
    {children}
  </StyledCard>
)

const StyledCard = styled.div`
width: 30%;
margin: auto;
min-width: 300px;
  border-radius: 8px;
    border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
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

// white border >>
// border: 1px solid rgb(226, 214, 207);
// box-shadow: rgb(247, 244, 242) 1px 1px 0px inset;

export default Card