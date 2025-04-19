import { adaptIs } from 'common/@components/adapt'
import { AllowedCurrencyPair } from 'common/currencies'

const currenciesWithCandles: AllowedCurrencyPair[] = [
  'BITBON/BTC',
  'BITBON/ETH',
  'BITBON/LTC',
  'BITBON/EUR'
]

export const chartConfig = {
  currenciesWithCandles,

  minimumBars: 20,
  maximumBars: 130,
  defaultInterval: '1d',
  zoomSteps: 5,
  getDefaultZoomStep: () => (adaptIs('mobile') ? 0 : 2)
}

export const longPriceCurrencyPairs = [
  'BTC/USD',
  'BTC/EUR'
]