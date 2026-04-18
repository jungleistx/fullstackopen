import React, { useEffect, useState } from 'react'
import Filter from './components/Filter'
import CountryService from './services/country'
import Notification from './components/Notification'
import SearchResults from './components/SearchResults'


const App = () => {
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])


  useEffect(() => {
    CountryService
      .getAll()
      .then(countries => {
        setAllCountries(countries)
      })
      .catch(error => {
        setErrorMessage(`Error fetching countries`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 6000)
      })
  }, [])

  const handleChange = (event) => {
    const value = event.target.value
    setFilter(value)
    setFilteredCountries(allCountries.filter(c => (
      c.name.common.toLowerCase().includes(value.toLowerCase())
    )))
  }

  return (
    <div>
      <Notification message={errorMessage}/>

      <Filter
        value={filter}
        onChange={handleChange}
      />

      <SearchResults
        countries={filteredCountries}
      />

    </div>
  )
}

export default App