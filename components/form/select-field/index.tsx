import cn from 'classnames'
import { ErrorIcon } from 'common/ui/form/error-icon'
import { FieldPopover } from 'common/ui/form/field-popover'
import { PopoverAlignment } from 'common/ui/popover'
import { Select, SelectThemeProps } from 'common/ui/select'
import { mergeTheme } from 'common/utils/theme'
import { FieldComponent, FieldData } from 'forms-builder/dist'
import React from 'react'
import baseTheme from './theme.css'

interface OwnProps extends SelectThemeProps {
  popoverAlign?: PopoverAlignment
  data: {
    id: string
    name: React.ReactNode
  }[]
  hasFilter?: boolean
  maxWidth?: string | number
}

interface State {
  open: boolean
}

export type SelectFieldProps = OwnProps & FieldData<string>

export interface SelectField extends FieldComponent {}
export class SelectField extends React.Component<SelectFieldProps, State>
  implements FieldComponent {
  private readonly _selectRef = React.createRef<Select>()

  constructor(props: SelectFieldProps) {
    super(props)
    this.state = { open: false }
  }

  focus() {
    if (this._selectRef.current) {
      this._selectRef.current.focus()
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
    const { popoverAlign, theme: _theme, ...rest } = this.props
    const theme = mergeTheme(baseTheme, _theme)
    const { open } = this.state

    return (
      <FieldPopover
        focused={open}
        field={this.props}
        className={cn({
          [baseTheme.hasError]: rest.error != null,
          [baseTheme.hasWarn]: rest.error == null && rest.warn != null
        })}
        align={popoverAlign || 'top-right'}
      >
        <Select
          {...rest}
          ref={this._selectRef}
          theme={theme}
          onOpen={() => this.setState({ open: true })}
          onClose={() => this.setState({ open: false })}
        />
        <ErrorIcon
          focused={open}
          field={this.props}
          className={theme.errorIcon}
        />
      </FieldPopover>
    )
  }
}
