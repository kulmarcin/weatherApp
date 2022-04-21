import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

import { countryList } from '../../countries';

interface latLon {
  lat: number;
  lon: number;
}

interface gotWeather {
  name: string;
  main: string;
  description: string;
  icon: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  wind_gusts: number;
  date: string;
  country: string;
}

export interface WeatherState {
  weather: gotWeather | null;
  status: 'idle' | 'loading' | 'failed' | 'success';
}

const initialState: WeatherState = {
  weather: null,
  status: 'idle'
};

export const getWeatherFromNameAsync = createAsyncThunk(
  'weather/getWeatherFromName',
  async (query: string): Promise<gotWeather> => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.REACT_APP_KEY}&units=metric`
    );
    const data = await response.json();
    const obj = {
      name: data.name,
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      wind_gusts: data.wind.gust,
      date: new Date(data.dt*1000).toLocaleString(), 
      country: countryList[data.sys.country]
    };
    return obj;
  }
);

export const getWeatherFromLocationAsync = createAsyncThunk(
  'weather/getWeatherFromLocation',
  async (fetchData: latLon): Promise<gotWeather> => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${fetchData.lat}&lon=${fetchData.lon}&appid=${process.env.REACT_APP_KEY}&units=metric`
    );
    const data = await response.json();
    const obj = {
      name: data.name,
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      wind_gusts: data.wind.gust,
      date: new Date(data.dt*1000).toLocaleString(),
      country: countryList[data.sys.country]
    };
    return obj;
  }
);

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getWeatherFromNameAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getWeatherFromNameAsync.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.status = 'success';
      })
      .addCase(getWeatherFromNameAsync.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(getWeatherFromLocationAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getWeatherFromLocationAsync.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.status = 'success';
      })
      .addCase(getWeatherFromLocationAsync.rejected, (state, action) => {
        state.status = 'failed';
      });
  }
});

export const selectWeather = (state: RootState) => state.weather;

export default weatherSlice.reducer;
