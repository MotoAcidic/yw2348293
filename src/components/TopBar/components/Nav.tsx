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
      <StyledLink exact activeClassName="active" to="/faq">About</StyledLink>
      <StyledLink exact activeClassName="active" to="/roadmap">Roadmap</StyledLink>
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

const StyledA = styled.a`
font-family: Alegreya;
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
opacity: 0.7;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    opacity: .9;
  }
  &.active {
    opacity: 1;
  }
`

const StyledLink = !isMobile() ? styled(NavLink)`
font-family: Alegreya;
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
opacity: 0.7;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    opacity: .9;
  }
  &.active {
    opacity: 1;
  }
` :styled(NavLink)`
font-family: Alegreya;
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
opacity: 0.7;
  text-decoration: none;
  &:hover {
    opacity: .9;
  }
  &.active {
    opacity: 1;
  }
` 
const StyledLink2 = styled.a`
  color: ${props => props.theme.color.grey[400]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
`

export default Nav