import cn from 'classnames'
import { NewsStyleProps } from 'common/@components/news-list'
import { News } from 'common/api/news'
import React from 'react'
import { FormattedDate } from 'react-intl'
import theme from './theme.css'

interface OwnProps {
  data: News
}

type ComponentProps = OwnProps & NewsStyleProps

export class NewsItem extends React.PureComponent<ComponentProps> {
  render() {
    const {
      data: { title, date, body },
      style
    } = this.props
    return (
      <div className={cn(theme.item, style === 'light' && theme.light)}>
        <div className={theme.container}>
          <div className={theme.title}>{title}</div>
          <div className={theme.date}>
            <FormattedDate
              value={new Date(date)}
              weekday="long"
              day="2-digit"
              month="long"
              year="numeric"
            />
          </div>
          <div
            className={theme.body}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      </div>
    )
  }
}
