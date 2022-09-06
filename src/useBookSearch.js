import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setBooks([])
    console.log('~~ setBooks []', query)
  }, [query])

  useEffect(() => {
    console.log('~~ fetch ready')
    setLoading(true)
    setError(false)
    let cancel

    console.log('~~ fetch before axios')
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        console.log('~~ fetching response...')
        setBooks((prevBooks) => {
          return [
            ...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)]),
          ]
        })
        setHasMore(res.data.docs.length > 0)
        setLoading(false)
      })
      .catch((e) => {
        console.log('~~ fetch error')
        if (axios.isCancel(e)) return
        setError(true)
      })
    return () => {
      console.log('~~ fetch cancel')
      cancel()
    }
  }, [query, pageNumber])

  return { loading, error, books, hasMore }
}
