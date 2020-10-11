import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href="https://discord.gg/8pppSYe">Discord</StyledLink>
      <StyledLink href="https://t.me/yieldwarsofficial">Telegram</StyledLink>
      {/* <StyledLink href="https://github.com">Github</StyledLink> */}
      <StyledLink href="https://medium.com/@yieldwars">Medium</StyledLink>
      <StyledLink href="https://twitter.com/yieldwars">Twitter</StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
font-family: "Gilroy";
font-size: 15px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
opacity: 1;
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
`

export default Nav