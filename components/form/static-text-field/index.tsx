import React from 'react'
import theme from './theme.css'

interface OwnProps {
  children: React.ReactNode
}

export class StaticTextField extends React.PureComponent<OwnProps> {
  render() {
    return <div className={theme.staticText}>{this.props.children}</div>
  }
}
