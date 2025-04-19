import { FadeAnimation } from 'common/ui/animation/fade'
import React from 'react'
import theme from './theme.css'

interface OwnProps {
  show?: boolean
}

export class Spinner extends React.PureComponent<OwnProps> {
  render() {
    return (
      <FadeAnimation show={this.props.show}>
        {state => (
          <div style={{ opacity: state.opacity }} className={theme.spinner}>
            <div className={theme.circleOuter} />
            <div className={theme.circleInner} />
          </div>
        )}
      </FadeAnimation>
    )
  }
}
