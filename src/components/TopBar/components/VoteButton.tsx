import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useWallet } from 'use-wallet'

import useModal from '../../../hooks/useModal'
import { formatAddress } from '../../../utils'

import Button from '../../Button'

import VoteModal from './VoteModal'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const [onPresentAccountModal] = useModal(<VoteModal />)
  
  const { account, connect, ethereum } = useWallet()

  return (
    <StyledAccountButton>
      {!account ? (
 !isMobile() ? (
  <Button
    onClick={() => connect('injected')}
    size="lg"
    text="Unlock Wallet"
    disabled={false}
  />) : (
    <Button
      onClick={() => connect('walletconnect')}
      size="lg"
      text="Unlock Wallet"
      disabled={false}
    />)
      ) : (
        <Button
          onClick={onPresentAccountModal}
          size="md"
          text="Make A Proposal"
        />
      )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

export default AccountButton