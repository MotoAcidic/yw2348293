import React, { useCallback, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'
import styled from 'styled-components'
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
import Results from './views/Results/Results'

import About from './views/About/About'
import theme from './theme'
import { createGlobalStyle } from 'styled-components';
import GilroyBold from "./assets/fonts/Gilroy-Bold.otf";
import GilroyMed from "./assets/fonts/Gilroy-Medium.otf";
import SFMono from "./assets/fonts/SFMonoSemibold.woff";

const GlobalStyle = createGlobalStyle`

@font-face {
  font-family: 'SF Mono Semibold';
  font-style: normal;
  font-weight: normal;
  src: local('SF Mono Semibold'), url(${SFMono}) format('woff');
  }

@font-face {
  font-family: "Gilroy";
  src: local(Gilroy-Bold), url(${GilroyBold}) format("opentype");
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: "GilroyMedium";
  src: local(Gilroy-Med), url(${GilroyMed}) format("opentype");
  font-weight: normal;
  font-style: normal;
}


`;

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
            <Route path="/results" exact>
              <Results />
            </Route>
            <Route path="/about" exact>
              <About />
            </Route>
          </Switch>
        </Router>
      </StyledCanvas>
    </Providers>
  )
}

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {/* change the ChainId below here for the preffered network when testing, 1 main 3 ropsten 42 kovan */}
      <UseWalletProvider chainId={1} connectors={{
        walletconnect: { rpcUrl: 'https://mainnet.eth.aragon.network/' },
      }}>
        <YamProvider>
          <TransactionProvider>
            <ModalsProvider>
              <FarmsProvider>
                <GlobalStyle />

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

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #011B3A;
`
export default App
