import React, { useState, useRef, useCallback, useEffect } from 'react'
import Book from './components/Book'
import useBookSearch from './useBookSearch'

export default function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber)

  const observer = useRef()
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log('intersecting')
          if (hasMore) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1)
          }
        }
      })
      if (node) {
        console.log('node', node)
        observer.current.observe(node)
      }
    },
    [loading, hasMore]
  )

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  useEffect(() => {
    console.log('query: ', query)
    return () => {
      console.log('query before change: ', query)
    }
  }, [query])

  useEffect(() => {
    console.log('books: ', books)
    return () => {
      console.log('books before change: ', books)
    }
  }, [books])

  useEffect(() => {
    console.log('loading: ', loading)
    return () => {
      console.log('loading before change: ', loading)
    }
  }, [loading])

  useEffect(() => {
    console.log('error: ', error)
    return () => {
      console.log('error before change: ', error)
    }
  }, [error])

  useEffect(() => {
    console.log('hasMore: ', hasMore)
    return () => {
      console.log('hasMore before change: ', hasMore)
    }
  }, [hasMore])

  useEffect(() => {
    console.log('lastBookElementRef: ', lastBookElementRef)
    return () => {
      console.log('lastBookElementRef before change: ', lastBookElementRef)
    }
  }, [lastBookElementRef])

  return (
    <>
      <input type='text' value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          )
        } else {
          return <div key={book}>{book}</div>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
      <div ref={lastBookElementRef}></div>
    </>
  )
}
