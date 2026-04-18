import Country from "./Country"


const SearchResults = ({ countries }) => {
	if (countries.length === 1) {
		return (
			<Country country={countries[0]} />
		)
	}
	else if (countries.length > 1 && countries.length <= 10) {
		return (
			<>
			{countries.map(c => {
				return (
					<div key={c.name.common}>
						{c.name.common}
					</div>
				)
			})}
			</>
		)
	}
	else if (countries.length > 10 && countries.length < 250) {
		return (
			<div>
				Too many matches, specify another filter
			</div>
		)
	}
	else {
		return null
	}
}

export default SearchResults