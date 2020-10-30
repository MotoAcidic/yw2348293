import React, { createContext, useEffect, useState } from 'react'

import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import ElectionABI from "../../yam/clean_build/contracts/ElectionBetting.json";


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
    const web3 = new Web3(Web3.givenProvider);
    const fWarAddress = "0x533Fc51f9796E4aA4c5b462218069F68034A635c";
    if (ethereum) {
      const betContract = new web3.eth.Contract(ElectionABI.abi as unknown as AbiItem, fWarAddress);
      setYam(betContract);
      console.log("token", betContract);
    }
  }, [ethereum])

  return (
    <Context.Provider value={{ yam }}>
      {children}
    </Context.Provider>
  )
}

export default YamProvider
