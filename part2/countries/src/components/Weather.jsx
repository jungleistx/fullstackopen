import { useEffect, useState } from 'react'
import WeatherService from '../services/weather'


const Weather = ({ country }) => {
	const latitude =
			country.capitalInfo?.latlng?.[0]
		??	country.latlng?.[0]
	const longitude =
			country.capitalInfo?.latlng?.[1]
		??	country.latlng?.[1]

	const [weather, setWeather] = useState(null)
	const [iconUrl, setIconUrl] = useState(null)

	useEffect(() => {
		WeatherService
			.getCityByLatLng(latitude, longitude)
			.then(weatherData => {
				setWeather(weatherData)
				setIconUrl(
					`https://openweathermap.org/payload/api/media/file/${weatherData.weather[0].icon}.png`
				)
			})
			.catch(error => {
				console.error(error);
			})
	}, [])

	if (!weather) {
		return null
	}

  return (
	<div>
		<h2>Weather in {weather.name}</h2>
		<div>
			Temperature {weather.main.temp} Celsius
		</div>

		<div>
			<img src={iconUrl} alt="Weather icon" />
		</div>

		<div>
			Wind {weather.wind.speed} m/s
		</div>
		<br />
	</div>
  )
}

export default Weather
