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
  textColor?: string,
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
  textColor,
  to,
  variant,
}) => {
  const { color, spacing } = useContext(ThemeContext)

  let boxShadow: string
  let buttonSize: number
  let buttonHeight: number
  let buttonPadding: number
  let fontSize: number
  switch (size) {
    case 'sm':
      boxShadow = `4px 4px 8px ${color.grey[300]},
        -8px -8px 16px ${color.grey[100]}FF;`
        buttonPadding = 10
        buttonSize = 170
        buttonHeight = 80
        fontSize = 16
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
      buttonSize = 220
      buttonHeight = 40
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
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      padding={buttonPadding}
      size={buttonSize}
      height={buttonHeight}
      textColor={textColor ? textColor : "white" }
    >
      {children}
      {ButtonChild}
    </StyledButton>
  )
}

interface StyledButtonProps {
  boxShadow: string,
  disabled?: boolean,
  fontSize: number,
  padding: number,
  size: number,
  height: number,
  textColor: string,
}

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  border: ${props => !props.disabled ? "solid 2px #ffb700" : "solid 2px #838383"};
  border-radius: 8px;
  cursor: pointer;
  opacity: ${props => !props.disabled ? 1 : .4};
  display: flex;
  font-size: ${props => props.fontSize}px;
  background-color: rgba(256, 256, 256, 0.05);
  height: ${props => props.height ? props.height : 38}px;
  justify-content: center;
  outline: none;
  padding-left: ${props => props.padding}px;
  padding-right: ${props => props.padding}px;
  padding-top: 3px;
  pointer-events: ${props => !props.disabled ? undefined : 'none'};
  width: ${props => props.size}px;
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: ${props => !props.disabled ? props.textColor : "#cccccc"};
  transition: all .1s linear;
  &:hover {
  background-color: rgba(256, 256, 256, 0.07);
  border: solid 2px #ffcb46;
  }
`

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  text-align: center;
  padding-top: 2px;
  width: 100%;
  margin: 0 ${props => -props.theme.spacing[4]}px;
  text-decoration: none;
`

const StyledExternalLink = styled.a`
  align-items: center !important;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  text-align: center;
  margin: 0 ${props => -props.theme.spacing[4]}px;
  padding-left: 10px;
  padding-right: 10px;
  text-decoration: none;
`

export default Button