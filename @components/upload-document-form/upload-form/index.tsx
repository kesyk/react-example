import { T } from 'common/@components/t'
import { FileField, FileUploaderTheme } from 'common/ui/form/file-field'
import { PopoverAlignment } from 'common/ui/popover'
import {
  ALLOWED_EXTS,
  FORMAT_VALUE_ALLOWED_EXTS,
  FORMAT_VALUE_MAX_FILESIZE
} from 'common/utils/misc'
import { FieldData } from 'forms-builder'
import React from 'react'
import { ThemeProps, withTheme } from '../../../utils/theme'
import baseTheme from './theme.css'

type RidPrefixKeys = 'title' | 'docs' | 'btn' | 'req' | 'reqFormats' | 'reqSize'

type RidPrefix<T = string> = ({ main: T } & { [key in RidPrefixKeys]?: T }) | T

type Rids = { [key in RidPrefixKeys]: string }

interface OwnProps {
  ridPrefix: RidPrefix
  files: FieldData<File[]>
  disabled: boolean
  okstyle?: boolean
  onBlur?: () => void
  additionField?: React.ReactNode
  multiselect?: boolean
  alignError?: PopoverAlignment
  btnIsHide?: boolean
}

type ComponentProps = OwnProps &
  ThemeProps<UploadFilesTheme> & {
    btnCustomization?: Partial<FileUploaderTheme>
  }

interface UploadFilesTheme {
  docs: string
  desc: string
  title: string
  form: string
  requirements: string
  actions: string
  fields: string
}

class UploadFilesComponent extends React.Component<ComponentProps> {
  private _rids!: Rids
  constructor(props: ComponentProps) {
    super(props)

    this._rids = this.getRids()
  }

  render() {
    const {
      files,
      disabled,
      onBlur,
      additionField,
      multiselect,
      okstyle,
      alignError,
      btnIsHide,
      theme,
      btnCustomization
    } = this.props

    return (
      <div className={theme.form}>
        <div className={theme.title}>
          <T id={this._rids.title} />
        </div>
        <div className={theme.desc}>
          <T id={this._rids.docs} />
        </div>
        {additionField && <div className={theme.fields}>{additionField}</div>}
        <div className={theme.actions}>
          {!btnIsHide && (
            <FileField
              {...files}
              disabled={disabled}
              theme={btnCustomization}
              accept={ALLOWED_EXTS}
              onBlur={onBlur!}
              multiselect={multiselect}
              okstyle={okstyle}
              alignError={alignError}
            >
              <T id={this._rids.btn} />
            </FileField>
          )}
        </div>
        <div className={theme.requirements}>
          <div>
            <b>
              <T id={this._rids.req} />
            </b>
          </div>
          <div>
            <T
              id={this._rids.reqFormats}
              values={{ exts: FORMAT_VALUE_ALLOWED_EXTS }}
            />
          </div>
          <div>
            <T
              id={this._rids.reqSize}
              values={{ size: FORMAT_VALUE_MAX_FILESIZE }}
            />
          </div>
        </div>
      </div>
    )
  }

  private getRids = () => {
    const { ridPrefix } = this.props
    const ridSufix: Rids = {
      title: 'title',
      docs: 'docs',
      btn: 'btn-upload',
      req: 'requirements',
      reqFormats: 'requirements.formats',
      reqSize: 'requirements.size'
    }

    const ridSufixKeys = Object.keys(ridSufix) as RidPrefixKeys[]
    const resultRid: typeof ridSufix = {} as any

    if (typeof ridPrefix === 'string') {
      ridSufixKeys.forEach(ridKey => {
        resultRid[ridKey] = ridPrefix + ridSufix[ridKey]
      })
    } else {
      ridSufixKeys.forEach(ridKey => {
        const prefix = ridPrefix[ridKey] ? ridPrefix[ridKey] : ridPrefix.main
        resultRid[ridKey] = prefix + ridSufix[ridKey]
      })
    }

    return resultRid
  }
}

// tslint:disable-next-line:variable-name
export const UploadFiles = withTheme<UploadFilesTheme>(baseTheme)(
  UploadFilesComponent
)
