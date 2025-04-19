import ReactDOM from 'react-dom'
import { TransformableError } from 'common/utils/forms-helper'

export const addPlusToTelephoneNumber = (numberPhone: string) =>
  /^[0-9]+$/.test(numberPhone) ? `+${numberPhone}` : numberPhone

const MAX_FILENAME = 64
const MAX_FILESIZE = 3 // Mb
export const ALLOWED_EXTS = ['jpg', 'jpeg', 'png']
export const FORMAT_VALUE_MAX_FILESIZE = MAX_FILESIZE + ' Mb'
export const FORMAT_VALUE_ALLOWED_EXTS = ALLOWED_EXTS.join(', ')

export const validateFileName = (
  value: File,
  maxFilename: number = MAX_FILENAME
): TransformableError => {
  return value.name.length > MAX_FILENAME
    ? { id: 'file-name-length', values: { count: maxFilename } }
    : undefined
}

export const validateFileExt = (
  value: File,
  allowedExts: string[] = ALLOWED_EXTS
): TransformableError => {
  const ext = value.name.substr(value.name.lastIndexOf('.') + 1).toLowerCase()
  return !allowedExts.some(allowedExt => allowedExt === ext)
    ? { id: 'file-extension', values: { exts: allowedExts.join(', ') } }
    : undefined
}

export const validateFileSize = (
  value: File,
  maxFileSize: number = MAX_FILESIZE
): TransformableError => {
  return value.size > maxFileSize * 1024 * 1024
    ? { id: 'file-size', values: { size: maxFileSize + ' Mb' } }
    : undefined
}
export const validateFile = (value: File): TransformableError =>
  validateFileName(value) || validateFileExt(value) || validateFileSize(value)

export const documentContains = (
  el: HTMLElement | null | undefined,
  e: Event
) => (el ? ReactDOM.findDOMNode(el)!.contains(e.target as Node) : undefined)
