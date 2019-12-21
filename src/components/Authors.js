import React, { useState } from 'react'
import Select from 'react-select';


const Authors = ({ result, editAuthor })  => {
  const [name, setName] = useState('')
  const [born, setBornTo]  = useState('')


  if (result === null) {
    return <div>loading...</div>
  }

  const authors = result
  console.log(authors.map(a => a.name))
 
  if (!authors) {
    return <div>loading...</div>
  }


  
  
  const customOptions = authors.map(a  => {
    
      return {
      value: a.name,
      label: a.name
    }
    }
  )
  

  const submit = async (e) => {
    e.preventDefault()

    console.log('set to born...')
    console.log('name' + name)
    console.log('born' + born)

    await editAuthor({
      variables: { name, born }
      
    })
    setName('')
    setBornTo('')
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
      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name <Select
            value={name}
            options={customOptions}
            onChange={( target ) => setName(target.value)}
          />
        </div>
        <div>
          born <input
            value={born}
            type='number'
            onChange={({ target }) => setBornTo(Number(target.value))}
          />
        </div>
        <button type='submit'>Update author</button>
      </form>

    </div>
  )
}

export default Authors