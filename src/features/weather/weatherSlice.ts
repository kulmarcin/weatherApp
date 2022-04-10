import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';


interface gotWeather {
  name: string;
  main: string;
  description: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
}

export interface WeatherState {
  weather: gotWeather | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: WeatherState = {
  weather: null,
  status: 'idle'
};

export const getWeatherFromNameAsync = createAsyncThunk(
  'weather/getLocation',
  async (query: string):Promise<gotWeather> => {
    
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.REACT_APP_KEY}&units=metric`
      );
      const data = await response.json();
      const obj = {
        name: data.name,
        main: data.weather.main,
        description: data.weather.description,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max
      };
      return obj;
    
  }
);

export const getWeatherAsync = createAsyncThunk(
  'weather/getWeather',
  async (amount: number) => {
    console.log('got weather for woeid');
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
      .addCase(
        getWeatherFromNameAsync.fulfilled,
        (state, action: any) => {
          state.weather = action.payload
        }
      )
      .addCase(getWeatherAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getWeatherAsync.fulfilled, (state, action) => {
        console.log('state updating');
      });
  }
});

export const {} = weatherSlice.actions;

export const selectWeather = (state: RootState) => state.weather;

export default weatherSlice.reducer;
