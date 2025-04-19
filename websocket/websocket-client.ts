import { ConnectionWebSocketError } from 'common/websocket/errors/connection-error'
import { Subject } from 'rxjs'
export type WebSocketStatus =
  | 'onConnected'
  | 'firstTimeConnected'
  | 'onDisconnected'
  | 'onReconnected'

export class WebSocketClient<TMessage = {}> {
  public connected: boolean
  public readonly messageStream: Subject<TMessage> = new Subject()
  public readonly statusStream: Subject<WebSocketStatus> = new Subject()

  private url: string
  private autoReconnectInterval: number
  private hasAlreadyBeenConnected: boolean
  private instance?: WebSocket

  constructor(
    url: string,
    autoReconnectInterval: number = 3 * 1000,
    connect: boolean = true
  ) {
    this.connected = false

    this.url = url
    this.autoReconnectInterval = autoReconnectInterval
    this.hasAlreadyBeenConnected = false

    if (connect) this.connect()
  }

  public send = (data: TMessage) => {
    if (!this.connected || !this.instance) throw new ConnectionWebSocketError()

    this.instance.send(JSON.stringify(data))
  }

  private connect = () => {
    if (this.connected) throw new Error('Already connected')

    this.instance = new WebSocket(this.url)

    this.instance.onmessage = (e: MessageEvent) => {
      try {
        const message = JSON.parse(e.data) as TMessage
        if (message) this.messageStream.next(message)
      } catch (ex) {
        console.error(ex)
      }
    }

    this.instance.onopen = () => {
      this.connected = true

      this.statusStream.next('onConnected')

      if (this.hasAlreadyBeenConnected) {
        this.statusStream.next('onReconnected')
      } else {
        this.statusStream.next('firstTimeConnected')
      }

      this.hasAlreadyBeenConnected = true
    }

    this.instance.onclose = e => {
      if (this.connected) {
        this.connected = false
        this.statusStream.next('onDisconnected')
      }

      if (e.code !== 1000) {
        this.reconnect()
      }
    }
  }

  private reconnect = () => {
    setTimeout(() => this.connect(), this.autoReconnectInterval)
  }
}
