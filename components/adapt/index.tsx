import { connectContext } from 'common/context'
import { isBrowser } from 'common/utils'
import React from 'react'
import theme from './theme.css'

export type AdaptTo = 'mobile' | 'desktop'

type ChildFn = (to: AdaptTo) => React.ReactNode

interface ContextProps {
  query: string
}

export interface AdaptProps {
  to: AdaptTo
  children: React.ReactNode
}

export interface AdaptsProps {
  to?: AdaptTo[]
  children: ChildFn
}

type ComponentProps = (AdaptProps | AdaptsProps) & ContextProps

interface State {
  show?: AdaptTo
}

export const adaptIs = (adapt: AdaptTo) => {
  const matches =
    typeof window !== 'undefined' && window.document
      ? window.matchMedia(theme.query).matches
      : false

  switch (adapt) {
    case 'desktop':
      return !matches

    case 'mobile':
      return matches
  }
}

const htmlEl = isBrowser ? document.getElementsByTagName('html')[0] : undefined

function getHTMLFontSize() {
  const style = getComputedStyle(htmlEl!).fontSize!
  return parseInt(style, 10)
}

export const remToPixels = (rem: number) => {
  /**
   * For values see `theme/core.css`:
   * `html { font-size: VALUE%; }`
   */
  return getHTMLFontSize() * rem
}

/**
 * Show component only for specific media query
 */
class AdaptComponent extends React.PureComponent<ComponentProps, State> {
  static defaultProps: Partial<AdaptsProps> = {
    to: ['mobile', 'desktop']
  }

  private mqList: MediaQueryList

  constructor(props: ComponentProps) {
    super(props)
    this.state = {}

    this.mqList = isBrowser
      ? window.matchMedia(this.props.query)
      : (null as any)
  }

  componentDidMount() {
    this.mqList.addListener(this.onChange)
    this.onChange(this.mqList)
  }

  componentWillUnmount() {
    this.mqList.removeListener(this.onChange)
  }

  render() {
    const { to, children } = this.props
    const { show } = this.state

    if (!isBrowser) return children

    if (!show) return null

    return Array.isArray(to)
      ? (children as ChildFn)(show!)
      : to === show
      ? children
      : null
  }

  private readonly onChange = (x: MediaQueryList | MediaQueryListEvent) => {
    const tos =
      typeof this.props.to === 'string' ? [this.props.to] : this.props.to!

    let show: AdaptTo | undefined

    for (const to of tos) {
      if (!x.matches && to === 'desktop') {
        show = 'desktop'
      } else if (x.matches && to === 'mobile') {
        show = 'mobile'
      }
    }

    if (this.state.show !== show) this.setState({ show })
  }
}

// tslint:disable-next-line:variable-name
export const Adapt = connectContext<ContextProps>(({ adaptQuery }) => ({
  query: adaptQuery
}))(AdaptComponent)
