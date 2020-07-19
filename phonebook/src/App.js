import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'
const Filter = ({handleFilterChange, filterName}) => {
  return(
    <div>
      filter shown with: <input 
      onChange={handleFilterChange}
      value={filterName}/>
    </div>
  )
}
const PersonForm = ({addPerson, handleNameChange, newName, handleNumberChange, newNumber}) => {
  return(
    <>
    <form onSubmit={addPerson}>
        <div>
          name: <input 
          onChange={handleNameChange}
          value={newName}/>
        </div>
        <div>
          number: <input 
          onChange={handleNumberChange}
          value={newNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

    </>
  )
}

const Notification = ({message}) => {
  if (message == null) {
    return(
      <>
      </>
    )
  } else {
    return (
      <div className='notification'>
        {message}
      </div>
    )
  }
}

const Error = ({message}) => {
  if (message == null) {
    return(
      <>
      </>
    )
  } else {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
}

const Person = ({name, number, clickDelete}) => {
  return (
    <>
      <li>
        {name} {number} 
        <button onClick={clickDelete}>delete</button></li>
    </>
  )
}
const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterName, setFilterName ] = useState('')
  const [ notification, setNotification ] = useState(null)
  const [ error, setError ] = useState(null)
  const shownPersons = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
  const lol = persons
  useEffect(()=> {
    personService
    .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])
  const addPerson = (event) => {
    event.preventDefault()
    const index = persons.findIndex(person => person.name === newName)
    if(index === -1) {
      personService
        .create({name: newName, number : newNumber})
          .then(returnedPerson =>  {
            console.log("returned Person", returnedPerson)
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setFilterName('')
            setNotification(`Added ${returnedPerson.name}`)
            setTimeout(() => setNotification(null), 5000)
          })
      // setPersons(persons.concat({name: newName, number: newNumber}))
      
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) { 
        const newPerson = persons.find(person => person.name === newName)
        const changedPerson = {...newPerson, number: newNumber}
        personService
        .update(newPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(persons.map(person => person.name !== newPerson.name ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setFilterName('')
          }).catch(error => {
            console.log('error on adding person:', error)
            setError(`Information of ${newName} has already been removed from server`)
            setTimeout(() => setError(null), 5000)
          })
      }

    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }
  const clickDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) { 
      personService
      .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
    
  }
  console.log("lol", lol)
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Error message={error}/>
      <Filter handleFilterChange={handleFilterChange} filterName={filterName}/>
      <h2>Add new person</h2>
      <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} newName={newName} handleNumberChange={handleNumberChange} newNumber={newNumber}/>
      <h2>Numbers</h2>
      <ul>
        {shownPersons.map(person => 
          <Person 
            key={person.id} 
            name={person.name}
            number={person.number} 
            clickDelete={() => clickDelete(person.id, person.name)}/>
         )}
      </ul>
    </div>
  )
}

export default App