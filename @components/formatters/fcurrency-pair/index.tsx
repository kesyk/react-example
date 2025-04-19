import cn from 'classnames'
import {
  AllowedCurrencyPair,
  CurrencyPair,
  getCurrencyPair
} from 'common/currencies'
import React from 'react'
import { FormattedNumber } from 'react-intl'
import theme from './theme.css'

const currencyPairsWithTwoDigits: AllowedCurrencyPair[] = ['BTC/EUR', 'BTC/USD']

interface OwnProps {
  value: number
  currencyPair: CurrencyPair | AllowedCurrencyPair
  bold?: boolean
}

export class FCurrencyPair extends React.Component<OwnProps> {
  render() {
    const { value, bold } = this.props

    const currencyPair = getCurrencyPair(this.props.currencyPair)

    const fraction = currencyPairsWithTwoDigits.includes(currencyPair.name)
      ? 2
      : 5

    return (
      <span
        className={cn({
          [theme.bold]: bold
        })}
      >
        <FormattedNumber
          value={value}
          minimumFractionDigits={fraction}
          maximumFractionDigits={fraction}
        />
      </span>
    )
  }
}
