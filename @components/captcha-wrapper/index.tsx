import cn from 'classnames'
import {
  Captcha,
  CaptchaSizeProps
} from 'common/@components/captcha-wrapper/@components/captcha'
import { Popover } from 'common/ui/popover'
import { FormClass } from 'forms-builder'
import React from 'react'

export type FormWithCaptcha<T> = FormClass<Partial<T>>

interface OwnProps extends CaptchaSizeProps {
  form: FormWithCaptcha<{ captcha: boolean }>
  error: any
  siteKey: string
  setRecaptchaResponse: (res: string) => void
  lang: string
  className?: string
}

export class CaptchaWrapper extends React.PureComponent<OwnProps> {
  render() {
    const { error, lang, siteKey, size, className } = this.props
    return (
      <div className={cn(className)}>
        <Popover show={error} content={error} align="top-left" />
        <Captcha
          lang={lang}
          sitekey={siteKey}
          verifyCallback={this.captchaOnChange}
          size={size}
        />
      </div>
    )
  }

  private captchaOnChange = (recaptchaResponse: string) => {
    const { form, setRecaptchaResponse } = this.props
    form.setValues({ captcha: true })
    form.setErrors([
      {
        field: 'captcha',
        error: null
      }
    ])
    setRecaptchaResponse(recaptchaResponse)
  }
}
