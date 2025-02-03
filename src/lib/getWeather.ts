import { cache } from "react";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";
const BASE_URL_CURRENT = "https://api.openweathermap.org/data/2.5/weather";

// Define interfaces based on the OpenWeatherMap API response
interface Weather {
  main: string;
  description: string;
  icon: string;
}

interface Wind {
  speed: number;
}

interface MainWeather {
  temp: number;
  humidity: number;
  pressure: number;
  feels_like: number;
}

interface Sys {
  sunrise: number;
  sunset: number;
}

interface ForecastItem {
  dt: number;
  main: MainWeather;
  weather: Weather[];
  wind: Wind;
}

interface ForecastResponse {
  city: {
    name: string;
    country: string;
  };
  list: ForecastItem[];
}

interface CurrentWeatherResponse {
  sys: Sys;
}

interface DailyWeather {
  dt: number;
  main: MainWeather & { city: string; country: string };
  weather: Weather[];
  wind: Wind;
  sys: Sys;
}

export async function getWeather(city: string): Promise<{ city: string; daily: DailyWeather[] }> {
  // Fetch current weather data to get sunrise and sunset
  const currentResponse = await fetch(`${BASE_URL_CURRENT}?q=${city}&appid=${API_KEY}&units=metric`,{cache :"force-cache"});
  if (!currentResponse.ok) throw new Error("Current weather data not found");

  const currentData: CurrentWeatherResponse = await currentResponse.json();

  // Fetch forecast data
  const response = await fetch(`${BASE_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric`,{cache :"force-cache"});
  if (!response.ok) throw new Error("Weather forecast data not found");

  const data: ForecastResponse = await response.json();

  if (!data.list || data.list.length === 0) {
    throw new Error("Invalid data received from API");
  }

  // Extract unique daily forecasts (every 8 readings ≈ 24 hours)
  const dailyData: DailyWeather[] = data.list
    .filter((_reading, index) => index % 8 === 0) // Every 8 readings (~24h)
    .map((reading): DailyWeather => ({
      dt: reading.dt,
      main: {
        ...reading.main,
        city: data.city.name,
        country: data.city.country,
      },
      weather: reading.weather,
      wind: reading.wind,
      sys: {
        sunrise: currentData.sys.sunrise, // Use current weather data for sunrise
        sunset: currentData.sys.sunset, // Use current weather data for sunset
      },
    }));

  return { city: data.city.name, daily: dailyData };
}

export default getWeather;
