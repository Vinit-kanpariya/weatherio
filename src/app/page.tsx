"use client";

import { useState, useEffect } from "react";
import { getWeather } from "../lib/getWeather";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaTemperatureHigh, FaWind } from "react-icons/fa";
import { WiSunrise, WiSunset, WiHumidity, WiCelsius } from "react-icons/wi";

interface weatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
}

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<weatherData>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch weather when city changes
  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(undefined);
    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch {
      setError("City not found ❌");
    }
    setLoading(false);
  };

  // Dynamic Background based on weather condition
  let backgroundClass = "";
  if (weather) {
    if (weather.weather[0].main === "Clear") {
      backgroundClass = "bg-blue-500"; // Sunny
    } else if (weather.weather[0].main === "Rain") {
      backgroundClass = "bg-blue-800"; // Rainy
    } else {
      backgroundClass = "bg-gray-500"; // Cloudy or other
    }
  }

  // Smooth transitions for day/night mode
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen transition-all duration-500 ease-in-out ${backgroundClass} ${
        darkMode ? "bg-gray-900 text-white" : "bg-yellow-100 text-black"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all z-10"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          <SunIcon className="w-6 h-6 text-yellow-400" />
        ) : (
          <MoonIcon className="w-6 h-6 text-gray-800" />
        )}
      </button>

      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl shadow-md w-full sm:w-80 md:w-96 lg:w-1/2 text-center">
        <h1 className="text-3xl font-bold mb-4 md:text-4xl"><TiWeatherPartlySunny className="inline-block" /> Weather App</h1>

        {/* Input and Button */}
        <div className="flex gap-3 mt-3 flex-col sm:flex-row sm:gap-4 sm:justify-center">
          <input
            type="text"
            placeholder="Enter city name"
            className="w-full sm:w-72 md:w-80 lg:w-96 px-4 py-2 rounded-md text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={fetchWeather}
            className={`${
              darkMode
                ? "bg-white hover:bg-gray-500 text-black"
                : "bg-black hover:bg-blue-700 text-white"
            } px-5 py-2 rounded-md transition-all duration-1000 mt-3 sm:mt-0`}
          >
            Search
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-5 flex justify-center">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="mt-6">
            <h2 className="text-3xl font-semibold">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-xl">{weather.main.temp}<WiCelsius className="inline-block size-10"/></p>
            <p className="capitalize">{weather.weather[0].description}</p>

            {/* Additional Weather Details */}
            <div className="mt-4 text-sm bg-grey bg-opacity-20 p-3 rounded-lg flex flex-wrap gap-4 justify-center">
              <p className="flex items-center"><FaTemperatureHigh className="inline-block size-5 pr-1" /> {weather.main.feels_like}°C</p>
              <p className="flex items-center"><FaWind className="inline-block size-5 pr-1" /> {weather.wind.speed} m/s</p>
              <p className="flex items-center"><WiHumidity className="inline-block size-8 pr-1" /> {weather.main.humidity}%</p>
              <p className="flex items-center"><WiSunrise className="inline-block size-8 pr-1" /> {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p className="flex items-center"><WiSunset className="inline-block size-8 pr-1" /> {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
