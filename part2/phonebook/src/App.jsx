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
              alert(`Error updating ${updatedPerson.name}!`)
              console.error(error);
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
            alert(`Error creating ${personObject.name}!`)
            console.error(error)
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
        .then(deletedPerson => {
          setPersons(persons.filter(
              person => person.id !== deletedPerson.id
            ))
          setFilter('')
        })
        .catch(error => {
          alert(`Error deleting ${person.name}!`)
          console.error(error);
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
