import { TradeType } from 'common/trade-gate'

export const roundUp = (num: number, precision: number): number => {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

export const round = (num: number, precision: number): number => {
  return +num.toFixed(precision)
}

export const roundDown = (num: number, precision: number): number => {
  const truncMask = new RegExp('(\\d+\\.\\d{' + precision + '})(\\d)')
  const truncedArr = num.toString().match(truncMask)
  return truncedArr ? parseFloat(truncedArr[1]) : num
}

export const calculateCommission = (data: {
  amount: number
  price: number
  commissionPercentage: number
  tradeType: TradeType
}) => {
  const { amount, commissionPercentage, price, tradeType } = data

  if (!amount || !price) return 0

  let commission =
    tradeType === TradeType.Buy
      ? (amount * price * commissionPercentage) / 100
      : (amount * commissionPercentage) / 100

  commission =
    tradeType === TradeType.Buy && commission < 0.1 ? 0.1 : commission

  return roundUp(commission, 2)
}
