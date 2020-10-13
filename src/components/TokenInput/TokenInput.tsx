import React from 'react'
import styled from 'styled-components'

import Button from '../Button'
import Input, { InputProps } from '../Input'

interface TokenInputProps extends InputProps {
  max: number | string,
  symbol: string,
  onSelectMax?: () => void,
}

const TokenInput: React.FC<TokenInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
}) => {
  return (
    <StyledTokenInput>
      <StyledMaxText>{max.toLocaleString()} {symbol} Available</StyledMaxText>
      <Input
        endAdornment={(
          <StyledTokenAdornmentWrapper>
            <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
            <StyledSpacer />
            <div>
              <ModalButton onClick={onSelectMax} >
                Max
                </ModalButton>
            </div>
          </StyledTokenAdornmentWrapper>
        )}
        onChange={onChange}
        placeholder="0"
        value={value}
      />
    </StyledTokenInput>
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

const StyledTokenInput = styled.div`
font-size: 14px;
`

const StyledSpacer = styled.div`
  width: ${props => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 50%;
`

const StyledMaxText = styled.div`
  align-items: center;
  color: ${props => props.theme.color.grey[400]};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
`

const StyledTokenSymbol = styled.span`
color: #0d87b3;
  font-weight: 700;
`

export default TokenInput