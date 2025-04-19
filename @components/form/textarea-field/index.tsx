import cn from 'classnames'
import { ErrorIcon } from 'common/ui/form/error-icon'
import { FieldPopover } from 'common/ui/form/field-popover'
import { mergeTheme } from 'common/utils/theme'
import { FieldComponent, FieldData } from 'forms-builder/dist'
import React from 'react'
import baseTheme from './theme.css'

interface OwnProps {
  label?: React.ReactNode
  maxLength?: number
  theme?: Partial<{
    wrapper: string
    textarea: string
  }>
  readOnly?: boolean
}

type ComponentProps = OwnProps & FieldData

interface State {
  focused: boolean
}

export interface TextareaField extends FieldComponent {}
export class TextareaField extends React.Component<ComponentProps, State>
  implements FieldComponent {
  private readonly _theme: any

  private _textareaRef!: HTMLTextAreaElement

  constructor(props: ComponentProps) {
    super(props)
    this.state = {
      focused: false
    }

    this._theme = mergeTheme(baseTheme, this.props.theme)
  }

  focus() {
    if (this._textareaRef) {
      this._textareaRef.focus()
      return true
    }

    return false
  }

  render() {
    const {
      error,
      warn,
      onChange,
      onFocus,
      onBlur,
      value,
      label,
      maxLength
    } = this.props
    const { focused } = this.state

    return (
      <FieldPopover
        focused={focused}
        field={this.props}
        className={this._theme.wrapper}
      >
        {label && !value && <div className={this._theme.label}>{label}</div>}
        <textarea
          ref={r => (this._textareaRef = r!)}
          maxLength={maxLength}
          value={value != null ? value : ''}
          onChange={e => onChange(e.currentTarget.value)}
          onFocus={() => {
            this.setState({ focused: true })

            if (onFocus) onFocus()
          }}
          onBlur={() => {
            this.setState({ focused: false })

            if (onBlur) onBlur()
          }}
          className={cn(this._theme.textarea, {
            [this._theme.hasError]: error != null,
            [this._theme.hasWarn]: error == null && warn != null
          })}
          readOnly={this.props.readOnly}
        />
        <ErrorIcon
          focused={focused}
          field={this.props}
          className={this._theme.errorIcon}
        />
      </FieldPopover>
    )
  }

  componentDidMount() {
    this.resize()
  }

  componentDidUpdate() {
    this.resize()
  }

  private readonly resize = () => {
    this._textareaRef.style.height = '1px'
    this._textareaRef.style.height = `calc(.2rem + ${
      this._textareaRef.scrollHeight
    }px)`
  }
}
