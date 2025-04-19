import cn from 'classnames'
import { FadeAnimation } from 'common/ui/animation/fade'
import React from 'react'
import theme from './theme.css'

export const enum ModalType {
  Info = 1,
  Warn = 2,
  Time = 3,
  Error = 4,
  Custom = 5
}

export interface ModalProps {
  header?: React.ReactNode
  title?: React.ReactNode
  children: React.ReactNode
  ok?: React.ReactNode
  cancel?: React.ReactNode
  wrap?: (children: React.ReactNode) => React.ReactNode
  onClose?: () => void
}

interface OwnProps {
  type: ModalType
  show: boolean | undefined
}

export type ComponentProps = ModalProps & OwnProps

export class Modal extends React.PureComponent<ComponentProps> {
  componentDidUpdate(nextProps: ComponentProps) {
    try {
      if (this.props.show !== nextProps.show) {
        document.body.style.overflow = this.props.show ? 'hidden' : 'inherit'
        ;(document.activeElement as HTMLElement).blur()
      }
    } catch {}
  }

  render() {
    const { header, title, show, wrap, type, onClose } = this.props

    return (
      <FadeAnimation show={show}>
        {({ opacity, y }) => (
          <>
            <div className={theme.backdrop} style={{ opacity }} />
            <div
              className={cn(theme.wrapper, {
                [theme.isError]: type === ModalType.Error,
                [theme.isWarn]: type === ModalType.Warn,
                [theme.isInfo]: type === ModalType.Info,
                [theme.isTime]: type === ModalType.Time,
                [theme.isCustom]: type === ModalType.Custom
              })}
            >
              <div
                className={theme.modal}
                style={{ opacity, transform: `translateY(${y + 10}rem)` }}
              >
                <div className={theme.header}>
                  <div className={theme.top}>{header}</div>
                  <div className={theme.title}>{title}</div>
                  <div className={theme.close} onClick={onClose} />
                  <div className={theme.icon} />
                </div>
                {wrap ? wrap(this.renderBody()) : this.renderBody()}
              </div>
            </div>
          </>
        )}
      </FadeAnimation>
    )
  }

  private renderBody() {
    return (
      <>
        <div className={theme.content}>{this.props.children}</div>
        <div className={theme.actions}>
          <div
            className={cn(theme.okBtn, !this.props.cancel && theme.okBtnCenter)}
          >
            {this.props.ok}
          </div>
          {this.props.cancel && (
            <div className={theme.cancelBtn}>{this.props.cancel}</div>
          )}
        </div>
      </>
    )
  }
}
