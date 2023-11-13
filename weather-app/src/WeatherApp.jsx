import React, { useRef } from 'react'
import { useState,} from 'react'
import { useEffect } from 'react'
import { PronosticoExt } from './PronosticoExt'

export const WeatherApp = () => {

    const API_KEY = '49fac957264482c16f59408174700d7c'
    
    const countryCode = 'ISO 3166'
    const [city, setCity] = useState('')
    const [dataWeather, setDataWeather] = useState(null)
    const [isValid, setIsValid] = useState(true)
    const [error, setError] = useState('')
    const [latLong, setLatLong] = useState([{ lat: 0, lon: 0 }])
    const [extendido, setExtendido] = useState({ list: [{ main: { temp_max: 0, temp_min: 0 } }] });
   
    
    const difVisibility = 1000

    const handleCity = (e) => {
        setCity(e.target.value)
    }

    /*
    const handleOnsubmit = async (e) => {
        e.preventDefault();
        if (city.length > 0) {
            setIsValid(true);
            
            // Primero, obtenemos el clima y las coordenadas de la ciudad
            const weatherFetched = await fetchWeather(city, setCity, setIsValid, setError, setDataWeather, setLatLong);
            const latLongFetched = await fetchLatLong(city, countryCode);
    
            // Si ambas funciones son exitosas, entonces obtenemos el pronóstico extendido
           
            fetchPronosticoExtendido(latLong[0].lat, latLong[0].lon, setExtendido);
            
        } else {
            setIsValid(false);
        }
    }
    */

    const handleOnsubmit = (e) => {
        e.preventDefault()
        if (city.length > 0){
            setIsValid(true)
            
             if((fetchWeather(city, setCity, setIsValid, setError, setDataWeather, setLatLong)) && (fetchLatLong(city, countryCode))){
             
             fetchPronosticoExtendido(latLong[0].lat, latLong[0].lon, setExtendido)
             }
        }else{
            setIsValid(false)
        }
    }
    
    //Llamado a la api para obtener los datos de temp, humedad, icono y visibilidad
    const fetchWeather = async () => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=es&units=metric&appid=${API_KEY}
            `)
            if (!response.ok) {
                throw new Error('La ciudad ingresada no es válida');
            }
            const data = await response.json()
            setDataWeather(data)
            setError('')
            localStorage.setItem('lastCity', city)
        } catch (error) {
            console.error('Ocurrió el siguiente problema: ', error)
            setError(error.message)
            setDataWeather(null)
        }
    }
    
    const fetchLatLong = async (city, countryCode) => {
        try {
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&lang=es&appid=${API_KEY}`)
            const data = await response.json()
            setLatLong(data)
        } catch (error){
            console.error('Ocurrió un error: ', error)
        }
        }


         const fetchPronosticoExtendido = async ( ) => {
            try{
            const response = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${latLong[0].lat}&lon=${latLong[0].lon}&lang=es&units=metric&cnt=35&appid=${API_KEY}`)
            const data = await response.json()
            setExtendido(data)
        }catch (error){
            console.error('Ha ocurrido un error: ', error)
        }
    }

   
   

    useEffect(() => {
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            setCity(lastCity);
            
        }
    }, []);
    
    useEffect(() => {
        if (city) {
            fetchWeather();
        }
    }, []);

    const inputRef = useRef()
    useEffect(() => {
      inputRef.current.focus()
    }, [])

   
    
    

  return (
      <> <div className='container'>
        
      <h1>Aplicación del Clima</h1>
      
      <img className='earthIcon' src="../img/clima.png" alt="" />
     
        <form onSubmit={handleOnsubmit}>
            <input className={isValid ? '' : 'inputError'} placeholder='Introduce el nombre de una ciudad'
            type="text" 
            value={city}
            ref={inputRef} 
            onChange={handleCity}
            />
            <button type='submit'>Buscar</button>
           </form>
           {
            error && <div className='messageError'> {error} </div>
           }
        {
            dataWeather && (
                <div className='cardWeather'>
                    <h2>
                        {dataWeather.name} 
                    </h2>
                    <div className='cityIcon'>
                    <img className='iconWeather' src={`https://openweathermap.org/img/wn/${dataWeather.weather[0].icon}@2x.png`} alt='Icono del clima de la ciudad'/>
                    <p className='temperature'>{dataWeather?.main?.temp} ºC</p>
                    </div>
                    <div className='subIcon'>
                        <img className='iconCondicion me-2' src="../img/condicion-climatica.png" alt="" />
                    <p className='meteorologicalConditions mt-3'>Condición Meteorológica: {dataWeather.weather[0].description}</p>
                    </div>
                    <ul className='weatherList mt-4 pb-5'>
                        <div className='subIcon'>
                            <img className='iconHumedad me-2' src="../img/humedad.png" alt="" />
                        <li>Humedad: {dataWeather.main.humidity}%</li>
                        </div>
                        <div className='subIcon'>
                        <img className='iconVisibility  me-2' src="../img/visibilidad.png" alt="" />
                        <li className='mt-3'>Visibilidad: {dataWeather.visibility / difVisibility}km</li>
                        </div>
                    </ul>
                    
                </div>
            )
        }
        </div>
        <PronosticoExt  difVisibility={difVisibility}
                        extendido={extendido}
                        fetchLatLong={fetchLatLong}
                        fetchPronosticoExtendido={fetchPronosticoExtendido}
                        city={city}
                        setExtendido={setExtendido}
                        countryCode={countryCode}>
                        
        </PronosticoExt>
        
        
    </>
  )
}