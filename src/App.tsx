import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import styles from './App.module.scss';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  selectWeather,
  getWeatherFromNameAsync,
  getWeatherFromLocationAsync
} from './features/weather/weatherSlice';

function App() {
  const [input, setInput] = useState('');
  const [locationGranted, setLocationGranted] = useState(true);
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
      err => setLocationGranted(false)
    );
  }, []);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const submitHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(getWeatherFromNameAsync(input));
    setInput('');
  };

  return (
    <div className={styles.App}>
      {!locationGranted && (
        <div>
          <input type="text" onChange={changeHandler} />
          <button onClick={submitHandler}>Submit</button>
        </div>
      )}
      <p>
        Temperature in {weather.weather?.name}: {weather.weather?.temp} °C
      </p>
    </div>
  );
}

export default App;
