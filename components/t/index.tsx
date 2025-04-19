import React from 'react'
import { FormattedHTMLMessage, FormattedMessage, intlShape } from 'react-intl'
import { Bb } from '../../ui/bitbon'

interface OwnProps extends FormattedMessage.MessageDescriptor {
  children?: (text: string) => React.ReactNode
  values?: { [key: string]: any }
  className?: string
}

export const parseDictionary = (text: string) => {
  const parts = text.split('|')
  const data: { key: string; value: string }[] = []

  for (let i = 0; i < parts.length / 2; i++)
    data.push({ key: parts[i * 2], value: parts[i * 2 + 1] })

  return data
}

const checkFormat = (id: string) => {
  if (!/^(([a-z0-9]){1,}(\.|\-|\.\@|!|~)){1,}[a-z0-9]{1,}$/.test(id)) {
    throw new TypeError(`Message id "${id}" do't match localization id format.`)
  }
}

/**
 * Creates regex to replace matches outside of tags
 */
const createTextReplace = (replace: string) =>
  new RegExp(`(${replace})(?!([^<]+)?>)`, 'gi')

const bbHtmlReplace = createTextReplace('{bb}|bitbon')

const formatHtmlMessage = (
  message: string,
  values: Record<string, string> = {}
) => message.replace(/{([^{]+)}/g, (_, value) => values[value])

/**
 * Represents formatted text
 *
 * Available global tokens:
 * - {bb}: <b>Bit</b>bon
 *
 * Naming convention:
 * - [path] = [route|@component|"@global"]
 * - Fields: `[path].field.[field-name]`
 * - FieldError: `[path].field.[field-name]![error]`
 * - Values: `[path]~[value]`
 */
export class T extends React.PureComponent<OwnProps> {
  /**
   * We needs to use old context API in favour to React Intl implementation
   * https://github.com/yahoo/react-intl/issues/1106
   */
  static contextTypes = {
    intl: intlShape
  }

  readonly context!: { intl: { messages: { [key: string]: string } } }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      checkFormat(this.props.id)
    }

    return this.isHtml() ? this.fmHtml() : this.fm()
  }

  /**
   * Detects if message contains html and we can use html component
   */
  private isHtml() {
    const { id, values } = this.props
    let html = false

    const messages = this.context.intl.messages
    const hasHTML = /<[a-z][\s\S]*>/i.test(messages[id])

    if (
      hasHTML &&
      (!values ||
        Object.keys(values).every(key => !React.isValidElement(values[key])))
    ) {
      html = true
    }

    return html
  }

  private fmHtml() {
    const { className, ...props } = this.props

    return (
      <FormattedHTMLMessage
        {...props}
        children={
          (props.children ||
            ((text: string) => (
              <div
                dangerouslySetInnerHTML={{
                  __html: formatHtmlMessage(
                    text.replace(
                      bbHtmlReplace,
                      `<b class="${Bb.BOLD_CLASS}">Bit</b>bon`
                    ),
                    props.values
                  )
                }}
                className={className}
              />
            ))) as any
        }
      />
    )
  }

  private fm() {
    const msg = this.context.intl.messages[this.props.id]

    const values = this.props.values || {}

    if (/{bb}/.test(msg)) {
      if (!values.bb) values.bb = <Bb />
    }

    return (
      <FormattedMessage
        {...this.props}
        children={this.props.children as any}
        values={values}
      />
    )
  }
}
