import React from 'react'
import styled from 'styled-components'

interface PageHeaderProps {
  icon: React.ReactNode,
  subtitle?: React.ReactNode,
  title?: string,
}

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, subtitle, title }) => {
  return (
    <StyledPageHeader>
      {icon === "aa" && <img style={{width:"85px"}} src="https://zombie.finance/logo2.png"/>}
      {icon !== "aa" && <StyledIcon>{icon}</StyledIcon>}
      <StyledTitle>{title}</StyledTitle>
      <StyledSubtitle>{subtitle}</StyledSubtitle>
    </StyledPageHeader>
  )
}

const StyledPageHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: ${props => props.theme.spacing[4]}px;
  padding-top: ${props => props.theme.spacing[6]}px;
`

const StyledIcon = !isMobile() ? styled.div`
  font-size: 96px;
  height: 96px;
  line-height: 96px;
  text-align: center;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0 40px 0;
` : styled.div`
font-size: 96px;
height: 96px;
line-height: 96px;
text-align: center;
width: 150px;
display: flex;
justify-content: center;
align-items: center;
margin: 20px 0 40px 0;

`;

const StyledTitle = styled.h1`
font-family: "Gilroy";
font-size: 30px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
  margin: 0;
  padding: 0;
`

const StyledSubtitle = styled.h3`
  color: ${props => props.theme.color.grey[400]};
  font-size: 18px;
  font-family: "Gilroy";
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-top: 2vh;
  padding: 0;
`

export default PageHeader