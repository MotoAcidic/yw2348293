import React, { useCallback, useMemo, useState } from 'react'

import BigNumber from 'bignumber.js'

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'

import { getFullDisplayBalance, getSNXDisplayBalance  } from '../../../utils/formatBalance'

interface WithdrawModalProps extends ModalProps {
  max: BigNumber,
  onConfirm: (amount: string) => void,
  tokenName?: string,
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '' }) => {
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
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />
      {done ? (
        <ModalActions>
          <Button text="Close" variant="secondary" onClick={onDismiss} />
        </ModalActions>
      ) : (
          <ModalActions>
            <Button text="Cancel" variant="secondary" onClick={onDismiss} />
            <Button text="Confirm" onClick={() => confirm(val)} />
          </ModalActions>
        )}
    </Modal>
  )
}

export default WithdrawModal