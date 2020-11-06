import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/home">Home</StyledLink>
      {/* <StyledLink exact activeClassName="active" to="/earn">Earn</StyledLink> */}
      {/* <StyledLink exact activeClassName="active" to="/battle">Battle</StyledLink> */}
      <StyledLink exact activeClassName="active" to="/election">Battle</StyledLink>
      <StyledLink exact activeClassName="active" to="/results">Results</StyledLink>
      {/* <StyledLink exact activeClassName="active" to="/about">About</StyledLink> */}
      <DisabledLink>
        <Top>
          Gov
        </Top>
        <Bottom>
          (coming soon)
        </Bottom>
      </DisabledLink>
    </StyledNav >
  )
}

const Bottom = !isMobile() ? styled.div`
font-size: 12px;
color: white;
position:absolute;
margin-top: 3px;
margin-left: 120px;
` :styled.div`
font-size: 12px;
color: white;
position:absolute;
margin-top: 18px;
`

const Top = styled.div`
font-family: "Gilroy";
font-size: 18px;`

const DisabledLink = !isMobile() ? styled.div`
display: flex;
flex-direction: column;
cursor: pointer;
opacity: 0.5;
align-items: center;
font-family: "Gilroy";
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffb700;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
` : styled.div`
display: flex;
flex-direction: column;
align-items: center;
font-family: "Gilroy";
cursor: pointer;
opacity: 0.5;
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffb700;
  text-decoration: none;
  &.active {
    opacity: 1;
    text-decoration: underline;
    color: white;
  }
`

const StyledNav = !isMobile() ? styled.nav`
  align-items: center;
  display: flex;
` : styled.nav`
width: 100vw;
left: 0;
position: absolute;
display: flex;
justify-content: space-around;
`

const StyledLink = !isMobile() ? styled(NavLink)`
font-family: "Gilroy";
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffb700;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
  color: #ffcb46;
  }
  &.active {
    text-decoration: underline;
    color: white;
  }
` : styled(NavLink)`
font-family: "Gilroy";
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffb700;
  text-decoration: none;
  &.active {
    opacity: 1;
    text-decoration: underline;
    color: white;
  }
`

export default Nav