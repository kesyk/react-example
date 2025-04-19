import cn from 'classnames'
import { NewsItem } from 'common/components/news-list/components/item'
import { T } from 'common/components/t'
import { DispatchProps } from 'common/redux/connect'
import { fetchNews, navigateToPage, NewsStore } from 'common/redux/modules/news'
import { Button } from 'common/ui/button'
import { Loader } from 'common/ui/loader'
import { parse, stringify } from 'querystring'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import theme from './theme.css'

export interface NewsStyleProps {
  style?: 'light'
}

export interface NewsListProps {
  news: NewsStore
}

type ComponentProps = DispatchProps &
  NewsListProps &
  NewsStyleProps &
  RouteComponentProps

class NewsListComponent extends React.PureComponent<ComponentProps> {
  render() {
    const {
      news: { currentPage, totalPage },
      style
    } = this.props
    const data = this.props.news.data[currentPage] || { items: [] }
    return (
      <>
        <div className={theme.header}>
          <div className={theme.container}>
            <div className={cn(theme.title, style === 'light' && theme.light)}>
              <T id="common.component.news-list.title" />
            </div>
          </div>
        </div>
        <Loader loading={data.loading}>
          {data.items &&
            data.items.map((item, i) => (
              <NewsItem key={i} data={item} style={style} />
            ))}
        </Loader>
        <div className={theme.pager}>
          <div className={cn(theme.container, theme.box)}>
            <Button
              className={theme.btnPrev}
              disabled={currentPage === 1}
              onClick={() => this.navigateToPage(currentPage - 1)}
            >
              <T id="common.global.btn.prev" />
            </Button>
            <Button
              disabled={currentPage === totalPage}
              onClick={() => this.navigateToPage(currentPage + 1)}
            >
              <T id="common.global.btn.next" />
            </Button>
          </div>
        </div>
      </>
    )
  }

  private readonly navigateToPage = (newPageNumber: number) => {
    const {
      news: { totalPage, data },
      history
    } = this.props
    if (newPageNumber >= 1 && newPageNumber <= totalPage) {
      window.scrollTo(0, 0)
      if (data[newPageNumber])
        this.props.dispatch(navigateToPage({ pageNumber: newPageNumber }))
      else this.props.dispatch(fetchNews({ page: newPageNumber }))
    }

    history.push(
      `${history.location.pathname}?${stringify({
        ...parse(history.location.search.split('?')[1]),
        ...{ page: newPageNumber }
      })}`
    )
  }
}

// tslint:disable-next-line:variable-name
export const NewsList = withRouter(NewsListComponent)
