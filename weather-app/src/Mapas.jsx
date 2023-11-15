import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

export const Mapas = ({ API_KEY, city, countryCode, latLong, fetchLatLong }) => {

    const [mapa, setMapa] = useState(null)
    const layer = 'temp_new'
    const z = 2

    useEffect(() => {
        if(latLong && latLong.length > 0){
                    const latRad = Math.PI *latLong[0].lat / 180;
                    const n = Math.pow(2, z);
                    const x = Math.floor((latLong[0].lon + 180) / 360 * n);
                    const y = Math.floor((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n);
                    const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${API_KEY}`;
                    setMapa(url);
        }
    }, [city]);


  return (
    <>
        
        {mapa && <img className='mapaImg' src={mapa} alt="Mapa de temperatura" />}
    </>
  )
}
