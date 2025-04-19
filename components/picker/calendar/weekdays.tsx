import { Locale } from 'moment'
import React from 'react'
import theme from './theme.css'
import { capitalizeFirst } from './utils'

interface OwnProps {
  localeData: Locale
}

export class Weekdays extends React.PureComponent<OwnProps> {
  render() {
    const localeData = this.props.localeData
    const firstDayOfWeek = localeData.firstDayOfWeek()
    const weekdaysShort = localeData.weekdaysShort()
    const weekdaysNames: string[] = []

    for (let i = 0; i < weekdaysShort.length; i++) {
      const name = weekdaysShort[(i + firstDayOfWeek) % 7]
      weekdaysNames.push(capitalizeFirst(name))
    }

    return (
      <div className={theme.daysNames}>
        {weekdaysNames.map(name => (
          <div key={name} className={theme.name}>
            {name}
          </div>
        ))}
      </div>
    )
  }
}
