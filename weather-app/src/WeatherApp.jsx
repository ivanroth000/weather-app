import React, { useRef } from 'react'
import { useState,} from 'react'
import { useEffect } from 'react'

export const WeatherApp = () => {

    const API_KEY = '49fac957264482c16f59408174700d7c'
    const countryCode = 'ISO 3166'
    const difKelvin = 273.15
    const [city, setCity] = useState('')
    const [dataWeather, setDataWeather] = useState(null)
    const [isValid, setIsValid] = useState(true)
    const [error, setError] = useState('')
    const [latLong, setLatLong] = useState([{ lat: 0, lon: 0 }])
    const [extendido, setextendido] = useState({ list: [{ main: { temp_max: 0, temp_min: 0 } }] });
    
    
    const difVisibility = 1000

    const handleCity = (e) => {
        setCity(e.target.value)
    }

    const handleOnsubmit = (e) => {
        e.preventDefault()
        if (city.length > 0){
            setIsValid(true)
            fetchWeather()
            fetchLatLong()
            fetchPronosticoExtendido()
        }else{
            setIsValid(false)
        }
    }
    //Llamado a la api para obtener los datos de temp, humedad, icono y visibilidad
    const fetchWeather = async () => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}
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

    // Llamado a la api para obtener la longitud y latitud de una ciudad y usar esos
    // datos para conseguir el pronóstico extendido de 5 días
    const fetchLatLong = async () => {
        try {
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&appid=${API_KEY}`)
            const data = await response.json()
            setLatLong(data)
        } catch (error){
            console.error('Ocurrió un error: ', error)
        }
    }
    
    // Llamado a la api para hacer un pronostico extendido de los proximos 5 días
    
    const latitud = latLong[0].lat
    const longitud = latLong[0].lon
    const fetchPronosticoExtendido = async () => {
        try{
            const response = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${latitud}&lon=${longitud}&units=metric&cnt=5&appid=${API_KEY}`)
            const data = await response.json()
            setextendido(data)
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

    const prox5Dias = extendido.list.filter((item, index) => index < 40)
    
    

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
                    <p className='meteorologicalConditions mt-3'>Meteorological conditions: {dataWeather.weather[0].description}</p>
                    </div>
                    <ul className='weatherList mt-4 pb-5'>
                        <div className='subIcon'>
                            <img className='iconHumedad me-2' src="../img/humedad.png" alt="" />
                        <li>Humidity: {dataWeather.main.humidity}%</li>
                        </div>
                        <div className='subIcon'>
                        <img className='iconVisibility  me-2' src="../img/visibilidad.png" alt="" />
                        <li className='mt-3'>Visibility: {dataWeather.visibility / difVisibility}km</li>
                        </div>
                    </ul>
                    
                </div>
            )
        }
        </div>
        <div className='container'>
            {prox5Dias.map((item, index) => {
            const tempMax = item.main.temp_max;
            const tempMin = item.main.temp_min;
            const dia = new Date(item.dt * 1000).toLocaleDateString();
            const humedad = item.main.humidity;
            const visibilidad = item.visibility;
            const descripcion = item.weather[0].description;
            const icono = item.weather[0].icon;
            const urlIcono = `http://openweathermap.org/img/w/${icono}.png`;

            return(
            <div key={index}>
                <h1>{dia}</h1>
                <img src={urlIcono} alt="Imagen del clima del día" />
                <h2>{tempMin}/{tempMax}</h2>
                <p>Humidity:{humedad}</p>
                <p>visibility:{visibilidad}</p>
                <p>{descripcion}</p>
                
            </div>)
    })}
        </div>
    </>
  )
}
