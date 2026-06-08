import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Filter = ({ inputValue, inputOnChange }) => {
  return <div>filter shown with <input value={inputValue} onChange={inputOnChange} /></div>
}

const PersonForm = ({ addPerson, nameValue, handleNameChange, numberValue, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson} >
      <div>name: <input value={nameValue} onChange={handleNameChange} /></div>
      <div>number: <input value={numberValue} onChange={handleNumberChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({ personsToShow, onDelete }) => {
  return (
    <>
      {personsToShow.map(person => 
        <div key={person.id}>
          {person.name} {person.number} <button onClick={() => onDelete(person)}>delete</button>
        </div>
      )}
    </>
  )
}

const Notification = ({ successMessage, errorMessage }) => {
  if (errorMessage) {
    return (
      <div className='error'>
        {errorMessage}
      </div>
    )
  } else if (successMessage) {
    return (
      <div className="success">
        {successMessage}
      </div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameQuery, setNameQuery] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }

  useEffect(hook, [])

  const onDelete = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      personService
        .remove(person.id)
        .then(response => {
          setPersons(persons.filter(n => n.id !== person.id))
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(newName + " is already added to phonebook, replace the old number with a new one?")) {
        const person = persons.find(n => n.name === newName)
        const changedPerson = { ...person, number: newNumber }

        personService
          .update(person.id, changedPerson)
          .then(response => {
            setPersons(persons.map(personMap => personMap.id === person.id ? response : personMap))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setPersons(persons.filter(n => n.id !== person.id))
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          })
        
        setSuccessMessage(`Changed ${newName} phone number`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      }
    } else {
      const personObject = { name: newName, number: newNumber }
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
        })
      
      setSuccessMessage(`Added ${newName}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    }
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleQueryChange = (event) => {
    setNameQuery(event.target.value)
  }

  const personsToShow = nameQuery === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(nameQuery.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      />

      <Filter inputValue={nameQuery} inputOnChange={handleQueryChange} />

      <h3>add a new</h3>
      
      <PersonForm
        addPerson={addPerson}
        nameValue={newName}
        handleNameChange={handleNameChange}
        numberValue={newNumber}
        handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>
      
      <Persons
        personsToShow={personsToShow}
        onDelete={onDelete}
      />
    </div>
  )
}

export default App