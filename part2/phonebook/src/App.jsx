import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number: '040-1234567'
     }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>

      <table>
        <tbody>
          {persons.map(person => {
            return (
              <tr key={person.name}>
                <td>{person.name}</td>
                <td>{person.number}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default App
