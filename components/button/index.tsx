import cn from 'classnames'
import React from 'react'
import theme from './theme.css'

export interface ButtonProps {
  style?:
    | 'primary'
    | 'cancel'
    | 'ok'
    | 'ok-support'
    | 'none'
    | 'ok-with-border'
    | 'primary-with-border'
    | 'warn'
  type?: 'submit'
  disabled?: boolean
  className?: string
  onClick?: (e: React.SyntheticEvent<any>) => void
  onFocus?: (e: React.SyntheticEvent<any>) => void
  onBlur?: (e: React.SyntheticEvent<any>) => void
  pressed?: boolean

  /**
   * 100% width & extended height
   */
  mobileWide?: boolean
  checked?: boolean
}

export class Button extends React.PureComponent<ButtonProps> {
  render() {
    return (
      <button
        type={this.props.type === 'submit' ? 'submit' : 'button'}
        disabled={this.props.disabled}
        className={cn(
          theme.btn,
          this.props.className,
          {
            [theme.isPressed]: this.props.pressed,
            [theme.mq100]: this.props.mobileWide,
            [theme.isChecked]: this.props.checked
          },
          (() => {
            switch (this.props.style) {
              case 'ok':
                return theme.isOk

              case 'ok-support':
                return theme.isOkSupport

              case 'ok-with-border':
                return theme.isOkBorder

              case 'primary-with-border':
                return theme.isPrimaryBorder

              case 'cancel':
                return theme.isCancel

              case 'warn':
                return theme.isWarn

              case 'none':
                return undefined

              case 'primary':
              default:
                return theme.isPrimary
            }
          })()
        )}
        onClick={this.props.onClick}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
      >
        {this.props.children}
      </button>
    )
  }
}
