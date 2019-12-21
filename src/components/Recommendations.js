import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from '@apollo/react-hooks'


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
const USER = gql`
{
  me {
    favoriteGenre
    }
}
`

const Recommedations = (props)  => {
  const [books, setBooks] = useState(null)
  const [user, setUser] = useState(null)
  const client = useApolloClient()
  
  useEffect(() => {
    
    getUserData()
  }, [])
  
  const getUserData = async() => {
    const { data } = await client.query({
      query: USER
    })
    setUser(data.me)
  }
  
  const getRecommendations = async() => {
    const userFavoriteGenre = user.favoriteGenre.toString().toLowerCase()
    const { data } = await client.query({query: ALL_FILTERED_BOOKS,
        variables: { genre: userFavoriteGenre },
      });
      
      setBooks(data.allBooks)
  }

  if (user === null){
      console.log('user ei tiedossa') 
  } else {
      console.log('user tiedossa')
    if (user.favoritegenre === null) {
        console.log('genre ei tiedossa')
    } else {
        console.log(user.favoriteGenre)
        getRecommendations()
    }
  }
  

  
  if (!books) {
    return <div>loading...</div>
  }
  

  
 

  if(books.author === null){
    return <div>loading...</div>
  }

  return (
    <div>
       <h2>Recommended books</h2>

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
    </div>
  )
}

export default Recommedations