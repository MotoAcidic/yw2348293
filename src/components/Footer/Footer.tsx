import React from 'react'
import styled from 'styled-components'

import Nav from './components/Nav'
import MobileNav from './components/MobileNav'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

const Footer: React.FC = () => (
  <StyledFooter>
    <StyledFooterInner>
      {isMobile() ? <MobileNav /> : <Nav />}
    </StyledFooterInner>
  </StyledFooter>
)

const StyledFooter = styled.footer`
  align-items: center;
  display: flex;
  justify-content: center;
`
const StyledFooterInner = styled.div`
  align-items: center;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  height: ${props => props.theme.topBarSize}px;
  max-width: ${props => props.theme.siteWidth}px;
  width: 100%;
`

export default Footer