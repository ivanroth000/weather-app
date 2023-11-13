import { useState, useEffect} from 'react'



    
 export const PronosticoExt = ({ extendido, fetchLatLong, fetchPronosticoExtendido, city, countryCode, setExtendido, difVisibility }) => {
    
    const [latLong, setLatLong] = useState([{ lat: 0, lon: 0 }])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Llama a fetchLatLong para obtener datos y actualizar el estado
                const latLongData = await fetchLatLong(city, countryCode);
                setLatLong(latLongData);
        
                // Asegúrate de que latLong se haya actualizado antes de llamar a fetchPronosticoExtendido
                if (latLongData && latLongData.length > 0) {
                  fetchPronosticoExtendido(latLongData[0].lat, latLongData[0].lon, setExtendido);
                }
              } catch (error) {
                console.error('Error al obtener datos de latitud y longitud:', error);
              }
            };
        
            fetchData();
          }, [city, countryCode, fetchLatLong, fetchPronosticoExtendido, setExtendido]);
        
    
    const API_KEY = '49fac957264482c16f59408174700d7c'
    
    
    
    
    const prox5Dias = extendido.list.filter((item, index) => index < 40)
    
    return (
      <>
        <div className='container containerExtendido'>
            {prox5Dias.map((item, index) => {
            const tempMax = item.main.temp_max;
            const tempMin = item.main.temp_min;
            const fecha = new Date(item.dt * 1000).toLocaleDateString();
            const humedad = item.main.humidity;
            const visibilidad = item.visibility;
           
            const weatherIcon = item.weather && item.weather.length > 0 ? item.weather[0].icon : '';
            const weatherDescription = item.weather && item.weather.length > 0 ? item.weather[0].description : '';
        
            

           return(
            
            <div className={`container mx-2 cardExtendido cardExtendido-${index}`} key={index}>
                <h1>{fecha}</h1>
              <div className='cityIcon'>
                <img className='iconWeatherExtendido'
                    src={`http://openweathermap.org/img/w/${weatherIcon}.png`}
                    alt={weatherDescription}
                  />
                    <p className='temperatureExtendido mt-2'>
                      <span className='estiloTempMin'>{tempMin}ºC</span>/
                      <span className='estiloTempMax'>{tempMax}ºC</span>
                    </p>
                    
              </div>
                <p className='meteorologicalConditionsExtendido'>Condición meteorológica: {weatherDescription}</p>
                <div className='subIconExtendido'>
                            <img className='iconHumedad me-2' src="../img/humedad.png" alt="" />
                          <p className='mt-2'>Humedad: {humedad}%</p>
                </div>
                <div className='subIconExtendido'>
                  <img className='iconVisibility  mb-3' src="../img/visibilidad.png" alt="" />
                  <p className='mt-3 ms-2'>Visibilidad: {visibilidad / difVisibility}km</p>
                </div>
                
                
            </div>)
    })}
        </div>
    </>
  )
}
