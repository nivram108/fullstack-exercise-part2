import React, { useState, useEffect } from 'react'
import axios from 'axios'
const weatherAPIKey= process.env.REACT_APP_API_KEY
const Filter = ({handleFilterChange, filterName}) => {
  return(
    <div>
      find countries: <input 
      onChange={handleFilterChange}
      value={filterName}/>
    </div>
  )
}

const Countries = ({shownCountries}) => {
  return (
    <>
    {shownCountries.map(country => 
    <Country data={country}/>)}
    </>
  )
}
const Country = ({data}) => {
  const [ show, setShown] = useState(false)

  const handleShowClicked = () => {
    setShown(!show)
  }
  const text = (show) ? 'hide' : 'show'
  return(
    <>
    {data.name} <button onClick={handleShowClicked}>{text}</button> <br/>
    <CountryDetails data={data} show={show}/>
    </>
  )
}
const CountryDetails = ({data, show}) => {
  const country = data.name
  const code = data.alpha3Code
  let c = {}
  const [ details, setDetails ] = useState({})
  const [ weather, setWeather ] = useState({})
  const fetchCountryDetailsHook = () => {
    console.log('load details')
    const eventHandler = (response) => {
      console.log('promise fulfilled', response.data)
      console.log('response', response.data['capital'])
      setDetails(response.data)
    }
    const promise = axios.get('https://restcountries.eu/rest/v2/alpha/' + code)
    promise.then(eventHandler)
  }

  useEffect(fetchCountryDetailsHook, [])

  const fetchCountryWeatherHook = () => {
    console.log('load details')
    const eventHandler = (response) => {
      console.log('promise fulfilled', response.data)
      console.log('response', response.data['capital'])
      setWeather(response.data)
    }
    const promise = axios.get('http://api.weatherstack.com/current?access_key=' + weatherAPIKey + '&query=' + data.capital)
    promise.then(eventHandler)
  }
  useEffect(fetchCountryWeatherHook, [])
  
  if(details.languages === undefined || show === false || weather.current === undefined) {
    return(
      <>
      </>
    )
  } else {
    return (
      <>
        <h2>{country} </h2>
        capital {details.capital}
        <br/>
        population {details.population}
        <h3>languages</h3>
        <ul>
          {details.languages.map(language=>
            <li key={language.name}>{language.name}</li>)}
        </ul>
        <img src={details.flag} width="20%" height="20%"/>
        <br/>
        <h3>Weather in {data.capital}</h3>
        temperature: {weather.current.temperature} Celcius <br/>
        <b>wind</b> {weather.current.wind_speed} mph, direction {weather.current.wind_dir}
      </>
    )
  }
  
}


const App = () => {
  const [ countries, setCountries ] = useState([]) 
  const [ filterName, setFilterName ] = useState('swi')
  const shownCountries = countries.filter(country => country.name.toLowerCase().includes(filterName.toLowerCase()))

  useEffect(()=> {
    console.log('effect')
    const eventHandler = (response) => {
      console.log('promise fulfilled')
      setCountries(response.data)
    }
    const promise = axios.get('https://restcountries.eu/rest/v2/all')
    console.log("promise:", promise)
    promise.then(eventHandler)
  }, [])
  
  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }
  if (shownCountries.length > 10) {
    return (
      <div>
        <Filter handleFilterChange={handleFilterChange} filterName={filterName}/>
        Too many matches, specify another filter
      </div>
    )
  } else if (shownCountries.length === 1) {
    return (
      <div>
        <Filter handleFilterChange={handleFilterChange} filterName={filterName}/>
        <CountryDetails data={shownCountries[0]} show={true}/>
      </div>
    )
  } else {
    return (
      <div>
        <Filter handleFilterChange={handleFilterChange} filterName={filterName}/>
          <Countries shownCountries={shownCountries}/>
      </div>
    )
  }
  
}

export default App