import React from 'react'
import Animate from 'react-move/Animate'

interface Props {
  open: boolean
  setInitScroll?: () => void
}

interface State {
  contentHeight: number
}

export class Accordion extends React.PureComponent<Props, State> {
  private _content = React.createRef<HTMLDivElement>()

  constructor(props: Props) {
    super(props)

    this.state = {
      contentHeight: 0
    }
  }

  componentDidMount() {
    this.updateContentHeight()
  }

  getSnapshotBeforeUpdate(_: Props, prevState: State) {
    if (this.props.open && prevState.contentHeight < this.state.contentHeight) {
      return true
    }
    return null
  }

  componentDidUpdate(_prevProps: Props, _prevState: State, snapshot: number) {
    this.updateContentHeight()

    if (snapshot && this.props.setInitScroll) this.props.setInitScroll()
  }

  render() {
    const { open, children } = this.props
    const { contentHeight } = this.state
    return (
      <Animate
        start={() => ({
          height: open ? contentHeight : 0
        })}
        update={() => ({
          height: [open ? contentHeight : 0],
          timing: { duration: 200 }
        })}
      >
        {state => (
          <div
            style={{
              overflow: 'hidden',
              maxHeight: state.height as number
            }}
          >
            <div ref={this._content}>{children}</div>
          </div>
        )}
      </Animate>
    )
  }

  private readonly updateContentHeight = () => {
    const { current } = this._content
    if (current) {
      const { height } = current.getBoundingClientRect()
      this.setState({ contentHeight: height })
    }
  }
}
