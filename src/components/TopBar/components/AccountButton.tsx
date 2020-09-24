import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useWallet } from 'use-wallet'

import useModal from '../../../hooks/useModal'
import { formatAddress } from '../../../utils'

import Button from '../../Button'

import AccountModal from './AccountModal'

interface AccountButtonProps { }

const AccountButton: React.FC<AccountButtonProps> = (props) => {

  const { account, connect } = useWallet()


  return (
    <StyledAccountButton>
      {!account ? (
        <Button
          onClick={() => connect('injected')}
          size="lg"
          text="Unlock Wallet"
          disabled={false}
        />
      ) : (
          <StyledAccountInfo>
            <Oval />{account.substring(0, 10) + '...'}
          </StyledAccountInfo>
        )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div`

`

const Oval = styled.div`
width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: #7dca46;
  margin-right: 10px;
  `

const StyledAccountInfo = styled.div`
font-family: Alegreya;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export default AccountButton