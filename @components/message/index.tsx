import cn from 'classnames'
import { ThemeProps, withTheme } from 'common/utils/theme'
import React from 'react'
import baseTheme from './theme.css'

export const enum MessageType {
  Error,
  Processing,
  Info,
  Success
}

interface OwnProps {
  title?: React.ReactNode
  type: MessageType
  children: React.ReactNode
}

interface Theme {
  message: string
  isError: string
  isProcessing: string
  isInfo: string
  isSuccess: string
  iconWrapper: string
  icon: string
  content: string
  title: string
  text: string
}

type ComponentProps = OwnProps & ThemeProps<Theme>

class MessageComponent extends React.PureComponent<ComponentProps> {
  render() {
    const { title, type, theme } = this.props
    return (
      <div
        className={cn(theme.message, {
          [theme.isError]: type === MessageType.Error,
          [theme.isProcessing]: type === MessageType.Processing,
          [theme.isInfo]: type === MessageType.Info,
          [theme.isSuccess]: type === MessageType.Success
        })}
      >
        <div className={theme.iconWrapper}>
          <div className={theme.icon} />
        </div>
        <div className={theme.content}>
          {title && <div className={theme.title}>{title}</div>}
          <div className={theme.text}>{this.props.children}</div>
        </div>
      </div>
    )
  }
}

// tslint:disable-next-line:variable-name
export const Message = withTheme<Theme>(baseTheme)(MessageComponent)
