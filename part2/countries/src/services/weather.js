import axios from 'axios'
const api_key = import.meta.env.VITE_WEATHER_KEY


const getCityByLatLng = (lat, lng) => {
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${api_key}`

	const request = axios.get(url)
	return request.then(response => response.data)
}

export default { getCityByLatLng }