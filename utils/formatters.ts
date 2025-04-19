export const convertToNumber = (value: string) =>
  value ? parseFloat(value.toString().replace(',', '.')) : 0

export const getNumberDelimiter = (lang: string) =>
  new Intl.NumberFormat(lang).format(0.1).replace(/\d/g, '')

export const MIN_DISPLAY_FRACTION = 2

export const convertToString = (lang: string, value: number) =>
  new Intl.NumberFormat(lang, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8
  }).format(value)