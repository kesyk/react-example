import React from 'react'
import { Animate } from 'react-move'

const ANI_HEIGHT = 2
const ANI_DURATION = 150

interface AnimationProps {
  opacity: number
  y: number
}

interface OwnProps {
  show: boolean | undefined
  children: (state: AnimationProps) => React.ReactElement<any>
  height?: number
  duration?: number
}

export class FadeAnimation extends React.PureComponent<OwnProps> {
  render() {
    const height = this.props.height || ANI_HEIGHT
    const timing = {
      duration: this.props.duration || ANI_DURATION
    }

    return (
      <Animate
        show={this.props.show ? true : false}
        start={{
          opacity: 0,
          y: -height
        }}
        enter={{
          opacity: [1],
          y: [0],
          timing
        }}
        update={{
          opacity: [1],
          y: [0],
          timing
        }}
        leave={{
          opacity: [0],
          y: [-height],
          timing
        }}
        children={this.props.children as any}
      />
    )
  }
}
