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