import { commonApi } from 'common/api'
import { AllowedCurrencyPair } from 'common/currencies'
import { TradeGateBars, TradeGateFrame } from 'common/trade-gate'
import { Bar, BarFeed, BarFeedParams } from 'fchart'
import { Subscription } from 'rxjs'

const convertToBars = (
  data: TradeGateBars | undefined,
  frame: TradeGateFrame
): Bar[] => {
  if (!data || !data.bars[frame]) return []

  return data.bars[frame].map(x => ({
    time: x[0],
    open: x[1],
    close: x[2],
    low: x[3],
    high: x[4],
    volume: x[5]
  }))
}

export class TradeGateBarFeed implements BarFeed {
  private _subscriptionTradeGateBars?: Subscription
  private _subscriptionFetchInitialData?: Subscription
  private _subscriptionFetchPaginationData?: Subscription

  public loadInitialBars(
    params: BarFeedParams,
    callback: (data: Bar[]) => void
  ) {
    if (this._subscriptionFetchInitialData) {
      this._subscriptionFetchInitialData.unsubscribe()
    }

    this._subscriptionFetchInitialData = commonApi.tradeGate
      .getBars(
        params.currencyPair as AllowedCurrencyPair,
        params.interval,
        params.from,
        params.to
      )
      .subscribe({
        next: data => callback(convertToBars(data.p, params.interval)),
        error: error => console.log('ERROR', error)
      })
  }

  public loadHistoricalBars(
    params: BarFeedParams,
    callback: (data: Bar[]) => void
  ) {
    if (this._subscriptionFetchPaginationData) {
      this._subscriptionFetchPaginationData.unsubscribe()
    }

    this._subscriptionFetchPaginationData = commonApi.tradeGate
      .getBars(
        params.currencyPair as AllowedCurrencyPair,
        params.interval,
        params.from,
        params.to
      )
      .subscribe({
        next: data => callback(convertToBars(data.p, params.interval)),
        error: error => console.log('ERROR', error)
      })
  }

  public subscribe(params: BarFeedParams, callback: (data: Bar) => void) {
    this._subscriptionTradeGateBars = commonApi.tradeGate
      .getBarsStream([params.currencyPair as AllowedCurrencyPair])
      .subscribe(data => {
        const bars = convertToBars(data, params.interval)

        if (bars.length > 0) {
          callback(bars[0])
        }
      })
  }

  public unsubscribe() {
    this.unsubscribeFromAll()
  }

  public destroy() {
    this.unsubscribeFromAll()
  }

  private unsubscribeFromAll() {
    if (this._subscriptionFetchInitialData) {
      this._subscriptionFetchInitialData.unsubscribe()
      this._subscriptionFetchInitialData = undefined
    }

    if (this._subscriptionFetchPaginationData) {
      this._subscriptionFetchPaginationData.unsubscribe()
      this._subscriptionFetchPaginationData = undefined
    }
    if (this._subscriptionTradeGateBars) {
      this._subscriptionTradeGateBars.unsubscribe()
      this._subscriptionTradeGateBars = undefined
    }
  }
}
