
import { ChangeEvent, MouseEvent, useState } from 'react';
import styles from './App.module.scss';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {selectWeather, getWeatherFromNameAsync} from './features/weather/weatherSlice'

function App() {
  const [input, setInput] = useState('')
  const weather = useAppSelector(selectWeather)
  const dispatch = useAppDispatch()

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const submitHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(getWeatherFromNameAsync(input))
    setInput('')
  }

  return (
    <div className={styles.App}>
      <input type="text" onChange={changeHandler} />
      <button onClick={submitHandler}>Submit</button>
      <p>Temperature in {weather.weather?.name}: {weather.weather?.temp} °C</p>
      </div>
  );
}

export default App;
