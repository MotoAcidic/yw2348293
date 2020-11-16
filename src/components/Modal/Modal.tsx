import React from 'react'
import styled from 'styled-components'

import Card from '../Card'
import CardContent from '../CardContent'
import Container from '../Container'

export interface ModalProps {
  onDismiss?: () => void,
}

const Modal: React.FC = ({ children }) => {
  return (
    <Container size="sm">
      <StyledModal>
            <CardContent>
              {children}
            </CardContent>
      </StyledModal>
    </Container>
  )
}

const StyledModal = styled.div`
border-radius: 8px;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ccc;
`

export default Modal