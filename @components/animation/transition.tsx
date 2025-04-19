import { easeCubicOut } from 'd3-ease'
import React from 'react'
import { Animate } from 'react-move'
import { RouteComponentProps, withRouter } from 'react-router'

const DURATION_OUT = 300
const DURATION_IN = 300

interface OwnProps {
  /**
   * @default `slide`
   */
  animation?: 'fade' | 'slide'
  children: React.ReactNode
}

type ComponentProps = OwnProps & RouteComponentProps<{}>

interface State {
  unmounting?: boolean
}

class TransitionComponent extends React.PureComponent<ComponentProps, State> {
  private _oldHtml: string | undefined
  private _wrap: HTMLDivElement | null | undefined

  constructor(props: ComponentProps) {
    super(props)
    this.state = {}
  }

  UNSAFE_componentWillReceiveProps(nextProps: ComponentProps) {
    const prevChild = this.props.children as React.ReactElement<any>
    const nextChild = nextProps.children as React.ReactElement<any>

    let shouldAnimate = false

    if (prevChild !== nextChild) {
      // Allow animate child
      if (!prevChild || !nextChild) {
        shouldAnimate = true
      }

      // Allow animate children
      else if (prevChild && nextChild) {
        if (!prevChild.key && !nextChild.key) {
          shouldAnimate = true
        } else if (prevChild.key !== nextChild.key) {
          shouldAnimate = true
        }
      }
    }

    if (shouldAnimate) {
      this._oldHtml = this._wrap!.innerHTML
      this.setState({ unmounting: true })
    }

    return null
  }

  render() {
    const { unmounting } = this.state
    const timing = {
      duration: unmounting ? DURATION_OUT : DURATION_IN,
      ease: easeCubicOut
    }

    return (
      <Animate
        start={{
          value: 0
        }}
        enter={{
          value: [1],
          timing
        }}
        update={{
          value: [!unmounting ? 1 : 0],
          timing: {
            ...timing,
            events: { end: this.performEnter }
          }
        }}
      >
        {
          (({ value }: { value: number }) => {
            switch (this.props.animation) {
              case 'fade':
                return (
                  <>
                    {this._oldHtml && value !== 1 && (
                      <div
                        dangerouslySetInnerHTML={{ __html: this._oldHtml }}
                      />
                    )}
                    <div
                      style={{
                        opacity: unmounting ? 1 - value : 1,
                        zIndex: 5,
                        position: 'relative'
                      }}
                      ref={r => (this._wrap = r)}
                    >
                      {this.props.children}
                    </div>
                  </>
                )

              case 'slide':
              default:
                return (
                  <div
                    style={
                      value < 1
                        ? {
                            opacity: value,
                            transform: `translateY(${(1 - value) * 1.8}rem)`
                          }
                        : undefined
                    }
                    ref={r => (this._wrap = r)}
                    children={unmounting ? undefined : this.props.children}
                    dangerouslySetInnerHTML={
                      unmounting ? { __html: this._oldHtml! } : undefined
                    }
                  />
                )
            }
          }) as any
        }
      </Animate>
    )
  }

  private readonly performEnter = () => {
    this.setState({ unmounting: false })
  }
}

// tslint:disable-next-line:variable-name
export const Transition = withRouter(TransitionComponent)
