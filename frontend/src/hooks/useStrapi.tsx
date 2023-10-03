import { useEffect, useState, useId, useCallback } from 'react'
export const DEFAULT_PAGE_NUMBER = 1
export const DEFAULT_ARTICLE_LIST_SIZE = 9
export const ARTICLES_SORT = [{ publishedAt: 'desc' }];

export const wait = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })

export const defaultStrapiData = {
  pagination: {
    start: 0,
    limit: DEFAULT_ARTICLE_LIST_SIZE,
  },
  sort: ARTICLES_SORT,
}

type Props = {
  fetcher: (obj: any) => Promise<any>
  initArticle?: any[]
  pageSize?: number
  filters?: object
}

interface ReturnProps<T> {
  data: T[]
  isLoading: boolean
  page: number
  onPageChange: (nextPage: number) => void
  total: number
  sectionId: string
  pagination: {
    pages: number
    start: number
    max: number
    end: number
  },
}

const useStrapi = <T,> ({
  fetcher,
  initArticle = [],
  pageSize = DEFAULT_ARTICLE_LIST_SIZE,
  filters,
}: Props): ReturnProps<T> => {
  const [data, setArticles] = useState<T[]>(initArticle)
  const [isLoading, setLoading] = useState(true)
  const [page, setPage] = useState<number>(DEFAULT_PAGE_NUMBER)
  const [total, setTotal] = useState(0)
  const sectionId = `${useId()}`.replace(/:/g, '-')

  const onPageChange = useCallback(
    async (nextPage: number) => {
      setPage(nextPage)
      if (sectionId) {
        const container = document.getElementById(sectionId)
        if (container) {
          container.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    [sectionId, setPage]
  )

  useEffect(() => {
    const getData = async (nextPage: number) => {
      setLoading(true)

      const [res] = await Promise.all([
        fetcher({
          pagination: {
            start: (nextPage - 1) * pageSize,
            limit: pageSize,
          },
          sort: ARTICLES_SORT,
          filters,
        }),
        wait(300),
      ])
      const totalArticles = res?.meta?.pagination?.total || 0
      setArticles(res?.data)
      setTotal(totalArticles)
      setLoading(false)
    }
    getData(page).then()
  }, [page, pageSize, JSON.stringify(filters)])

  const pages = Math.ceil(total / pageSize)
  const start = 1 + pageSize * (page - 1)
  const max = pageSize * page
  const end = max > total ? total : max

  return {
    data,
    isLoading: isLoading && !!page,
    page,
    onPageChange,
    total,
    sectionId,
    pagination: {
      pages,
      start,
      max,
      end,
    },
  }
}

export default useStrapi
