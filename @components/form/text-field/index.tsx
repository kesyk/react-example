import cn from 'classnames'
import { ErrorIcon } from 'common/ui/form/error-icon'
import { FieldPopover } from 'common/ui/form/field-popover'
import { InfoIcon, InfoIconType } from 'common/ui/info-icon'
import { PopoverAlignment } from 'common/ui/popover'
import { ThemeProps, withTheme } from 'common/utils/theme'
import { FieldComponent, FieldData } from 'forms-builder/dist'
import React from 'react'
import baseTheme from './theme.css'

type TextFieldFormat = 'digits'

export interface TextFieldTheme {
  input: string
  wrapper: string
  errorIcon: string
  passIcon: string
  label: string
  popover: string
  info: string
}

interface OwnProps {
  label?: React.ReactNode
  info?: React.ReactNode
  type?: 'password' | 'fake-password'
  maxLength?: number
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  format?: TextFieldFormat | ((value: string) => boolean)
  disabled?: boolean
  autoComplete?: 'new-password' | 'off'
  autoFocus?: boolean
  customIcon?: boolean
  icon?: React.ReactNode
  readOnly?: boolean
  interactive?: boolean
  passIcon?: boolean
  errorAlign?: PopoverAlignment
  infoIconType?: InfoIconType
}

type ComponentProps = OwnProps & FieldData<string> & ThemeProps<TextFieldTheme>

interface State {
  focused: boolean
  showPass: boolean
  isViewed: boolean
  isHided: boolean
  focusedCount: number
}

const checkers: { [key in TextFieldFormat]: ((value: string) => boolean) } = {
  digits: value => /^\d*$/.test(value)
}

export interface TextField extends FieldComponent {}
class TextFieldComponent extends React.Component<ComponentProps, State>
  implements FieldComponent {
  private readonly _inputRef = React.createRef<HTMLInputElement>()
  private _selectionStart!: number
  private _selectionEnd!: number

  constructor(props: ComponentProps) {
    super(props)
    this.state = {
      focused: false,
      showPass: false,
      isViewed: false,
      isHided: false,
      focusedCount: 0
    }
  }

  focus() {
    if (this._inputRef.current) {
      this._inputRef.current.focus()
      return true
    }

    return false
  }

  componentDidMount() {
    this.props.fieldRef(this)
  }

  componentWillUnmount() {
    this.props.fieldRef(null)
  }

  render() {
    const {
      type,
      info,
      error,
      warn,
      value,
      label,
      icon,
      theme,
      interactive,
      name,
      infoIconType,
      maxLength,
      errorAlign,
      disabled,
      readOnly
    } = this.props

    const { isViewed, isHided, focused, showPass } = this.state

    return (
      <FieldPopover
        align={errorAlign}
        focused={focused}
        field={this.props}
        isViewed={isViewed}
        isHided={isHided}
        hasPass={this.props.type === 'password'}
        className={cn(theme.wrapper, {
          [baseTheme.isFocused]: focused,
          [baseTheme.hasValue]: !!value
        })}
        setFocus={this.setFocus}
        interactive={interactive}
        theme={{
          popover: theme.popover
        }}
      >

        <input
          key={`${showPass}`}
          autoComplete={this.props.autoComplete}
          name={name}
          ref={this._inputRef}
          value={value != null ? value : ''}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          readOnly={readOnly}
          type={(!showPass && type === 'password' && 'password') || 'text'}
          className={cn(theme.input, {
            [baseTheme.hasError]: error != null,
            [baseTheme.hasWarn]:
              error == null && warn != null && !isHided && !isViewed,
            [baseTheme.isPass]: type === 'fake-password' && !showPass
          })}
          maxLength={maxLength}
          disabled={disabled}
        />
        {label && <div className={theme.label}>{label}</div>}

        <ErrorIcon
          focused={focused}
          isViewed={isViewed}
          isHided={isHided}
          field={this.props}
          className={cn(theme.errorIcon, {
            [baseTheme.hasOtherIcon]: (type || icon) && !info
          })}
        />

        {type && (
          <div
            className={cn(theme.passIcon, {
              [baseTheme.disabled]: showPass,
              [baseTheme.hasOtherIcon]: info
            })}
            onClick={this.setPassView}
          />
        )}
        {info &&
        !(error || warn) && ( // @see !ErrorIcon
            <InfoIcon
              children={info}
              className={theme.info}
              icon={infoIconType || 'grey'}
            />
          )}

        {icon && <div>{icon}</div>}
      </FieldPopover>
    )
  }

  private setPassView = () =>
    this.setState(({ showPass }) => ({ showPass: !showPass }))

  private readonly onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this._selectionStart = e.currentTarget.selectionStart || 0
    this._selectionEnd = e.currentTarget.selectionEnd || 0

    if (this.props.onKeyDown) this.props.onKeyDown(e)
  }

  private readonly onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget
    const value = e.currentTarget.value
    const { format } = this.props

    if (format) {
      const check = typeof format === 'string' ? checkers[format] : format

      if (!check(value) && value !== '') {
        setTimeout(
          () =>
            target.setSelectionRange(this._selectionStart, this._selectionEnd),
          0
        )
        return
      }
    }

    this.props.onChange(
      this.props.maxLength && value.length > this.props.maxLength
        ? value.substring(0, this.props.maxLength)
        : value
    )
  }

  private readonly onFocus = () => {
    this.setState({ focused: true })

    if (this.props.onFocus) {
      this.props.onFocus()
      this.setStateWarnOnFocus()
    }
  }

  private setStateWarnOnFocus() {
    const { focusedCount, isViewed } = this.state

    if (focusedCount === 1 && !isViewed) {
      this.setState({ focusedCount: 0 })
    }
  }

  private readonly onBlur = () => {
    const { onBlur, interactive } = this.props

    if (!interactive) {
      this.setState({ focused: false })

      if (onBlur) {
        onBlur()
        this.setStateWarnOnBlur()
      }
    }
  }

  private setStateWarnOnBlur() {
    const { warn, error } = this.props
    const { focusedCount } = this.state

    if (warn !== null && focusedCount < 3)
      this.setState(({ // tslint:disable-next-line:no-shadowed-variable
        focusedCount }) => ({
        focusedCount: ++focusedCount,
        isViewed: focusedCount === 1 && warn != null && error == null,
        isHided: focusedCount > 1 && warn != null && error == null
      }))
  }

  private setFocus = () => {
    this.setState({ focused: false })
  }
}

// tslint:disable-next-line:variable-name
export const TextField = withTheme<TextFieldTheme>(baseTheme)(
  TextFieldComponent
)
