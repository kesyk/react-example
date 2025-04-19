import { Adapt } from 'common/@components/adapt'
import { TradeGateBarFeed } from 'common/@components/bar-chart/@components/chart/bar-feeds/trade-gate-bar-feed'
import {
  chartConfig,
  longPriceCurrencyPairs
} from 'common/@components/bar-chart/@components/chart/config'
import { ControlButton } from 'common/@components/bar-chart/@components/control-button'
import { Hud } from 'common/@components/bar-chart/@components/hud'
import { ChartTooltip } from 'common/@components/bar-chart/@components/tooltip'
import { T } from 'common/@components/t'
import { commonApi } from 'common/api'
import { CurrencyPair } from 'common/currencies'
import {
  LS_LAST_EXCHANGE_CHART_INTERVAL,
  secureLocalStorage
} from 'common/local-storage'
import { TradeGateFrame } from 'common/trade-gate'
import { Button } from 'common/ui/button'
import { Loader } from 'common/ui/loader'
import { Select } from 'common/ui/select'
import {
  backgroundGrid,
  Bar,
  candlestickPlot,
  ChartEngine,
  currentPriceLabel,
  defaultConfiguration,
  FChart,
  mountainsPlot,
  mouseCrosshair,
  mousePriceLabel,
  mouseTimeLabel,
  volumesPlot
} from 'fchart'
import { CrosshairData } from 'fchart/dist/chart/crosshair'
import React from 'react'
import {
  InjectedIntlProps,
  injectIntl
} from 'react-intl'
import { Subscription } from 'rxjs'
import './fchart.css'
import theme from './theme.css'

export const CHART_ID = 'chartiq-container'

const intervals: IntervalData[] = [
  { key: '1m', period: 1, interval: 'minute' },
  { key: '5m', period: 5, interval: 'minute' },
  { key: '15m', period: 15, interval: 'minute' },
  { key: '30m', period: 30, interval: 'minute' },
  { key: '1h', period: 1, interval: 'hour' },
  { key: '4h', period: 4, interval: 'hour' },
  { key: '1d', period: 1, interval: 'day' },
  { key: '1w', period: 7, interval: 'day' }
]

interface IntervalData {
  key: string
  period: number
  interval: TradeGateFrame
}

interface OwnProps {
  currencyPair: CurrencyPair
  onClose?: () => void
  minBarHeight?: number
}

type Props = OwnProps & InjectedIntlProps

interface OwnState {
  connected: boolean
  dataLoading: boolean
  interval: IntervalData
  zoomStep: number
  hudData?: Bar
  crosshairData?: CrosshairData
}


class ChartComponent extends React.Component<Props, OwnState> {
  private _chartContainer: HTMLDivElement | null = null
  private _chart!: FChart
  private _subscribeStatusTradeGate?: Subscription

  constructor(props: Props) {
    super(props)

    const intervalKey =
      secureLocalStorage.getItem(LS_LAST_EXCHANGE_CHART_INTERVAL) ||
      chartConfig.defaultInterval

    const interval =
      intervals.find(x => x.key === intervalKey) ||
      intervals.find(x => x.key === chartConfig.defaultInterval)!

    this.state = {
      dataLoading: true,
      interval,
      zoomStep: chartConfig.getDefaultZoomStep(),
      connected: commonApi.tradeGate.connected
    }
  }

  componentDidMount() {
    const {
      currencyPair,
      minBarHeight
    } = this.props
    const { interval } = this.state

    this._chart = new FChart(
      this._chartContainer!,
      new ChartEngine({
        barFeed: new TradeGateBarFeed(),
        currencyPair: currencyPair.name,
        interval: interval.interval,
        period: interval.period,
        maxBarsPerRequest: 2000
      }),
      {
        fontSizeRatio: this.getFontSizeRatio(),
        minimumBars: chartConfig.minimumBars,
        maximumBars: chartConfig.maximumBars,
        defaultAmountBars: this.calculateRange(),
        xAxisHeight: defaultConfiguration.xAxisHeight * this.getFontSizeRatio(),
        yAxisWidth: defaultConfiguration.yAxisWidth * this.getFontSizeRatio(),
        priceFormatter: this.getChartPriceFormatter,
        timeFormatter: this.getChartTimeFormatter,
        minBarHeight: minBarHeight || defaultConfiguration.minBarHeight
      }
    )

    backgroundGrid(this._chart, this._chart.mainViewGroup)

    if (!chartConfig.currenciesWithCandles.includes(currencyPair.name)) {
      volumesPlot(this._chart, this._chart.mainViewGroup)
      candlestickPlot(this._chart, this._chart.mainViewGroup, this._chart.config.minBarHeight)
    } else {
      mountainsPlot(this._chart, this._chart.mainViewGroup)
    }

    mouseCrosshair(this._chart, this._chart.mainViewGroup)
    mousePriceLabel(this._chart, this._chart.mainViewGroup, this.getChartPriceFormatter)
    mouseTimeLabel(this._chart, this._chart.mainViewGroup, this.getChartTimeFormatter)
    currentPriceLabel(this._chart, this._chart.mainViewGroup)

    // subscribe to data
    this._chart.engine.addListener('loadingInitialBars', () => {
      this.setState({
        hudData: undefined,
        dataLoading: true
      })
    })

    this._chart.engine.addListener('initialBarsLoaded', () => {
      this.setState({
        hudData: this._chart.engine.bars.last(),
        dataLoading: false
      })
    })

    this._chart.engine.addListener('barAdded', () =>
      this.setState({ hudData: this._chart.engine.bars.last() })
    )

    this._chart.engine.addListener('barUpdated', () =>
      this.setState({ hudData: this._chart.engine.bars.last() })
    )

    this._subscribeStatusTradeGate = commonApi.tradeGate.statusStream.subscribe(
      status => {
        switch (status) {
          case 'onConnected':
            this._chart.engine.loadInitialBars()
            this.setState({ connected: true })
            break

          case 'onDisconnected':
            this.setState({ connected: false })
            break
        }
      }
    )
  }

  componentWillUnmount() {
    if (this._subscribeStatusTradeGate) {
      this._subscribeStatusTradeGate.unsubscribe()
      this._subscribeStatusTradeGate = undefined
    }

    this._chart.destroy()

    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { hudData, interval, dataLoading, zoomStep, connected } = this.state
    const { onClose, currencyPair } = this.props

    return (
      <div className={theme.chartContainerWrap}>
        <Loader className={theme.loader} loading={dataLoading || !connected}/>

        <div className={theme.topControls}>
          <Adapt to="desktop">
            <div className={theme.buttons}>
              {intervals.map((x, index) => (
                <ControlButton
                  key={index}
                  active={x.key === interval.key}
                  onClick={() => this.clickChangePeriod(x)}
                >
                  {x.key}
                </ControlButton>
              ))}
            </div>
          </Adapt>

          <Adapt to="mobile">
            <div>
              <Select
                data={intervals.map(x => ({ id: x.key, name: x.key }))}
                theme={{
                  wrapper: theme.wrapper,
                  select: theme.select,
                  item: theme.item,
                  selectedItem: theme.selectedItem,
                  dropdown: theme.dropdown,
                  isActive: theme.isActive
                }}
                value={interval.key}
                onChange={id =>
                  this.clickChangePeriod(
                    intervals.find(item => item.key === id)!
                  )
                }
              />
            </div>
          </Adapt>

          <div className={theme.zoomBtn}>
            <ControlButton
              onClick={this.resetZoom}
              typeIcon="autoZoom"
              className={theme.btn}
            />

            <ControlButton
              disabled={zoomStep >= chartConfig.zoomSteps}
              onClick={this.clickZoomOut}
              typeIcon="zoomOut"
              className={theme.btn}
            />

            <ControlButton
              disabled={zoomStep <= 0}
              onClick={this.clickZoomIn}
              typeIcon="zoomIn"
              className={theme.btn}
            />

            <ControlButton
              onClick={this.clickHome}
              typeIcon="home"
              className={theme.btn}
            />
          </div>
        </div>

        {hudData && (
          <Hud
            data={hudData}
            currencyPair={currencyPair}
            intervalLabel={interval.key}
          />
        )}

        <div
          id={CHART_ID}
          ref={ref => (this._chartContainer = ref)}
          className={theme.chartContainer}
        >
          <Adapt to="desktop">
            {this._chart ? (
              <ChartTooltip chart={this._chart} currencyPair={currencyPair}/>
            ) : null}
          </Adapt>
        </div>

        <Adapt to="mobile">
          <Button className={theme.btnClose} mobileWide onClick={onClose}>
            <T id="common.chart.btn.close"/>
          </Button>
        </Adapt>
      </div>
    )
  }

  private readonly clickChangePeriod = (interval: IntervalData) => {
    this.setState({ interval }, () => {
      this._chart.setPeriod(interval.interval, interval.period)

      secureLocalStorage.setItem(LS_LAST_EXCHANGE_CHART_INTERVAL, interval.key)
    })
  }

  private readonly resetZoom = () => {
    this.setState(
      () => ({ zoomStep: chartConfig.getDefaultZoomStep() }),
      () => this._chart.setRange(this.calculateRange())
    )
  }

  private readonly clickZoomOut = () => {
    this.setState(
      ({ zoomStep }) => ({ zoomStep: zoomStep + 1 }),
      () => this._chart.setRange(this.calculateRange())
    )
  }

  private readonly clickZoomIn = () => {
    this.setState(
      ({ zoomStep }) => ({ zoomStep: zoomStep - 1 }),
      () => this._chart.setRange(this.calculateRange())
    )
  }

  private readonly clickHome = () => {
    this._chart.goToEnd()
  }

  private readonly calculateRange = (): number => {
    const { minimumBars, maximumBars, zoomSteps } = chartConfig
    const delta = (maximumBars - minimumBars) / zoomSteps
    return Math.max(minimumBars + delta * this.state.zoomStep, minimumBars)
  }

  private readonly getFontSizeRatio = () => {
    const htmlEl = document.documentElement
    const htmlFontSize = parseInt(getComputedStyle(htmlEl).fontSize!, 10)
    /**
     * 10 - its default font-size with html 62.5%
     * ~1.2 viewport ratio in account
     */
    const ratio = htmlFontSize / 10
    return ratio !== 1 ? ratio * 1.2 : ratio
  }

  private readonly getChartTimeFormatter = (value: Date): string => {
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

  private readonly getChartPriceFormatter = (value: number): string => {
    const { formatNumber } = this.props.intl
    const fractionDigits = longPriceCurrencyPairs.includes(this.props.currencyPair.name) ? 2 : 5

    return formatNumber(
      value,
      {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        useGrouping: true
      })
  }
}

export const Chart = injectIntl(ChartComponent)
