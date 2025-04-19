import cn from 'classnames'
import { Locale, Moment, utc } from 'moment'
import React from 'react'
import theme from './theme.css'

export interface Day {
  day?: number
  enabled?: boolean
  selected?: boolean
  light?: boolean
}

interface OwnProps {
  from?: Moment
  to?: Moment
  hovered?: Moment
  localeData: Locale
  maxDate: Moment
  minDate: Moment
  picker: Moment
  onClick: (day: Day) => void
  onHover?: (day?: Moment) => void
}

export class Days extends React.PureComponent<OwnProps> {
  render() {
    const { picker, onClick, onHover, from, to, localeData } = this.props
    const year = picker.year()
    const month = picker.month()
    const currentMonthDate = utc([year, month, 1])
    const firstDayOfWeek = localeData.firstDayOfWeek()
    const startOfMonth = currentMonthDate.clone().startOf('month')
    const daysInMonth = currentMonthDate.daysInMonth()
    const days: Day[] = []
    let weekday = startOfMonth.weekday() - firstDayOfWeek

    if (weekday < 0) weekday += 7

    for (let j = 0; j < daysInMonth + weekday; j++) {
      const day = j - weekday + 1
      const date = utc([picker.year(), picker.month(), day])

      days.push(
        j < weekday
          ? {}
          : {
              day,
              enabled: this.isBetween(date),
              selected:
                this.isSelected(date, from) || this.isSelected(date, to),
              light: this.isLight(date)
            }
      )
    }

    return (
      <div className={theme.days}>
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(theme.day, {
              [theme.disabled]: !day.enabled,
              [theme.selected]: day.selected,
              [theme.light]: day.light
            })}
            onClick={day.enabled ? () => onClick(day) : undefined}
            onMouseEnter={
              onHover && day.enabled
                ? () => onHover(utc([year, month, day.day!]))
                : undefined
            }
            onMouseLeave={
              day.enabled && onHover ? () => onHover(undefined) : undefined
            }
          >
            {day.day}
          </div>
        ))}
      </div>
    )
  }

  isSelected = (current: Moment, date?: Moment) => {
    if (!date) return false

    return (
      current.year() === date.year() &&
      current.month() === date.month() &&
      current.date() === date.date()
    )
  }

  isLight = (date: Moment) => {
    const { from, to, hovered } = this.props
    if (to && from !== to) {
      return date.isBetween(from, to)
    } else if (from && hovered) {
      return date.isBetween(from, hovered) || date.isBetween(hovered, from)
    } else {
      return false
    }
  }

  isBetween = (date: Moment) =>
    date.isSameOrAfter(this.props.minDate) &&
    date.isSameOrBefore(this.props.maxDate)
}
