import Weather from "./Weather"


const Country = ({ country }) => {
  return (
	<>
	<h1>{country.name.common}</h1>
	<div>Capital {country.capital}</div>
	<div>Area {country.area}</div>

	<h2>Languages</h2>
	<ul>
		{Object.values(country.languages).map(lang => (
			<li key={lang}>{lang}</li>
		))}
	</ul>

	<img width="200px" src={country.flags.png} alt={country.flags.alt} />

	<Weather country={country}/>
	</>
  )
}

export default Country