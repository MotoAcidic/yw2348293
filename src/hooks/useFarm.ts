import { useContext } from 'react'
import { Context as FarmsContext, Farm } from '../contexts/Farms'

const useFarm = (id: string): Farm => {
  const { farms } = useContext(FarmsContext)
  //console.log(`farms`,farms);
  const farm = farms[farms.length - 1];//farms.find(farm => farm.id === id)
  return farm
}

export default useFarm