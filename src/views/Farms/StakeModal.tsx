import React, { useCallback, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import Modal, { ModalProps } from '../../components/Modal'
import ModalActions from '../../components/ModalActions'
import ModalTitle from '../../components/ModalTitle'
import TokenInput from '../../components/TokenInput'

import { getFullDisplayBalance } from '../../utils/formatBalance'

interface DepositModalProps extends ModalProps {
  max: BigNumber,
  onConfirm: (amount: string) => void,
  tokenName?: string,
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '' }) => {
  const [val, setVal] = useState('')
  const [done, setDone] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const confirm = useCallback((value) => {
    if (value === '') {
      value = 0
    }
    onConfirm(value)
    setDone(true)
  }, [fullBalance, setVal])

  return (
    <Modal>
      <ModalTitle text={`Stake Your Tokens`} />
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      {done ? (
        <ModalActions>
          <ModalButton style={{width: "60%"}}  onClick={onDismiss} >
            Close
          </ModalButton>
          Pending
        </ModalActions>
      ) : (
          <ModalActions>
            <ModalButton style={{width: "60%"}}  onClick={onDismiss} >           Cancel
          </ModalButton>
            <ModalButton style={{width: "60%"}} onClick={() => confirm(val)} >
              Confirm
            </ModalButton>
          </ModalActions>
        )}
    </Modal>
  )
}

const ModalButton = styled.button`
  align-items: center;
  border: solid 2px #ffb700;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  display: flex;
  font-size:16px;
  background-color: rgba(256, 256, 256, 0.05);
  height: 38px;
  padding: 0 10px 0 10px;
  justify-content: center;
  outline: none;
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #003677;
  &:hover {
    opacity: 1;
  }
`


export default DepositModal