import BigNumber from 'bignumber.js'

export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  if (displayBalance.lt(1)) {
    // return displayBalance.toFixed(0)

    return displayBalance.toPrecision(4)
  } else {
    return displayBalance.toFixed(0)
  }
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed(0)
}

export const getSNXDisplayBalance = (balance: BigNumber, decimals = 6) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed(0)
}