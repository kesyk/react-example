import { easeCubicOut } from 'd3-ease'
import React from 'react'
import { Animate } from 'react-move'

interface OwnProps {
  children: React.ReactNode
}

export class SlideAnimation extends React.Component<OwnProps> {
  private _show: boolean
  private _wrap: HTMLDivElement | null = null
  private _oldHtml: string = ''
  private _size: number = 0

  constructor(props: OwnProps) {
    super(props)

    this._show = !!props.children
  }

  shouldComponentUpdate(nextProps: OwnProps) {
    this._show = !!nextProps.children

    if (!this._show) {
      // We needs to preserve current markup to show smooth
      // animation without child component mutations
      this._oldHtml = this._wrap!.innerHTML
    }

    return this.props.children !== nextProps.children
  }

  componentDidUpdate() {
    if (this.props.children) {
      // Calculate real height
      this._size = this._wrap!.scrollHeight
    }
  }

  render() {
    return (
      <Animate
        start={{ value: this._show ? 1 : 0 }}
        enter={{
          value: [this._show ? 1 : 0]
        }}
        update={{
          value: [this._show ? 1 : 0],
          timing: {
            duration: 600,
            ease: easeCubicOut
          }
        }}
      >
        {({ value }) => (
          <div
            ref={r => (this._wrap = r)}
            style={{
              overflow: value < 1 ? 'hidden' : undefined,
              height: value < 1 ? this._size * (value as number) : undefined
            }}
            children={this._show ? this.props.children : undefined}
            dangerouslySetInnerHTML={
              !this._show ? { __html: this._oldHtml } : undefined
            }
          />
        )}
      </Animate>
    )
  }
}
