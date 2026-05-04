import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import peopleService from './services/people'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    peopleService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
      .catch(error => {
        setNotification({
          message: `Error getting persons from database`,
          type: 'error'
        })
        setTimeout(() => {
          setNotification(null)
        }, 3000)
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
        if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const oldPerson = persons.find(p => p.name === newName)
          const updatedPerson = { ...oldPerson, number: newNumber}

          peopleService
            .update(updatedPerson)
            .then(newPerson => {
              const personsWithoutOldPerson = persons.filter(p =>
                p.id !== oldPerson.id
              )
              setPersons(personsWithoutOldPerson.concat(newPerson))
              setNewName('')
              setNewNumber('')
              setFilter('')
              setNotification({
                message: `Updated ${updatedPerson.name}`,
                type: 'success'
              })
              setTimeout(() => {
                setNotification(null)
              }, 3000)
            })
            .catch(error => {
              setNotification({
                message: `Error updating ${updatedPerson.name}`,
                type: 'error'
              })
              setPersons(persons.filter(p => p.id !== updatedPerson.id))
              setTimeout(() => {
                setNotification(null)
              }, 3000)
            })
        }
      }
      else {
        const personObject = {
          name: newName,
          number: newNumber
        }

        peopleService
          .create(personObject)
          .then(person => {
            setPersons(persons.concat(person))
            setNewName('')
            setNewNumber('')
            setFilter('')
            setNotification({
              message: `Added ${personObject.name}`,
              type: 'success'
            })
            setTimeout(() => {
              setNotification(null)
            }, 3000)
          })
          .catch(error => {
            setNotification({
              message: `Error creating ${personObject.name}`,
              type: 'error'
            })
            setTimeout(() => {
              setNotification(null)
            }, 3000)
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

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name}?`)) {
      peopleService
        .deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setFilter('')
        })
        .catch(error => {
          setNotification({
            message: `Error deleting ${person.name}`,
            type: 'error'
          })
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
    }
  }

  const personsToShow = filter ? filteredPersons : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        message={notification?.message}
        type={notification?.type}
      />

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

      <Persons
        persons={personsToShow}
        onClick={deletePerson}
      />
    </div>
  )
}

export default App
