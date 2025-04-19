import React from 'react'
import Recaptcha from 'react-recaptcha'

const CAPTCHA_URL =
  'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit'

const onloadCallback = () => console.log('done')

export interface CaptchaSizeProps {
  size?: 'normal' | 'compact' | 'invisible'
}

interface Props extends CaptchaSizeProps {
  lang: string
  verifyCallback: (s: string) => void
  sitekey: string
}

export class Captcha extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    const capthaScriptId = 'recaptcha-script'
    const captchaScript = document.getElementById(
      capthaScriptId
    ) as HTMLScriptElement

    if (!captchaScript) {
      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.id = capthaScriptId
      script.src = CAPTCHA_URL
      document.body.appendChild(script)
    }
  }

  render() {
    const { lang, sitekey, size } = this.props
    return (
      <>
        <Recaptcha
          sitekey={sitekey}
          render="explicit"
          verifyCallback={this.props.verifyCallback}
          onloadCallback={onloadCallback}
          size={size || 'normal'}
          hl={lang}
        />
      </>
    )
  }
}
