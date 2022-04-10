import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface WeatherState {
  woeid: number | null;
  weather: Array<{
    weather_state_name: string;
    weather_state_abbr: string;
    applicable_date: Date;
    min_temp: number;
    max_temp: number;
    the_temp: number;
    wind_direction_compass: string;
    wind_speed: number;
    humidity: number;
  }>;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: WeatherState = {
  woeid: null,
  weather: [], //weather for 6 days
  status: 'idle'
};

export const getLocationAsync = createAsyncThunk(
  'weather/getLocation',
  async (query: string) => {
    try {
      const response = await fetch(
        `https://www.metaweather.com/api/location/search/?query=${query}`
      );
      const data = response.json();
      return data
    } catch (err: any) {
      console.log(err);
      return err.message
    }
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
      .addCase(getLocationAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        getLocationAsync.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.woeid = action.payload;
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
