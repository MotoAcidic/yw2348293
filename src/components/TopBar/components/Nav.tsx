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
      <StyledLink exact activeClassName="active" to="/">Farm</StyledLink>
      {/* <StyledLink exact activeClassName="active" to="/earn">Earn</StyledLink> */}
      <StyledLink exact activeClassName="active" to="/battle">Battle</StyledLink>
      <StyledLink exact activeClassName="active" to="/results">Results</StyledLink>
      <StyledLink exact activeClassName="active" to="/about">About</StyledLink>
    </StyledNav >
  )
}

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
    opacity: 1;
  color: #ffcb46;

  }
  &.active {
    opacity: 1;
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