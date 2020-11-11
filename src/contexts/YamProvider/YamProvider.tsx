import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Yam } from '../../yam'

export interface YamContext {
  yam?: typeof Yam
}

export const Context = createContext<YamContext>({
  yam: undefined,
})

declare global {
  interface Window {
    yamsauce: any
  }
}

const YamProvider: React.FC = ({ children }) => {
  const { ethereum } = useWallet()
  const s = useWallet()
  const [yam, setYam] = useState<any>()

  useEffect(() => {
    console.log(s);
    if (ethereum) {
      const yamLib = new Yam(
        ethereum,
        "42",
        false,
        {
          defaultProvider: false,
          defaultAccount: "",
          defaultConfirmations: 1,
          autoGasMultiplier: 1.5,
          testing: false,
          defaultGas: "6000000",
          defaultGasPrice: "1000000000000",
          accounts: [],
          ethereumNodeTimeout: 10000
        }
      )
      setYam(yamLib)
      window.yamsauce = yamLib
    }
    else {
      const yamLib = new Yam(
        'https://mainnet.infura.io/v3/a768678405854cf584ae620be7844cc3',
        "42",
        false,
        {
          defaultProvider: true,
          defaultAccount: "",
          defaultConfirmations: 1,
          autoGasMultiplier: 1.5,
          testing: false,
          defaultGas: "6000000",
          defaultGasPrice: "1000000000000",
          accounts: [],
          ethereumNodeTimeout: 10000
        }
      )
      setYam(yamLib)
      window.yamsauce = yamLib
    }
  }, [ethereum])

  return (
    <Context.Provider value={{ yam }}>
      {children}
    </Context.Provider>
  )
}

export default YamProvider
