import React, {  } from 'react'



const AuthorsForAll = ({ result, editAuthor })  => {
  

  if (result === null) {
    return <div>loading...</div>
  }

  const authors = result
  console.log(authors.map(a => a.name))
 
  if (!authors) {
    return <div>loading...</div>
  }
  


  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
     

    </div>
  )
}

export default AuthorsForAll