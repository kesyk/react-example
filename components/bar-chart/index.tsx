import { Adapt } from 'common/components/adapt'
import { BarChartMobile } from 'common/components/bar-chart/mobile'
import { CurrencyPair } from 'common/currencies'
import React from 'react'
import { Chart } from './@components/chart'

interface OwnProps {
  currentyPair: CurrencyPair
}

export class BarChart extends React.PureComponent<OwnProps> {
  render() {
    const { currentyPair } = this.props
    return (
      <>
        <Adapt>
          {adaptTo => {
            switch (adaptTo) {
              case 'desktop':
                return <Chart currencyPair={currentyPair} />

              case 'mobile':
                return <BarChartMobile currentyPair={currentyPair} />
            }
          }}
        </Adapt>
      </>
    )
  }
}
