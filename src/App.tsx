import React, { useCallback, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'
import styled from 'styled-components'
import Sky from './assets/img/skybig.png'
import Landscape from './assets/img/landscapebig.png'
import Logo from './assets/img/logo@2x.png'
import DisclaimerModal from './components/DisclaimerModal'

import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import YamProvider from './contexts/YamProvider'
import TransactionProvider from './contexts/Transactions'

import useModal from './hooks/useModal'

import Farms from './views/Farms'
import Farm from './views/Farm'
import Splash from './views/Splash/Splash'
import Battle from './views/Battle/Battle'
import About from './views/About/About'

import theme from './theme'

const App: React.FC = () => {
  return (
    <Providers>
      <StyledCanvas>

        <Router>
          <Switch>
            <Route path="/splash" exact>
              <Splash />
            </Route>
            <Route path="/" exact>
              <Farms />
            </Route>
            <Route path="/farms/:farmId">
              <Farm />
            </Route>
            {/* <Route path="/earn" exact>
                <Earns />
              </Route> */}
            {/* <Route path="/earn/:earnId">
                <Earn /> 
              </Route> */}
            <Route path="/battle" exact>
              <Battle />
            </Route>
            <Route path="/faq" exact>
              <About />
            </Route>
          </Switch>
        </Router>
      </StyledCanvas>
      {/* <Disclaimer /> */}
    </Providers>
  )
}

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {/* change the ChainId below here for the preffered network when testing, 1 main 3 ropsten 42 kovan */}
      <UseWalletProvider chainId={1}>
        <YamProvider>
          <TransactionProvider>
            <ModalsProvider>
              <FarmsProvider>
                {children}
              </FarmsProvider>
            </ModalsProvider>
          </TransactionProvider>
        </YamProvider>
      </UseWalletProvider>
    </ThemeProvider>
  )
}

const Disclaimer: React.FC = () => {

  const markSeen = useCallback(() => {
    localStorage.setItem('disclaimer', 'seen')
  }, [])

  const [onPresentDisclaimerModal] = useModal(<DisclaimerModal onConfirm={markSeen} />)

  useEffect(() => {
    const seenDisclaimer = localStorage.getItem('disclaimer')
    // if (!seenDisclaimer) {
    onPresentDisclaimerModal()
    // }
  }, [])

  return (
    <div />
  )
}

const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
`

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #154f9b;
`

const StyledSky = styled.div`
  position: absolute;
  width: 100%;
  height: 60%;
  background-image: url(${Sky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
`

const StyledLandscape = styled.div`
  position: absolute;
  width: 100%;
  height: 45%;
  top: 55vh;
  background-image: url(${Landscape});
  background-size: cover;
`

export default App
