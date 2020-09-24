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
          <Card>
            <CardContent>
              {children}
            </CardContent>
          </Card>
      </StyledModal>
    </Container>
  )
}

const StyledModal = styled.div`
border-radius: 8px;
  position: relative;
  border: solid 2px #0095f0;
  background-color: #003677;
  z-index: 100000;
`

export default Modal