import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from '@apollo/react-hooks'


const ALL_BOOKS = gql`
{
  allBooks  {
    title
    published
    author {
      name
    }
    genres
  }
}
`
const ALL_FILTERED_BOOKS = gql`
query getAllBooks($genre: String!) {
  allBooks(genre: $genre)  {
    title
    published
    author {
      name
    }
    genres
  }
}
`

const Books = (props)  => {
  const [books, setBooks] = useState(null)
  const [genres, setGenres] = useState(null)
  const client = useApolloClient()
  
  
 
  useEffect(() => {
    initialize()
    
   
  }, [])
  
  const initialize = async() => {
    const { data } = await client.query({
      query: ALL_BOOKS
    })
    console.log( 'dataAllBooks: ', data.allBooks )
    setBooks(data.allBooks)
    const bookGenres = data.allBooks.map(b => b.genres)
    const genreArray = [].concat.apply([], bookGenres)
    const genreList = Array.from(new Set(genreArray))
    // remove Duplicants from Array
    setGenres(genreList)
  }

  const filterBooks = async (g) => {
    const { data } = await client.query({query: ALL_FILTERED_BOOKS,
      variables: { genre: g },
    });
    setBooks(data.allBooks)
  }
  
  const removeFilter = async () => {
    console.log('filteri poistettu')
    initialize()
  }
  
  if (genres === null) {
    return <div>loading...</div>
  }
 
  if (!books) {
    return <div>loading...</div>
  }


  if(books.author === null){
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
          
        </tbody>
      </table>
      {genres.map(g => 
        <button onClick={() => filterBooks(g)} key={g}>{g}</button>
      )}
      <button onClick={() => removeFilter() }>All genres</button>
    </div>
  )
}

export default Books