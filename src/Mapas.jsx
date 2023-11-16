import React from 'react'
import { useState, CSSProperties } from 'react'
import { useEffect } from 'react'
import ClipLoader from "react-spinners/ClipLoader";

export const Mapas = ({ API_KEY, city, countryCode, latLong, fetchLatLong }) => {

    const [mapa, setMapa] = useState(null)
    const layer = 'temp_new'
    const z = 2
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
      setTimeout(() => {
        if(latLong && latLong.length > 0){
                    const latRad = Math.PI *latLong[0].lat / 180;
                    const n = Math.pow(2, z);
                    const x = Math.floor((latLong[0].lon + 180) / 360 * n);
                    const y = Math.floor((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n);
                    const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${API_KEY}`;
                    setMapa(url);
                    setDatos('datos cargados')
                    setCargando(false)
                  }
                }, 700)
    }, [city]);


  return (
    <>
    {cargando ? (
       <ClipLoader className='spinner'
       aria-label="Loading Spinner"
       data-testid="loader"
     />
   ) : (

        mapa && <img className='mapaImg' src={mapa} alt="Mapa de temperatura" />
      )  
    }
        
    </>
  )
}