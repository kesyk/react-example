import { capitalizeFirst } from 'common/ui/picker/calendar/utils'
import { Select } from 'common/ui/select'
import { isMoment, Locale, localeData, Moment, utc } from 'moment'
import * as React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Day, Days } from './days'
import theme from './theme.css'
import { Weekdays } from './weekdays'

interface SelectItem {
  id: string
  name: string
  date: Moment
}

interface OwnProps {
  minDate: Moment
  maxDate: Moment
  onChange: (date: Moment) => void
  onPickerChange: (picker: Moment) => void
  onHover?: (date?: Moment) => void
  hovered?: Moment
  value: { from?: Moment; to?: Moment } | (Moment | undefined)
  picker: Moment
}

type ComponentProps = OwnProps & InjectedIntlProps

class CalendarComponent extends React.Component<ComponentProps> {
  isBetween = (date: Moment) =>
    date.isSameOrAfter(this.props.minDate) &&
    date.isSameOrBefore(this.props.maxDate)

  render() {
    const selectThemeMonths = {
      select: theme.selectMonths,
      dropdown: theme.selectDropdownMonths,
      item: theme.selectItemMonths
    }

    const selectThemeYears = {
      select: theme.selectYears,
      dropdown: theme.selectDropdownYears,
      item: theme.selectItemYears
    }

    // {...selectTheme, select: classNames(selectTheme.select, theme.selectMonths)}

    const {
      picker,
      intl: { locale },
      minDate,
      maxDate,
      value,
      hovered,
      onPickerChange,
      onHover,
      onChange
    } = this.props
    const currentLocaleData: Locale = localeData(locale)
    let yearsData: SelectItem[] = []
    let monthsData: SelectItem[] = currentLocaleData
      .months()
      .map((month, i) => ({
        id: i.toString(),
        name: capitalizeFirst(month),
        date: utc([picker.year(), i, 1])
      }))

    for (let year = maxDate.year(); year >= minDate.year(); year--)
      yearsData.push({
        id: year.toString(),
        name: year.toString(),
        date: utc([year, picker.month(), 1])
      })

    monthsData = monthsData.filter(data => this.isBetween(data.date))
    yearsData = yearsData.filter(data => this.isBetween(data.date))

    return (
      <div className={theme.calendar}>
        <div className={theme.options}>
          <div className={theme.option}>
            <Select
              theme={selectThemeMonths}
              value={picker.month().toString()}
              data={monthsData}
              onChange={v =>
                onPickerChange(utc([picker.year(), parseInt(v, 10), 1]))
              }
            />
          </div>
          <div className={theme.option}>
            <Select
              theme={selectThemeYears}
              value={picker.year().toString()}
              data={yearsData}
              onChange={v =>
                onPickerChange(utc([parseInt(v, 10), picker.month(), 1]))
              }
            />
          </div>
        </div>

        <Weekdays localeData={currentLocaleData} />

        <Days
          from={value === undefined || isMoment(value) ? value : value.from}
          to={value === undefined || isMoment(value) ? value : value.to}
          hovered={hovered}
          localeData={currentLocaleData}
          maxDate={maxDate}
          minDate={minDate}
          picker={picker}
          onHover={onHover}
          onClick={(d: Day) => {
            onChange(utc([picker.year(), picker.month(), d.day!]))
          }}
        />
      </div>
    )
  }
}

// tslint:disable-next-line:variable-name
export const Calendar = injectIntl(CalendarComponent)
