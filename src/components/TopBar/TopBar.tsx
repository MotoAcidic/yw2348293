import React from 'react'
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'

import AccountButton from './components/AccountButton'
import Nav from './components/Nav'
import TxButton from './components/TxButton'
import { NavLink } from 'react-router-dom'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

const TopBar: React.FC = () => {
  return (
    <StyledTopBar>
      <Notice><Text>
        ⚔️ 🚨  WAR is an experiment in Degen Gambling. DYOR.<a style={{ color: 'white', margin: "0 4px 0 4px", }} target="_blank"
          rel="noopener noreferrer" href="https://medium.com/@yieldwars/announcing-yieldwars-2-0-the-next-evolution-of-the-defi-battle-royale-6b1f15755209">Learn More.</a>  🚨⚔️
          </Text>
      </Notice>

      {isMobile() ? (
        <Container size="lg">
          <StyledTopBarInner>
            <NavLink to="/" style={{ flex: 1, textDecoration: "none" }}>
              <Logo />
            </NavLink>
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
            </div>
          </StyledTopBarInner >
          <Nav />
        </Container >
      ) : (
          <Container size="lg">
            <StyledTopBarInner>
              <NavLink to="/" style={{ flex: 1, textDecoration: "none" }}>
                <Logo />
              </NavLink>
              <Nav />
              <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <AccountButton />
              </div>
            </StyledTopBarInner >
          </Container >
        )}
    </StyledTopBar >
  )
}

const Text = !isMobile() ? styled.div`` : styled.div`max-width: 90%;`;

const Notice = !isMobile() ? styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Gilroy";
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: white;
  background-color: black;
` :
  styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Gilroy";
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: white;
  background-color: black;
`

const StyledTopBar = styled.div`
`

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${props => props.theme.topBarSize}px;
  justify-content: space-between;
  max-width: ${props => props.theme.siteWidth}px;
  width: 100%;
`

export default TopBar