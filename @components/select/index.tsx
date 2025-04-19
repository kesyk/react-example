import cn from 'classnames'
import { TextField } from 'common/ui/form/text-field'
import { mergeTheme } from 'common/utils/theme'
import { FieldComponent, formBuilder } from 'forms-builder'
import React from 'react'
import { findDOMNode } from 'react-dom'
import { Animate } from 'react-move'
import lightTheme from './light-theme.css'
import baseTheme from './theme.css'

const ANI_DURATION = parseInt(baseTheme._duration, 10)
const ANI_HEIGHT = parseFloat(baseTheme._height)

interface ThemeBase {
  [key: string]: string
}
export interface SelectTheme extends ThemeBase {
  wrapper: string
  label: string
  dropdown: string
  select: string
  item: string
  isActive: string
  selectedItem: string
}

export interface SelectThemeProps {
  theme?: Partial<SelectTheme>
}

export interface SelectDataItem {
  id: string
  name: React.ReactNode
}

interface OwnProps extends SelectThemeProps {
  label?: React.ReactNode
  value?: string
  data: SelectDataItem[]
  onChange: (value: string) => void
  onBlur?: () => void
  onOpen?: () => void
  onClose?: () => void
  maxWidth?: string | number
  hasFilter?: boolean
  _height?: number
}

interface State {
  show: boolean
  list: SelectDataItem[]
  dataLength: number
  selected?: SelectDataItem
}

export interface Select extends FieldComponent {}
export class Select extends React.Component<OwnProps, State> {
  static getDerivedStateFromProps: React.GetDerivedStateFromProps<
    OwnProps,
    State
  > = (nextProps, prevState) => {
    if (nextProps.data.length !== prevState.dataLength)
      return {
        ...prevState,
        dataLength: nextProps.data.length,
        list: nextProps.data
      }

    return {
      ...prevState
    }
  }

  private _wrapper!: HTMLDivElement | null

  private readonly _form = formBuilder<{ search: string }>({
    search: {}
  })
    .configure({})
    .build(this)

  constructor(props: OwnProps) {
    super(props)
    this.state = {
      show: false,
      dataLength: 0,
      list: []
    }
  }

  focus() {
    if (this._wrapper) {
      this._wrapper.focus()
      return true
    }

    return false
  }

  componentDidMount() {
    document.addEventListener('click', this.documentClick)
    document.addEventListener('keydown', this.documentKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.documentClick)
    document.removeEventListener('keydown', this.documentKeydown)
  }

  render() {
    const { value, data, hasFilter } = this.props
    const { list } = this.state
    const { fields } = this._form
    const selectedItem = list.find(x => x.id === value)
    const chosenItem = this.state.selected || selectedItem
    const theme = mergeTheme(baseTheme, this.props.theme)
    const aniHeight = this.props._height ? this.props._height : ANI_HEIGHT

    return (
      <div
        ref={r => (this._wrapper = r)}
        className={cn(theme.wrapper, {
          [theme.isActive]: this.state.show
        })}
        tabIndex={0}
      >
        {/* Label */}
        {this.props.label &&
          !selectedItem && (
            <div className={theme.label}>{this.props.label}</div>
          )}

        {/* Button */}
        <div
          className={theme.select}
          onClick={() => (this.state.show ? this.hide() : this.show())}
          children={selectedItem && selectedItem.name}
        />

        <Animate
          show={this.state.show}
          start={{
            opacity: 0,
            y: 0
          }}
          enter={{
            opacity: [1],
            y: [aniHeight],
            timing: { duration: ANI_DURATION }
          }}
          update={{
            opacity: [1],
            y: [aniHeight],
            timing: { duration: ANI_DURATION }
          }}
          leave={{
            opacity: [0],
            y: [0],
            timing: { duration: ANI_DURATION }
          }}
        >
          {({ opacity, y }) => (
            <div
              className={theme.dropdown}
              style={{
                opacity: opacity as number,
                transform: `translateY(${y}rem)`,
                zIndex: opacity > 0 ? 101 : undefined,
                maxWidth: this.props.maxWidth
              }}
            >
              {hasFilter && (
                <TextField
                  {...fields.search}
                  label={null}
                  theme={{
                    wrapper: theme.search
                  }}
                  onChange={v => {
                    fields.search.onChange(v)

                    if (v === '') this.setState({ list: data })
                    else
                      this.setState({
                        list: data.filter(
                          item =>
                            item
                              .name!.toString()
                              .toLowerCase()
                              .search(v.toLowerCase()) !== -1
                        )
                      })
                  }}
                />
              )}
              {list.map(x => (
                <div
                  key={x.id === undefined ? '__default__' : x.id}
                  onClick={() => {
                    this.hide()

                    if (fields.search.value)
                      this._form.setValues({
                        search: ''
                      })

                    this.props.onChange(x.id)
                  }}
                  className={cn(theme.item, {
                    [theme.selectedItem]: x === selectedItem,
                    [theme.chosen]: x === chosenItem
                  })}
                  children={x.name}
                />
              ))}
            </div>
          )}
        </Animate>
      </div>
    )
  }

  private readonly documentClick = (e: MouseEvent) => {
    if (!this._wrapper) return

    const dom = findDOMNode(this._wrapper)!
    if (dom.contains(e.target as Node)) return

    this.hide()
  }

  private readonly documentKeydown = (e: KeyboardEvent) => {
    if (this._wrapper === document.activeElement) {
      switch (e.which) {
        // Space
        case 32:
          e.preventDefault()

          if (!this.state.show) {
            if (this.props.value) {
              this.setState({
                selected: this.props.data.find(x => x.id === this.props.value)
              })
            }
            this.show()
          }

          break

        // Esc
        case 27:
          e.preventDefault()

          if (this.state.show) this.hide()

          break

        // uarr, darr
        case 38:
        case 40:
          e.preventDefault()

          if (this.state.show) {
            let selectedIndex = this.props.data.findIndex(
              x => x === this.state.selected
            )

            selectedIndex += e.which === 38 ? -1 : 1

            if (selectedIndex >= 0 && selectedIndex < this.props.data.length) {
              this.setState({ selected: this.props.data[selectedIndex] })
            }
          }

          break

        // Enter
        case 13:
          e.preventDefault()

          if (
            this.state.show &&
            this.state.selected !== this.props.value &&
            this.state.selected
          ) {
            this.props.onChange(this.state.selected.id)
            this.hide()
          }

          break
      }
    }
  }

  private hide() {
    if (!this.state.show) return

    this.setState({ show: false })

    if (this.props.onClose) this.props.onClose()

    if (this.props.onBlur) this.props.onBlur()
  }

  private show() {
    if (this.state.show) return

    this.setState({ show: true })

    if (this.props.onOpen) this.props.onOpen()
  }
}

export const selectLightTheme: SelectTheme = {
  select: lightTheme.select,
  item: lightTheme.item,
  selectedItem: lightTheme.selectedItem,
  dropdown: lightTheme.dropdown,
  wrapper: '',
  label: '',
  isActive: ''
}
