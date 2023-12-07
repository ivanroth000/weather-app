import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { PronosticoExt } from "./PronosticoExt";
import { Mapas } from "./Mapas";
import imagenes from "./assets/imagenes";

export const WeatherApp = () => {
  const API_KEY = "49fac957264482c16f59408174700d7c";
  const countryCode = "ISO 3166";
  const [city, setCity] = useState("");
  const [dataWeather, setDataWeather] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [latLong, setLatLong] = useState([{ lat: 0, lon: 0 }]);
  const [extendido, setExtendido] = useState({
    list: [{ main: { temp_max: 0, temp_min: 0 } }],
  });
  const difVisibility = 1000;
  const [localTime, setLocalTime] = useState(null);
  //Setea la ciudad
  const handleCity = (e) => {
    setCity(e.target.value);
  };

  //Maneja los fetchs y su validación
  const handleOnsubmit = async (e) => {
    e.preventDefault();
    const ciudadSinEspacios = city.trim();
    if (ciudadSinEspacios.length > 0) {
      setIsValid(true);

      try {
        // Espera a que se completen las operaciones asíncronas
        await fetchWeather(
          city,
          setCity,
          setIsValid,
          setError,
          setDataWeather,
          setLatLong
        );
        await fetchLatLong(city, countryCode);
        await fetchPronosticoExtendido();
      } catch (error) {
        setIsValid(false);
        console.error("Ocurrió un error en el proceso: ", error);
      }
    } else {
      setIsValid(false);
    }
  };

  //Obtiene los datos de temp, humedad, icono y visibilidad
  const fetchWeather = async () => {
    try {
      const response =
        await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=es&units=metric&appid=${API_KEY}
            `);
      if (!response.ok) {
        throw new Error("La ciudad ingresada no es válida");
      }
      const data = await response.json();
      setDataWeather(data);
      setError("");
      const timezoneOffsetInSeconds = data.timezone;
      const localDate = new Date(
        new Date().getTime() + timezoneOffsetInSeconds * 1000
      );
      const localTime = localDate.toLocaleString("es-AR", {
        hour12: true,
        timeZone: "GMT",
        hour: "2-digit",
        minute: "2-digit",
      }).toUpperCase()
      setLocalTime(localTime);
    } catch (error) {
      console.error("Ocurrió el siguiente problema: ", error);
      setError(error.message);
      setDataWeather(null);
    }
  };

  //Obtiene la ciudad
  const fetchLatLong = async (city, countryCode) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&lang=es&appid=${API_KEY}`
      );
      const data = await response.json();
      setLatLong(data);
    } catch (error) {
      console.error("Ocurrió un error: ", error);
    }
  };

  //Obtiene la latitud y longitud de la ciudad
  const fetchPronosticoExtendido = async () => {
    const lat = latLong[0].lat;
    const lon = latLong[0].lon;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=es&units=metric&cnt=35&appid=${API_KEY}`
      );
      const data = await response.json();
      setExtendido(data);
    } catch (error) {
      console.error("Ha ocurrido un error: ", error);
    }
  };

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      setCity(lastCity);
    }
  }, []);

  useEffect(() => {
    if (city) {
      fetchWeather();
    }
  }, []);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      {" "}
      <div className="container">
        <h1>Aplicación del Clima</h1>

        <img
          className="earthIcon"
          src={imagenes.img2}
          alt="Logo de la tierra con las condiciones climáticas"
        />

        <form onSubmit={handleOnsubmit}>
          <input
            className={isValid ? "" : "inputError"}
            placeholder="Introduce el nombre de una ciudad"
            type="text"
            value={city}
            ref={inputRef}
            onChange={handleCity}
          />
          <button type="submit">Buscar</button>
        </form>
        {error && <div className="messageError"> {error} </div>}

        {dataWeather && (
          <>
            <div className="weatherMapa">
              <div className="cardWeather">
                <h2>
                  {dataWeather.name}
                </h2>
                <p className="horaLocal">Hora local: {localTime}</p>
                <div className="cityIcon">
                  <img
                    className="iconWeather"
                    src={`https://openweathermap.org/img/wn/${dataWeather.weather[0].icon}@2x.png`}
                    alt="Icono del clima de la ciudad"
                  />
                  <p className="temperature">{dataWeather?.main?.temp} ºC</p>
                </div>
                <div className="subIcon">
                  <img
                    className="iconCondicion me-2"
                    src={imagenes.img3}
                    alt="Condición climática"
                  />
                  <p className="meteorologicalConditions mt-3">
                    Condición Meteorológica:{" "}
                    {dataWeather.weather[0].description}
                  </p>
                </div>
                <ul className="weatherList mt-4 pb-5">
                  <div className="subIcon">
                    <img
                      className="iconHumedad me-2"
                      src={imagenes.img4}
                      alt="Humedad"
                    />
                    <li className="fw-bold">Humedad: {dataWeather.main.humidity}%</li>
                  </div>
                  <div className="subIcon">
                    <img
                      className="iconVisibility  me-2"
                      src={imagenes.img5}
                      alt="Visibilidad"
                    />
                    <li className="mt-3 fw-bold">
                      Visibilidad: {dataWeather.visibility / difVisibility}km
                    </li>
                  </div>
                </ul>
              </div>
              <div className="mapa">
                <Mapas
                  API_KEY={API_KEY}
                  city={city}
                  countryCode={countryCode}
                  latLong={latLong}
                  handleOnsubmit={handleOnsubmit}
                  fetchLatLong={fetchLatLong}
                  enviarDatosAlPadre={(datos) =>
                    console.log("Datos recibidos en WeatherApp:", datos)
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
      {!error && (
        <PronosticoExt
          difVisibility={difVisibility}
          extendido={extendido}
          fetchLatLong={fetchLatLong}
          fetchPronosticoExtendido={fetchPronosticoExtendido}
          city={city}
          setExtendido={setExtendido}
          countryCode={countryCode}
          enviarAlPadrePronosticoExtendido={(latLong) =>
            console.log("Datos recibidos en WeatherApp:", latLong)
          }
        />
      )}
    </>
  );
};
