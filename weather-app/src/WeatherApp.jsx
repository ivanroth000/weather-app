import React from 'react'
import { useState } from 'react'

export const WeatherApp = () => {

    const API_KEY = '49fac957264482c16f59408174700d7c'
    const [city, setCity] = useState('')
    const [dataWeather, setDataWeather] = useState(null)
    const [isValid, setIsValid] = useState(true)
    

    const handleCity = (e) => {
        setCity(e.target.value)
    }

    const handleOnsubmit = (e) => {
        e.preventDefault()
        if (city.length > 0){
            setIsValid(true)
            fetchWeather()
        }else{
            setIsValid(false)
        }
    }

    const fetchWeather = async () => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}
            `)
            const data = await response.json()
            setDataWeather(data)
        } catch (error) {
            console.error('Ocurrio el siguiente problema: ', error)
        }
    }

  return (
      <> <div className='container'>
      <h1>Aplicación del Clima</h1>
        <form onSubmit={handleOnsubmit}>
            <input className={isValid ? '' : 'inputError'} placeholder='Introduce el nombre de una ciudad'
            type="text" 
            value={city} 
            onChange={handleCity}
            />
            <button type='submit'>Buscar</button>
        </form>
        {
            dataWeather && (
                <div>
                    <h2>
                        {dataWeather.name}
                    </h2>
                    <p>
                        Temperatura: {dataWeather?.main?.temp} ºC
                    </p>
                    <img src={`https://openweathermap.org/img/wn/${dataWeather.weather[0].icon}@2x.png`} alt='Icono del clima de la ciudad'/>
                </div>
            )
        }
        </div>
    </>
  )
}
