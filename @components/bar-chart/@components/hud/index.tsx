import { chartConfig } from 'common/@components/bar-chart/@components/chart/config'
import { T } from 'common/@components/t'
import { CurrencyPair } from 'common/currencies'
import { FCurrency } from 'common/ui/formatters/fcurrency'
import { Bar } from 'fchart'
import React from 'react'
import theme from './theme.css'

interface OwnProps {
  data: Bar
  currencyPair: CurrencyPair
  intervalLabel: string
}

export class Hud extends React.Component<OwnProps> {
  render() {
    const { data, currencyPair, intervalLabel } = this.props

    return (
      <div className={theme.display}>
        <div>
          {currencyPair.name}: {intervalLabel}
        </div>
        <ul className={theme.list}>
          {chartConfig.currenciesWithCandles.includes(currencyPair.name) ? (
            <li>
              <T
                id="common.chart.hud.price~value"
                values={{
                  value: (
                    <FCurrency
                      type="price"
                      currency={currencyPair.baseCurrency}
                      value={data.close}
                    />
                  )
                }}
              />
            </li>
          ) : (
            <>
              <li>
                <T
                  id="common.chart.hud.open~value"
                  values={{
                    value: (
                      <FCurrency
                        type="price"
                        currency={currencyPair.baseCurrency}
                        value={data.open}
                      />
                    )
                  }}
                />
              </li>
              <li>
                <T
                  id="common.chart.hud.high~value"
                  values={{
                    value: (
                      <FCurrency
                        type="price"
                        currency={currencyPair.baseCurrency}
                        value={data.high}
                      />
                    )
                  }}
                />
              </li>
              <li>
                <T
                  id="common.chart.hud.low~value"
                  values={{
                    value: (
                      <FCurrency
                        type="price"
                        currency={currencyPair.baseCurrency}
                        value={data.low}
                      />
                    )
                  }}
                />
              </li>
              <li>
                <T
                  id="common.chart.hud.close~value"
                  values={{
                    value: (
                      <FCurrency
                        type="price"
                        currency={currencyPair.baseCurrency}
                        value={data.close}
                      />
                    )
                  }}
                />
              </li>
              <li>
                <T
                  id="common.chart.hud.volume~value"
                  values={{
                    value: (
                      <FCurrency
                        type="volume"
                        currency={currencyPair.baseCurrency}
                        value={data.volume}
                      />
                    )
                  }}
                />
              </li>
            </>
          )}
        </ul>
      </div>
    )
  }
}
