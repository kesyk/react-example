import { Calendar } from 'common/ui/picker/calendar'
import { Moment, utc } from 'moment'
import * as React from 'react'

interface OwnProps {
  minDate: Moment
  maxDate: Moment
  date: Moment | undefined
  onChange: (date: Moment) => void
}

interface State {
  picker: Moment
}

type Props = OwnProps

export class DatePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    let defaultPicker = props.date || utc()

    if (!this.isBetween(defaultPicker)) defaultPicker = this.props.maxDate

    this.state = {
      picker: defaultPicker.clone().startOf('months')
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.date &&
      this.props.date &&
      !prevProps.date.isSame(this.props.date)
    ) {
      const picker = this.props.date.clone().startOf('months')
      if (this.isBetween(picker))
        this.setState({
          picker
        })
    }
  }

  render() {
    const { minDate, maxDate, onChange, date } = this.props
    return (
      <Calendar
        minDate={minDate}
        maxDate={maxDate}
        picker={this.state.picker}
        onChange={onChange}
        onPickerChange={picker => {
          this.setState({ picker })
        }}
        value={date}
      />
    )
  }

  private readonly isBetween = (date: Moment) =>
    date.isSameOrAfter(this.props.minDate) &&
    date.isSameOrBefore(this.props.maxDate)
}
