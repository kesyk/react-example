import cn from 'classnames'
import { Chart } from 'common/components/bar-chart/components/chart'
import { T } from 'common/components/t'
import { CurrencyPair } from 'common/currencies'
import { Button } from 'common/ui/button'
import React from 'react'
import theme from './theme.css'

interface OwnProps {
  currentyPair: CurrencyPair
}

interface OwnState {
  show: boolean
}

export class BarChartMobile extends React.PureComponent<OwnProps, OwnState> {
  constructor(props: OwnProps) {
    super(props)

    this.state = {
      show: false
    }
  }

  componentDidUpdate(_prevProps: {}, prevState: OwnState) {
    if (prevState.show && !this.state.show) this.resetView()
  }

  componentWillUnmount() {
    setTimeout(() => this.resetView(), 1)
  }

  render() {
    const { show } = this.state
    const {
      currentyPair,
    } = this.props

    return (
      <>
        <div className={cn(theme.btnWrap, 'phone')}>
          <Button
            className={theme.btnOpenChart}
            mobileWide
            onClick={this.onOpen}
          >
            <div className={theme.iconChart}/>
            <span>
              <T id="common.chart.btn.open"/>
            </span>
          </Button>
        </div>

        {show && <Chart
          currencyPair={currentyPair}
          onClose={this.onClose}
          minBarHeight={6}
        />}
      </>
    )
  }

  private readonly onClose = () => {
    this.setState({ show: false })
    document.body.style.position = 'static'
  }

  private readonly onOpen = () => {
    this.setState({ show: true }, () => {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
    })
  }

  private resetView() {
    document.body.style.overflow = 'visible'
  }
}
