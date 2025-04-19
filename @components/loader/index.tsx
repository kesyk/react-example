import cn from 'classnames'
import { Spinner } from 'common/ui/spinner'
import React from 'react'
import theme from './theme.css'

interface OwnProps {
  loading: boolean | undefined
  children?: React.ReactNode
  className?: string
}

export class Loader extends React.PureComponent<OwnProps> {
  render() {
    return (
      <div
        className={cn(theme.loader, this.props.className, {
          [theme.isLoading]: this.props.loading
        })}
      >
        <div className={theme.component}>{this.props.children}</div>
        <Spinner show={this.props.loading} />
      </div>
    )
  }
}
