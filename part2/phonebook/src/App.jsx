import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])

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
          number: newNumber,
          id: persons.length + 1
        }
        setPersons(persons.concat(personObject))
        setNewName('')
        setNewNumber('')
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
    setNewFilter(e.target.value)

    if (e.target.value) {
      setFilteredPersons(persons.filter(person =>
        person.name.toLowerCase().includes(e.target.value.toLowerCase())
      ))
    }
    else {
      setFilteredPersons([])
    }
  }

  const personsToShow = newFilter ? filteredPersons : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={newFilter} onChange={handleFilterChange}/>

      <h2>Add a new</h2>

      <PersonForm
        onSubmit={addPerson}
        name={newName}
        nameChange={handleNameChange}
        number={newNumber}
        numberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App
