import cn from 'classnames'
import React from 'react'
import { ThemeProps, withTheme } from '../../../../utils/theme'
import baseTheme from './theme.css'

interface OwnProps {
  src: string
  fulfilled?: boolean
  rejected?: boolean
  overlayed?: boolean
  statusDocument?: React.ReactNode
  showDeleteBtn: boolean
  onDelete: () => void
  onDidMount?: () => void
}

export interface DocTheme{
  doc: string,
  isNew: string,
  isApproved: string,
  isRejected: string,
  imgBox: string,
  delete: string,
  overlay: string,
  img: string,
  status: string,
  check: string,
  stop: string
}

type ComponentProps = OwnProps & ThemeProps<DocTheme>

// tslint:disable-next-line:variable-name
class DocComponent extends React.PureComponent<ComponentProps> {
  componentDidMount() {
    if (this.props.onDidMount) this.props.onDidMount()
  }

  render() {
    const {
      src,
      fulfilled,
      rejected,
      onDelete,
      overlayed,
      showDeleteBtn,
      statusDocument,
      theme
    } = this.props
    return (
      <div
        className={cn(theme.doc, {
          [theme.isNew]: showDeleteBtn,
          [theme.isApproved]: fulfilled,
          [theme.isRejected]: rejected
        })}
      >
        <div className={theme.imgBox}>
          {showDeleteBtn && <div className={theme.delete} onClick={onDelete} />}
          {overlayed && <div className={theme.overlay} />}
          <img className={theme.img} src={src} />
        </div>
        <div className={theme.status}>
          {fulfilled && <div className={theme.check} />}
          {rejected && <div className={theme.stop} />}
          {statusDocument}
        </div>
      </div>
    )
  }
}


// tslint:disable-next-line:variable-name
export const Doc = withTheme<DocTheme>(baseTheme)(DocComponent)