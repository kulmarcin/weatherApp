
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import styles from './App.module.scss';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {selectWeather, getLocationAsync} from './features/weather/weatherSlice'

function App() {
  const [input, setInput] = useState('')
  const weather = useAppSelector(selectWeather)
  const dispatch = useAppDispatch()

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const submitHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(getLocationAsync(input))
    setInput('')
  }

  return (
    <div className={styles.App}>
      <input type="text" onChange={changeHandler} />
      <button onClick={submitHandler}>Submit</button>
      {weather.woeid}
      </div>
  );
}

export default App;
