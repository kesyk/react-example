import cn from 'classnames'
import { mergeTheme } from 'common/utils/theme'
import { FieldData } from 'forms-builder/dist'
import React from 'react'
import baseTheme from './theme.css'

interface OwnProps {
  label: React.ReactNode
  compareValue: any
  theme?: Partial<{
    radio: string
    isChecked: string
    isFocused: string
    label: string
  }>
}

type ComponentProps = OwnProps & FieldData

interface State {
  focused: boolean
}

export class RadioField extends React.Component<ComponentProps, State> {
  private _radio!: HTMLInputElement | null
  private readonly _theme: any

  constructor(props: ComponentProps) {
    super(props)
    this.state = {
      focused: false
    }
    this._theme = mergeTheme(baseTheme, this.props.theme)
  }

  render() {
    const {
      name,
      onChange,
      onFocus,
      onBlur,
      value,
      label,
      compareValue
    } = this.props
    const { focused } = this.state
    const checked = value === compareValue

    return (
      <div
        className={cn(this._theme.radio, {
          [this._theme.isFocused]: focused,
          [this._theme.isChecked]: checked
        })}
        onClick={() => {
          if (this._radio) this._radio.focus()

          onChange(compareValue)
        }}
      >
        <input
          ref={r => (this._radio = r)}
          type="radio"
          name={name}
          onFocus={() => {
            this.setState({ focused: true })

            if (onFocus) onFocus()
          }}
          onBlur={() => {
            this.setState({ focused: false })

            if (onBlur) onBlur()
          }}
          onChange={() => onChange(compareValue)}
          checked={checked}
          className={this._theme.input}
        />
        <div className={this._theme.icon} />
        <div className={this._theme.label}>{label}</div>
      </div>
    )
  }
}
