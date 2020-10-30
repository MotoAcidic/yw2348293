import { useContext } from 'react'
import { Context } from '../contexts/BetProvider'

const useBet = () => {
  const { yam } = useContext(Context)
  return yam
}

export default useBet