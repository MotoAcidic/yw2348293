import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from "web3-eth-contract"

import { getStaked } from '../yamUtils'
import useYam from './useYam'

const useStakedBalance = (pool: Contract) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const yam = useYam()

  const fetchBalance = useCallback(async () => {
    const precision = pool.options.address.toLowerCase() === "0x7845664310e205c979aa067bcfe02704d1001bcf" ?
        new BigNumber(10).pow(12) :
        new BigNumber(1);
    
    const balance = (await getStaked(yam, pool, account) as BigNumber).multipliedBy(precision);
    setBalance(new BigNumber(balance))
  }, [account, pool, yam])

  useEffect(() => {
    if (account && pool && yam) {
      fetchBalance()
    }
  }, [account, pool, setBalance, yam])

  return balance
}

export default useStakedBalance