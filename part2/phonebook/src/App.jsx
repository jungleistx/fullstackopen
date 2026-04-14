import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'
import peopleService from './services/people'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])

  useEffect(() => {
    peopleService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
      .catch(error => {
        console.error(error);
      })
  }, [])

  const isNameInPersons = (name) => {
    if (persons.some(person => person.name === name)) {
      return true
    }
    return false
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (newName && newNumber) {
      if (isNameInPersons(newName)) {
        alert(`${newName} is already added to phonebook`)
      }
      else {
        const personObject = {
          name: newName,
          number: newNumber
        }

        axios
          .post('http://localhost:3001/persons', personObject)
          .then(response => {
            setPersons(persons.concat(response.data))
            setNewName('')
            setNewNumber('')
            setFilter('')
          })
          .catch(error =>
            alert(`Error sending '${personObject.name}'!`)
          )
      }
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)

    if (e.target.value) {
      setFilteredPersons(persons.filter(person =>
        person.name.toLowerCase().includes(e.target.value.toLowerCase())
      ))
    }
    else {
      setFilteredPersons([])
    }
  }

  const personsToShow = filter ? filteredPersons : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} onChange={handleFilterChange}/>

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        name={newName}
        nameChange={handleNameChange}
        number={newNumber}
        numberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App
