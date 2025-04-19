import { WebSocketError } from 'common/websocket/errors/websocket-error'

export class ConnectionWebSocketError extends WebSocketError {
  get code() {
    return 'ConnectionError'
  }
}
