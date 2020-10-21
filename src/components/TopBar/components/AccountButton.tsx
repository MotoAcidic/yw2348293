import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useWallet } from 'use-wallet'

import useModal from '../../../hooks/useModal'
import { formatAddress } from '../../../utils'

import Button from '../../Button'

import AccountModal from './AccountModal'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

interface AccountButtonProps { }

const AccountButton: React.FC<AccountButtonProps> = (props) => {

  const { account, connect } = useWallet()

  return (
    <StyledAccountButton>
      {!account ?

        <Button
          onClick={() => connect('injected')}
          size="lg"
          text="Unlock Wallet"
          disabled={false}
        /> :
        <StyledAccountInfo>
          <Oval /><StyledA href={`https://etherscan.io/address/${account}`} target={`_blank`}>{account.substring(0, 6) + '...' + account.substring(account.length - 4)}</StyledA>
        </StyledAccountInfo>
      }
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

  display: flex;
  flex-direction: row;
  align-items: center;
`

const StyledA = styled.a`
font-family: "Gilroy";
font-size: 20px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffb700;
transition: all .1s linear;
opacity: 0.7;
  text-decoration: none;
  &:hover {
    opacity: .9;
  }
  &.active {
    opacity: 1;
  }
`

export default AccountButton