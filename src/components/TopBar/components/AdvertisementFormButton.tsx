import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useWallet } from 'use-wallet'

import useModal from '../../../hooks/useModal'

import Button from '../../Button'

import AdvertisementFormModal from './AdvertisementFormModal'


function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

interface AccountButtonProps {}

const AdvertisementFormButton: React.FC<AccountButtonProps> = (props) => {
  const [onPresentAccountModal] = useModal(<AdvertisementFormModal />)
  
  const { account, connect } = useWallet()

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
          text="Make A Pool"
        />
      )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

export default AdvertisementFormButton