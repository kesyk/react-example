import cn from 'classnames'
import React from 'react'
import theme from './theme.css'

interface OwnProps {
  /**
   * 2-letter code
   */
  country: string
  className?: string
}

export class Flag extends React.PureComponent<OwnProps> {
  render() {
    return (
      <div className={cn(theme.flag, this.props.className)}>
        <img src={`/assets/flags/${this.props.country}.svg`} />
      </div>
    )
  }
}
