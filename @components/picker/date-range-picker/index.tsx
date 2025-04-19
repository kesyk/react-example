import { Calendar } from 'common/ui/picker/calendar'
import { Moment, utc } from 'moment'
import * as React from 'react'
import theme from './theme.css'

export interface PickerPeriod {
  from: Moment
  to: Moment
}

interface OwnProps {
  minDate: Moment
  maxDate: Moment
  defaultPeriod?: PickerPeriod
  onChange: (arg: PickerPeriod) => void
}

interface State {
  from?: Moment
  to?: Moment
  hovered?: Moment
  leftPicker: Moment
  rightPicker: Moment
}

type Props = OwnProps

export class DateRangePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      leftPicker: utc()
        .startOf('day')
        .subtract(1, 'months'),
      rightPicker: utc().startOf('day'),
      from: props.defaultPeriod && props.defaultPeriod.from,
      to: props.defaultPeriod && props.defaultPeriod.to
    }
  }

  onChange = (date: Moment) => {
    const { from, to } = this.state

    const nextState =
      !to || from !== to
        ? { from: date, to: date }
        : from.isSameOrBefore(date)
          ? { from, to: date }
          : { from: date, to: from }

    this.setState(nextState)
    this.props.onChange(nextState as any)
  }

  onHover = (date?: Moment) => this.setState({ hovered: date })

  render() {
    const { from, to, leftPicker, rightPicker } = this.state
    const { minDate, maxDate } = this.props
    const rightPickerMonthStart = rightPicker
      .clone()
      .startOf('months')
      .subtract(1, 'millisecond')
    const leftPickerMonthEnd = leftPicker
      .clone()
      .endOf('months')
      .add(1, 'millisecond')
    return (
      <div className={theme.picker}>
        <Calendar
          minDate={minDate}
          maxDate={
            maxDate.isBefore(rightPickerMonthStart)
              ? maxDate
              : rightPickerMonthStart
          }
          picker={leftPicker}
          onPickerChange={picker => this.setState({ leftPicker: picker })}
          onChange={this.onChange}
          onHover={this.onHover}
          value={{ from, to }}
          hovered={this.state.hovered}
        />
        <Calendar
          minDate={
            minDate.isAfter(leftPickerMonthEnd) ? minDate : leftPickerMonthEnd
          }
          maxDate={maxDate}
          picker={rightPicker}
          onPickerChange={picker => this.setState({ rightPicker: picker })}
          onChange={this.onChange}
          onHover={this.onHover}
          value={{ from, to }}
          hovered={this.state.hovered}
        />
      </div>
    )
  }
}
