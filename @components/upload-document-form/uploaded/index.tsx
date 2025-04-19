import { T } from 'common/@components/t'
import React from 'react'
import { Doc, DocTheme } from './doc'
import theme from './theme.css'

export interface OwnProps {
  docs: File[]
  ridPrefix: string // profile.docs.@uploaded.
  checked: boolean
  deleteFile: (file: File) => void
  showDeleteBtn: boolean
  setCountFiles?: (count: number) => void
  docsTheme?: Partial<DocTheme>
}

export class UploadedFiles extends React.Component<OwnProps> {
  render() {
    const {
      docs,
      docsTheme,
      ridPrefix,
      checked,
      deleteFile,
      showDeleteBtn,
      setCountFiles
    } = this.props

    if (setCountFiles) setCountFiles(docs.length)

    return (
      <div className={theme.uploaded}>
        <div className={theme.title}>
          <T id={`${ridPrefix}title`}/>
        </div>
        <div className={theme.listWrapper}>
          <div className={theme.list}>
            {docs &&
            docs.map(x => (
              <Doc
                key={x.name}
                theme={docsTheme}
                src={URL.createObjectURL(x)}
                fulfilled={checked}
                onDelete={() => deleteFile(x)}
                showDeleteBtn={showDeleteBtn}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}
