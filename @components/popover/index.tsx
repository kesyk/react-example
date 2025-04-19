import cn from 'classnames'
import { FadeAnimation } from 'common/ui/animation/fade'
import { mergeTheme } from 'common/utils/theme'
import React from 'react'
import baseTheme from './theme.css'

export type PopoverAlignment =
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export interface PopoverTheme {
  wrapper: string
  popover: string
  isWarn: string
  isInfo: string
}

interface OwnProps {
  show: boolean | undefined
  content: React.ReactNode
  warn?: boolean
  info?: boolean
  className?: string
  align?: PopoverAlignment
  theme?: Partial<PopoverTheme>
  allowAnimation?: boolean
}

interface State {
  theme: { [key: string]: string }
  cn: string
  props?: OwnProps
}

export class Popover extends React.Component<OwnProps, State> {
  static getDerivedStateFromProps: React.GetDerivedStateFromProps<
    OwnProps,
    State
  > = (nextProps, prevState) => {
    const nextState: Partial<State> = {
      props: nextProps
    }

    if (!prevState.props || nextProps.theme !== prevState.props.theme) {
      nextState.theme = mergeTheme(baseTheme, nextProps.theme)
    }

    if (!prevState.props || nextProps.align !== prevState.props.align) {
      nextState.cn = Popover.buildClassName(
        nextState.theme || prevState.theme,
        nextProps.align
      )
    }

    return nextState
  }

  private static readonly buildClassName = (
    theme: { [key: string]: string },
    align?: PopoverAlignment
  ) => {
    if (!align) align = 'bottom-right'

    return cn(baseTheme.wrapper, {
      [theme.isTop]: align === 'top-left' || align === 'top-right',
      [theme.isToTop]: align === 'left-top' || align === 'right-top',

      [theme.isBottom]: align === 'bottom-left' || align === 'bottom-right',
      [theme.isToBottom]: align === 'left-bottom' || align === 'right-bottom',

      [theme.isLeft]: align === 'left-top' || align === 'left-bottom',
      [theme.isToLeft]: align === 'top-left' || align === 'bottom-left',

      [theme.isRight]: align === 'right-top' || align === 'right-bottom',
      [theme.isToRight]: align === 'top-right' || align === 'bottom-right'
    })
  }

  constructor(props: OwnProps) {
    super(props)
    // tslint:disable-next-line:no-object-literal-type-assertion
    this.state = {
      theme: baseTheme,
      cn: ''
    }
  }

  render() {
    const {
      show,
      warn,
      info,
      children,
      allowAnimation,
      content,
      className
    } = this.props
    const { theme, cn: _cn } = this.state

    return (
      <div
        className={cn(_cn, className, {
          [theme.isWarn]: warn,
          [theme.isInfo]: info
        })}
      >
        {children}
        {allowAnimation ? (
          <FadeAnimation show={show}>
            {({ opacity, y }) => (
              <div
                className={theme.popover}
                style={{
                  opacity,
                  transform: `translateY(${y / 2}rem)`
                }}
              >
                {content}
              </div>
            )}
          </FadeAnimation>
        ) : (
          show && <div className={theme.popover}>{content}</div>
        )}
      </div>
    )
  }
}
