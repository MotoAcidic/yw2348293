import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from "web3-eth-contract"

import { stake } from '../yamUtils'

const useStake = (poolContract: Contract) => {
  const { account } = useWallet()

  const handleStake = useCallback(async (amount: string) => {
    console.log(amount);
    const txHash = await stake(poolContract, amount, account)
    console.log(txHash)
  }, [account, poolContract])

  return { onStake: handleStake }
}

export default useStake