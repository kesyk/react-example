import cn from 'classnames'
import React from 'react'
import theme from './theme.css'

interface OwnProps {
  type?: 'submit'
  disabled?: boolean
  active?: boolean
  className?: string
  onClick?: (e: React.SyntheticEvent<any>) => void
  onFocus?: (e: React.SyntheticEvent<any>) => void
  onBlur?: (e: React.SyntheticEvent<any>) => void
  typeIcon?: 'zoomIn' | 'zoomOut' | 'home' | 'autoZoom'
}

export class ControlButton extends React.PureComponent<OwnProps> {
  render() {
    const {
      active,
      disabled,
      className,
      onBlur,
      children,
      onClick,
      type,
      onFocus,
      typeIcon
    } = this.props

    return (
      <button
        type={type === 'submit' ? 'submit' : 'button'}
        disabled={disabled}
        className={cn(theme.btn, className, {
          [theme.active]: active
        })}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {typeIcon && (
          <div
            className={cn(theme.icon, {
              [theme.zoomOut]: typeIcon === 'zoomOut',
              [theme.zoomIn]: typeIcon === 'zoomIn',
              [theme.home]: typeIcon === 'home',
              [theme.autoZoom]: typeIcon === 'autoZoom'
            })}
          />
        )}
        {children}
      </button>
    )
  }
}
