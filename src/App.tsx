import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  
  const inputRef = useRef<HTMLInputElement>(null);

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
        <div>
          <h2>Not found</h2>
          <button onClick={() => window.location.reload()}>Go back</button>
        </div>
      )}

      {weather.status === 'success' && weather.weather && (
        <div>
          <h1>{weather.weather.name}</h1>
          <h3>{weather.weather.country}</h3>
          <h4 style={{ marginTop: '0.5rem', color: 'rgba(0,0,0,0.7)' }}>
            {weather.weather.date}
          </h4>
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
              <p>
                <span className={styles.Title}>Humidity:</span>{' '}
                {weather.weather.humidity}%
              </p>
              <p>
                <span className={styles.Title}>Pressure:</span>{' '}
                {weather.weather.pressure} hPa
              </p>
              <p>
                <span className={styles.Title}>Wind:</span>{' '}
                {directionHandler(weather.weather.wind_deg)}{' '}
                {(weather.weather.wind_speed * 3.6).toFixed(2)} km/h
              </p>
              <p>
                <span className={styles.Title}>Wind gusts:</span>{' '}
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
              onClick={() => {
                setShowInput(state => !state);
                inputRef.current!.focus();
              }}
            >
              Other City
            </button>
          )}
        </div>
      )}

      <div className={`${styles.Input} ${showInput ? styles.Active : ''}`}>
        <input
          ref={inputRef}
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
