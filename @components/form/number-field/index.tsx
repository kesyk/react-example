import { TextField, TextFieldTheme } from 'common/ui/form/text-field'
import { FieldData } from 'forms-builder/dist'
import React from 'react'

type FormatNumber = 'bb' | 'decimal' | 'usd' | 'usd-with-dot' | 'int'

interface OwnProps {
  label?: React.ReactNode
  info?: React.ReactNode
  format: FormatNumber
  theme?: Partial<TextFieldTheme>
}

type ComponentProps = OwnProps & FieldData<number>

interface State {
  value?: string
}

const checkFormat = (value: string, format: FormatNumber) => {
  switch (format) {
    case 'bb':
      return /^[+-]?\d+([\.\,]\d{0,8})?$/.test(value)

    case 'decimal':
      return /^[+-]?\d+([\.\,]\d{0,2})?$/.test(value)

    case 'usd':
      return /^\d{0,8}$/.test(value)

    case 'usd-with-dot':
      return /^\d{0,8}([\.\,]\d{0,2})?$/.test(value)

    case 'int':
      return /^\d+$/.test(value)

    default:
      throw new TypeError(`Unexpected number format: ${format}`)
  }
}

export class NumberField extends React.Component<ComponentProps, State> {
  private _value!: string | undefined
  // private _selectionStart!: number
  // private _selectionEnd!: number

  constructor(props: ComponentProps) {
    super(props)

    this.state = {}
  }

  render() {
    const { format, value, ...rest } = this.props

    return (
      <TextField
        {...rest}
        value={this._value ? this._value : value ? value.toString() : undefined}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        theme={this.props.theme}
      />
    )
  }

  private readonly onKeyDown = () => {
    // this._selectionStart = e.currentTarget.selectionStart || 0
    // this._selectionEnd = e.currentTarget.selectionEnd || 0
  }

  private readonly onChange = (value: string | undefined) => {
    let returnValue: number | undefined

    if (value && !/^\d{1,8}((\.|\,)\d{0,8})?$/.test(value)) {
      return
    }

    if (value) {
      returnValue = parseFloat(value.replace(',', '.'))

      if (!checkFormat(value, this.props.format) && value !== '') {
        // TODO:
        // setTimeout(() => target.setSelectionRange(this._selectionStart, this._selectionEnd), 0)

        return
      }
    }

    this._value = value
    this.props.onChange(returnValue || 0)
  }
}
