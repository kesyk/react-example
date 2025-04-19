import cn from 'classnames'
import {
  AllowedCurrency,
  Currency,
  CurrencyViewType,
  getCurrency
} from 'common/currencies'
import { mergeTheme } from 'common/utils/theme'
import React from 'react'
import { FormattedNumber } from 'react-intl'
import baseTheme from './theme.css'

interface Theme {
  wrapper: string
  symbol: string
}

interface OwnProps {
  value?: number
  currency: Currency | AllowedCurrency
  defaultValue?: React.ReactNode
  symbol?: boolean

  viewBefore?: CurrencyViewType
  viewAfter?: CurrencyViewType
  boldName?: boolean
  smallFraction?: boolean

  bold?: boolean
  theme?: Partial<Theme>

  type: 'price' | 'volume' | 'commission' | 'balance'

  className?: string
  colorFraction?: 'gray'
}

/** TODO Change all symbol styles to themes  */
export class FCurrency extends React.Component<OwnProps> {
  render() {
    const { symbol, bold, className, viewBefore, viewAfter } = this.props
    const currency = getCurrency(this.props.currency)

    return (
      <div
        className={cn(
          this.getTheme().wrapper,
          baseTheme[currency.name.toLowerCase()],
          className,
          {
            [baseTheme.isBold]: bold
          }
        )}
      >
        {symbol && (
          <div
            className={cn(this.getTheme().symbol, {
              [baseTheme.isBold]: bold
            })}
          />
        )}

        {viewBefore && <>{this.renderView(viewBefore)} </>}
        {this.renderValue()}
        {viewAfter && <> {this.renderView(viewAfter)}</>}
      </div>
    )
  }

  private getTheme = () => {
    const { theme: _theme } = this.props
    const theme = mergeTheme(baseTheme, _theme)

    return {
      wrapper: theme.wrapper,
      symbol: _theme && _theme.symbol ? _theme.symbol : baseTheme.symbol
    }
  }

  private readonly renderView = (type?: CurrencyViewType) => {
    if (!type) return null

    const currency = getCurrency(this.props.currency)

    const view = currency.view[type]

    return this.props.boldName ? <b>{view}</b> : view
  }

  private readonly renderValue = () => {
    const { value, defaultValue } = this.props

    if (value === undefined) {
      if (defaultValue) return defaultValue

      return (
        <FormattedNumber
          value={0.0}
          minimumFractionDigits={1}
          maximumFractionDigits={1}
        >
          {(x: string) => {
            const delimiter = x.replace(/\d/g, '')
            return `-${delimiter}--`
          }}
        </FormattedNumber>
      )
    }

    return (
      <FormattedNumber
        value={value}
        minimumFractionDigits={this.getFractionDigitsMin()}
        maximumFractionDigits={this.getFractionDigitsMax()}
      >
        {this.renderValueBody}
      </FormattedNumber>
    )
  }
  private readonly renderValueBody = (value: string) => {
    const { smallFraction, colorFraction } = this.props

    const match = /(,|\.)\d+$/.exec(value)

    if (!match) return value

    const significant = value.substring(0, match.index)
    const separator = value.charAt(match.index)
    const fraction = value.substring(match.index + 1)

    return (
      <>
        <span className={baseTheme.significant}>
          {significant}
          {separator}
        </span>
        <span
          className={cn(
            baseTheme.fraction,
            colorFraction && baseTheme[colorFraction],
            {
              [baseTheme.small]: smallFraction
            }
          )}
        >
          {fraction}
        </span>
      </>
    )
  }

  private readonly getFractionDigitsMin = () => {
    const { type } = this.props

    switch (type) {
      case 'price':
        return 5

      case 'commission':
      case 'volume':
        return 2

      case 'balance':
        return 2
    }
  }

  private readonly getFractionDigitsMax = () => {
    const currency = getCurrency(this.props.currency)
    const { type } = this.props

    switch (type) {
      case 'price':
        return 5

      case 'commission':
      case 'volume':
        return 2

      case 'balance':
        return currency.isFiat ? 2 : 8
    }
  }
}
