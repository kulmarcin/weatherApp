import { ChangeEvent, useEffect, useState } from 'react';
import styles from './App.module.scss';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  selectWeather,
  getWeatherFromNameAsync,
  getWeatherFromLocationAsync
} from './features/weather/weatherSlice';

function App() {
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const weather = useAppSelector(selectWeather);
  const dispatch = useAppDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const obj = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        dispatch(getWeatherFromLocationAsync(obj));
      },
      err => setShowInput(true)
    );
  }, [dispatch]);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const submitHandler = () => {
    dispatch(getWeatherFromNameAsync(input));
    setInput('');
    setShowInput(false);
  };

  const directionHandler = (deg: number | undefined) => {
    if (!deg) {
      return;
    }
    const dirArr = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
      'N'
    ];

    const index = Math.round((deg % 360) / 22.5) + 1;
    return dirArr[index];
  };

  return (
    <div className={styles.App}>
      {weather.status === 'failed' && (
        <button onClick={() => window.location.reload()}>Go back</button>
      )}

      {weather.status === 'success' && weather.weather && (
        <div>
          <h1>{weather.weather.name}</h1>
          <div className={styles.Main}>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather.icon}@4x.png`}
              alt="weather icon"
            ></img>

            <div>
              <p className={styles.Temp}>{weather.weather.temp}°C</p>
              <p className={styles.RealFeel}>
                Real Feel: {weather.weather.feels_like}°C
              </p>
            </div>
          </div>

          <div>
            <p className={styles.WeatherMain}>{weather.weather.main}</p>
            <p className={styles.MinMax}>
              <span>Min: {weather.weather.temp_min}°C</span>{' '}
              <span>
                Max: {weather.weather.temp_max}
                °C
              </span>
            </p>
            <div className={styles.Downside}>
              <p>Humidity: {weather.weather.humidity}%</p>
              <p>Pressure: {weather.weather.pressure} hPa</p>
              <p>
                Wind: {directionHandler(weather.weather.wind_deg)}{' '}
                {(weather.weather.wind_speed * 3.6).toFixed(2)} km/h
              </p>
              <p>
                Wind gusts:{' '}
                {weather.weather.wind_gusts
                  ? (weather.weather.wind_gusts * 3.6).toFixed(2)
                  : (weather.weather.wind_speed * 3.6).toFixed(2)}{' '}
                km/h
              </p>
            </div>
          </div>
          {!showInput && (
            <button
              className={styles.OtherCity}
              onClick={() => setShowInput(state => !state)}
            >
              Other City
            </button>
          )}
        </div>
      )}

      <div className={`${styles.Input} ${showInput ? styles.Active : ''}`}>
        <input
          type="text"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              return submitHandler();
            }
          }}
          onChange={changeHandler}
          placeholder="city"
          value={input ?? ''}
        />
        <button onClick={submitHandler}>Submit</button>
      </div>
    </div>
  );
}

export default App;
