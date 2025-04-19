import { BaseError } from 'common/utils/base-error'

export abstract class WebSocketError extends BaseError {
  abstract code: string
}
