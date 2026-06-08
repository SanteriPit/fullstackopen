import { useState } from "react"
import { useEffect } from "react"
import axios from 'axios'

const App = () => {
  const [countryQuery, setCountryQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const data = response.data
        setCountries(data)
      })  
  }, [])

  const handleQuery = (event) => {
    setCountryQuery(event.target.value)
    setCountry(event.target.value)
  }

  const matches = countries.filter(country => 
    country.name.common
      .toLowerCase()
      .includes(countryQuery.toLowerCase())
  )

  const selectedCountry = matches.length === 1 ? matches[0] : null

  useEffect(() => {
    if (!selectedCountry) return

    const capital = selectedCountry.capital[0]

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [selectedCountry])

  return (
    <div>
      find countries <input value={countryQuery} onChange={handleQuery}></input>
      {matches.length === 1 ?
      <div>
        <h1>{matches[0].name.common}</h1>
        <p>Capital {matches[0].capital}</p>
        <p>Area {matches[0].area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(matches[0].languages).map(language =>
            <li key={language}>{language}</li>
          )}
        </ul>
        <img src={matches[0].flags.png}></img>
        {weather && (
          <>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`}></img>
            <p>Wind {weather.wind.speed} m/s</p>
          </>
        )}
      </div>
      :
      matches.length < 10 ?
      matches.map(country => (
        <p key={country.cca3}>
          {country.name.common}
          <button onClick={() => setCountryQuery(country.name.common)}>Show</button>
        </p>
      )) : <p>Too many matches</p>}
    </div>
  )
}
 
export default App