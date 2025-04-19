import { chartConfig } from 'common/@components/bar-chart/@components/chart/config'
import { T } from 'common/@components/t'
import { CurrencyPair } from 'common/currencies'
import {
  CrosshairData,
  FChart
} from 'fchart'
import React from 'react'
import {
  FormattedNumber,
  InjectedIntlProps,
  injectIntl
} from 'react-intl'
import theme from './theme.css'

const formatVolume = (volume: number) => volume.toFixed(2)


interface OwnProps {
  chart: FChart
  currencyPair: CurrencyPair
}

interface OwnState {
  crosshairData?: CrosshairData
}

type Props = OwnProps & InjectedIntlProps

class ChartTooltipComponent extends React.Component<Props, OwnState> {
  private _tooltipWidth: number = 130
  private _tooltipHeight: number = 100

  private _chart: FChart

  constructor(props: Props) {
    super(props)

    this.state = {}
    this._chart = this.props.chart
  }

  componentDidMount() {
    const { chart } = this.props

    chart.ohlcCrosshair.mouseRect.on('out', () =>
      this.setState({ crosshairData: undefined })
    )

    chart.ohlcCrosshair.on('move', data =>
      this.setState({ crosshairData: data })
    )
  }

  shouldComponentUpdate(_: OwnProps, nextState: OwnState) {
    const { crosshairData: currentData } = this.state
    const { crosshairData: nextData } = nextState

    if ((currentData === undefined) !== (nextData === undefined)) {
      return true
    }

    if (!currentData || !nextData) {
      return false
    }

    if ((currentData.bar === undefined) !== (nextData.bar === undefined)) {
      return true
    }

    if (currentData.xValue !== nextData.xValue) {
      return true
    }

    return false
  }

  render() {
    const {
      currencyPair: { name }
    } = this.props

    const { crosshairData } = this.state

    if (!crosshairData || !crosshairData.bar) return null

    return (
      <div
        style={{ left: this.calculateLeft(), top: this.calculateTop() }}
        className={theme.tooltip}
        ref={ref => {
          if (ref) {
            this._tooltipWidth = ref.clientWidth
            this._tooltipHeight = ref.clientHeight
          }
        }}
      >
        <div>
          <div>
            <T id="common.chart.tooltip.date"/>
          </div>
          <div>{this.getTooltipTimeFormatter(new Date(crosshairData.bar.time))}</div>
        </div>

        {chartConfig.currenciesWithCandles.includes(name) ? (
          <div>
            <div>
              <T id="common.chart.tooltip.price"/>
            </div>
            <div>{(crosshairData.bar.close)}</div>
          </div>
        ) : (
          <>
            <div>
              <div>
                <T id="common.chart.tooltip.open"/>
              </div>
              <div>
                <FormattedNumber
                  value={crosshairData.bar.open}
                  minimumFractionDigits={5}
                  maximumFractionDigits={5}
                />
              </div>
            </div>

            <div>
              <div>
                <T id="common.chart.tooltip.high"/>
              </div>
              <div>
                <FormattedNumber
                  value={crosshairData.bar.high}
                  minimumFractionDigits={5}
                  maximumFractionDigits={5}
                />
              </div>
            </div>

            <div>
              <div>
                <T id="common.chart.tooltip.low"/>
              </div>
              <div>
                <FormattedNumber
                  value={crosshairData.bar.low}
                  minimumFractionDigits={5}
                  maximumFractionDigits={5}
                />
              </div>
            </div>

            <div>
              <div>
                <T id="common.chart.tooltip.close"/>
              </div>
              <div>
                <FormattedNumber
                  value={crosshairData.bar.close}
                  minimumFractionDigits={5}
                  maximumFractionDigits={5}
                />
              </div>
            </div>
            <div>
              <div>
                <T id="common.chart.tooltip.volume"/>
              </div>
              <div>{formatVolume(crosshairData.bar.volume)}</div>
            </div>
          </>
        )}
      </div>
    )
  }

  private readonly calculateLeft = (): number => {
    const delta = 30

    const x = this.state.crosshairData!.x

    if (x - this._tooltipWidth - delta > 10) {
      return x - this._tooltipWidth - delta
    }

    return x + delta
  }

  private readonly calculateTop = (): number => {
    const delta = 30

    const y = this.state.crosshairData!.y
    const ohlcHeight = this.props.chart.ohlcHeight

    if (y - delta < 10) {
      return 10
    }

    if (y - delta + this._tooltipHeight > ohlcHeight - 10) {
      return ohlcHeight - 10 - this._tooltipHeight
    }

    return Math.min(y - delta, ohlcHeight - 10 - this._tooltipHeight)
  }

  private readonly getTooltipTimeFormatter = (value: Date): string => {
    const { formatDate } = this.props.intl
    switch (this._chart!.engine.interval) {
      case 'minute':
      case 'hour':
        return formatDate(
          value,
          {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          })
      default:
        return formatDate(
          value,
          {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
          })
    }
  }
}

export const ChartTooltip = injectIntl(ChartTooltipComponent)



