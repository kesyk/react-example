export abstract class BaseError {}

interface MyError {
  error: any
}

export function isError(error: any): error is MyError {
  return (error as MyError).error !== undefined
}
