import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { Link } from 'react-router-dom'

interface ButtonProps {
  children?: React.ReactNode,
  disabled?: boolean,
  href?: string,
  onClick?: () => void,
  size?: 'sm' | 'md' | 'lg' | 'xlg',
  text?: string,
  to?: string,
  variant?: 'default' | 'secondary' | 'tertiary'
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  to,
  variant,
}) => {
  const { color, spacing } = useContext(ThemeContext)

  let buttonColor = 'white'


  if (disabled) {
    buttonColor = 'grey'
  }

  let boxShadow: string
  let buttonSize: number
  let buttonHeight: number
  let buttonPadding: number
  let fontSize: number
  switch (size) {
    case 'sm':
      boxShadow = `4px 4px 8px ${color.grey[300]},
        -8px -8px 16px ${color.grey[100]}FF;`
      buttonPadding = 5
      buttonSize = 100
      buttonHeight = 40
      fontSize = 14
      break
    case 'lg':
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px ${color.grey[100]}ff;`
      buttonPadding = 10
      buttonSize = 170
      buttonHeight = 40
      fontSize = 16
      break
    case 'xlg':
      boxShadow = `6px 6px 12px ${color.grey[300]},
          -12px -12px 24px ${color.grey[100]}ff;`
      buttonPadding = 10
      buttonSize = 250
      buttonHeight = 56
      fontSize = 16
      break
    case 'md':
    default:
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px -2px ${color.grey[100]}ff;`
      buttonPadding = 8
      buttonSize = 135
      buttonHeight = 40
      fontSize = 16
  }

  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>
    } else if (href) {
      return <StyledExternalLink href={href} target="__blank">{text}</StyledExternalLink>
    } else {
      return text
    }
  }, [href, text, to])

  return (
    <StyledButton
      boxShadow={boxShadow}
      color={buttonColor}
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      padding={buttonPadding}
      size={buttonSize}
      height={buttonHeight}
    >
      {children}
      {ButtonChild}
    </StyledButton>
  )
}

interface StyledButtonProps {
  boxShadow: string,
  color: string,
  disabled?: boolean,
  fontSize: number,
  padding: number,
  size: number,
  height: number,
}

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  border: 0;
  border-radius: 18px;
  cursor: pointer;
  display: flex;
  font-size: ${props => props.fontSize}px;
  border-radius: 8px;
  box-shadow: rgb(0,34,79) 6px 6px 12px, rgb(0,54,119) -12px -12px 24px -2px;
  background-color: #003983;
  height: ${props => props.height}px;
  justify-content: center;
  outline: none;
  padding-left: ${props => props.padding}px;
  padding-right: ${props => props.padding}px;
  pointer-events: ${props => !props.disabled ? undefined : 'none'};
  opacity: .8;
  width: ${props => props.size}px;
  font-family: Alegreya;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: ${props => props.color};
  &:hover {
    opacity: 1;
  }
`

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${props => -props.theme.spacing[4]}px;
  padding: 0 ${props => props.theme.spacing[4]}px;
  text-decoration: none;
`

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${props => -props.theme.spacing[4]}px;
  padding: 0 ${props => props.theme.spacing[4]}px;
  text-decoration: none;
`

export default Button