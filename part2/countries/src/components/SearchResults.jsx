import { useEffect, useState } from "react"
import Country from "./Country"


const SearchResults = ({ countries }) => {
	const [openCountries, setOpenCountries] = useState([])

	useEffect(() => {
		setOpenCountries([])
	}, [countries])

	const handleShowButton = (index) => {
		if (openCountries.includes(index)) {
			setOpenCountries(openCountries.filter(i => i !== index))
		}
		else {
			setOpenCountries([...openCountries, index])
		}
	}

	if (countries.length === 1) {
		return (
			<Country country={countries[0]} />
		)
	}
	else if (countries.length > 1 && countries.length <= 10) {
		return (
			<>
			{countries.map((c, index) => {
				return (
					<div key={c.name.common}>
						<div>
							{c.name.common} <></>
							<button
								key={c.name.common}
								onClick={() => handleShowButton(index)}>
								{openCountries.includes(index) ? 'hide' : 'show'}
							</button>
						</div>
						{openCountries.includes(index) && (
							<Country country={c}/>
						)}
					</div>
				)
			})}
			</>
		)
	}
	else if (countries.length > 10 && countries.length < 250) {
		return (
			<div>Too many matches, specify another filter</div>
		)
	}
	else {
		return null
	}
}

export default SearchResults