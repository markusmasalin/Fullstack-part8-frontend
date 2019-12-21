import React, { useState, useEffect } from 'react'
import  { gql } from 'apollo-boost'
import { useApolloClient, useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import Authors from './components/Authors'
import AuthorsForAll from './components/AuthorsForAll'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const ALL_AUTHORS = gql`
{
  allAuthors  {
    name
    born
    bookCount
  
  }
}
`

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

const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title,
    published,
    genres
  }
}
`

const EDIT_AUTHOR = gql`
mutation editAuthor($name: String! , $born: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $born
  ) {
    name,
    born
  }
}
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
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

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState('')
  const [authors, setAuthors] = useState(null)
  const [books, setBooks] = useState(null)
  const [token, setToken] = useState(null)
  
  const [errorMessage, setErrorMessage] = useState(null)

  console.log(page + ' page')
  console.log(token + ' token')

  useEffect(() => {
    console.log('set Token')
    setToken(window.localStorage.getItem('loggedBlogappUser'))
  }, [])
 
  const showBooks = async () => {
    setPage('books')
    setFilter()
  }
  const setFilter = async () => {
    const { data } = await client.query({query: ALL_FILTERED_BOOKS,
      variables: { genre: '' },
    });
    
    console.log(data, 'Filtered data with null')
  }
    
  const showAuthors = async () => {
    const {data} = await client.query({
      query: ALL_AUTHORS
    }) 
    console.log( data.allAuthors + 'dataAllAuthors')
    setPage('authors')
    setAuthors(data.allAuthors)
  }
  
  const handleError = (error) => {
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  
  const errorNotification = () => errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  
  const updateCacheWith = (addedBook) => {
    console.log(addedBook, 'addedBook')
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ 
      query: ALL_BOOKS
    })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) } 
     })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      const addedBook = subscriptionData.data.bookAdded
      alert(`${addedBook.title} added`) 
      //updateCacheWith(addedBook)
    
    }
  })

  const [addBook] = useMutation(ADD_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }, { query: ALL_FILTERED_BOOKS,
      variables: { genre: '' },}],
      update: (store, response) => {
      updateCacheWith(response.data.addBook)
    } 
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: handleError, 
    refetchQueries: [{ query: ALL_AUTHORS}]

  })
  if (token === null) {
    if( page === 'books') {
      return (
        <div>
           {errorNotification()}
          <button onClick={() => showAuthors()}>authors</button>
          <button onClick={() => showBooks()}>books</button>
          <button onClick={() => setPage('login')}>login</button>
          <Books  showBooks={showBooks}   show={page === 'books'} />
        </div>
      )
    }

    if( page === 'login') {
      return (
        <div>   
        {errorNotification()}
          <button onClick={() => showAuthors()}>authors</button>
          <button onClick={() => showBooks()}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          <h2>Login</h2>
          <LoginForm
            login={login}
            setToken={(token) => setToken(token)}
          />
          <button onClick={logout}>logout</button>
        </div>
      )
    }

    if( page === 'authors') {
      return (
        <div>
          <div>
          {errorNotification()}
            <button onClick={() => showAuthors()}>authors</button>
            <button onClick={() => showBooks()}>books</button>
            <button onClick={() => setPage('login')}>login</button>
          </div>
          <AuthorsForAll result={authors} editAuthor={editAuthor} show={page === 'authors'} />     
        </div>
      )
    } 
    return (
      <div>
         {errorNotification()}
            <button onClick={() => showAuthors()}>authors</button>
            <button onClick={() => showBooks()}>books</button>
            <button onClick={() => setPage('login')}>login</button>
          </div>
    )
  } else {
  console.log('Token set')
  if( page === 'authors') {
    return (
      <div>
        <div>
        {errorNotification()}
          <button onClick={() => showAuthors()}>authors</button>
          <button onClick={() => showBooks()}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommendations')}>recommendations</button>
          <button onClick={logout}>logout</button>
        </div>
        <Authors result={authors} editAuthor={editAuthor} show={page === 'authors'} />     
      </div>
    )
  } 

  if( page === 'add') {
    return (
      <div>
         {errorNotification()}
        <button onClick={() => showAuthors()}>authors</button>
        <button onClick={() => showBooks()}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={logout}>logout</button>
        <h2>create new</h2>
         <NewBook addBook={addBook} show={page === 'add'} />
      </div>
    )
  }

  if( page === 'books') {
    return (
      <div>
         {errorNotification()}
        <button onClick={() => showAuthors()}>authors</button>
        <button onClick={() => showBooks()}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={logout}>logout</button>
        <Books showBooks={showBooks}  show={page === 'books'} />
       </div>
    )
  }
  if( page === 'recommendations') {
    return (
      <div>
         {errorNotification()}
        <button onClick={() => showAuthors()}>authors</button>
        <button onClick={() => showBooks()}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={logout}>logout</button>
        <Recommendations  show={page === 'recommendations'} />
       </div>
    )
  }
  
  return (
    <div>
       {errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }
    
      <div>
        {errorNotification()}
        <button onClick={() => showAuthors()}>authors</button>
        <button onClick={() => showBooks()}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={logout}>logout</button>   
      </div>
              

    </div>
    )
  }
}

export default App