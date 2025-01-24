"use client";

import { useState, useEffect } from "react";
import { getWeather } from "../lib/getWeather";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaTemperatureHigh, FaWind } from "react-icons/fa";
import { WiSunrise, WiSunset, WiHumidity, WiCelsius } from "react-icons/wi";
import Image from "next/image";

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
    icon: string;
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
      setError("City not found !");
    }
    setLoading(false);
  };

  let backgroundClass = "";
  if (weather) {
    if (weather.weather[0].main === "Clear") {
      backgroundClass = "bg-blue-500";
    } else if (weather.weather[0].main === "Rain") {
      backgroundClass = "bg-blue-800"; 
    } else {
      backgroundClass = "bg-gray-500";
    }
  }

  //Dark mode
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
    
      <button
      {
        ...darkMode
          ? { className: "absolute top-4 right-4 p-2 rounded-full bg-yellow-400 bg-opacity-70 transition-all duration-2000 z-10" }
          : { className: "absolute top-4 right-4 p-2 rounded-full bg-stone-800 bg-opacity-70  transition-all duration-2000 z-10" } 
      }
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          <SunIcon className="w-6 h-6 text-stone-900 hover:text-stone-50 transition-smooth duration-200" />
        ) : (
          <MoonIcon className="w-6 h-6 text-stone-200 hover:text-stone-50" />
        )}
      </button>

      <div className="flex flex-col items-center justify-center ml-3 mr-3 md:px-3.5 md:py-3.5 lg:px-8 lg:py-12 xl:px-12 xl:py-12 p-4 rounded-md">
        <h1 className="text-3xl font-bold mb-4 md:text-4xl"><TiWeatherPartlySunny className="inline-block" /> Weather App</h1>

        <div className="flex gap-3 mt-3 flex-col sm:flex-row sm:gap-4 sm:justify-center">
          <input
            type="text"
            placeholder="Enter city name"
            className="w-full sm:w-72 md:w-80 lg:w-96 px-4 py-2 rounded-md text-black border-none focus:outline-none focus:ring-1 focus:ring-stone-800 hover:scale-105 transition-all duration-1000 ease-in-out"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={fetchWeather}
            className={`${
              darkMode
                ? "bg-amber-300 hover:bg-amber-200 text-black"
                : "bg-black hover:bg-blue-700 text-white"
            } px-5 py-2 rounded-md mt-3 sm:mt-0 transition-all transform hover:scale-110 duration-1000`}
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="mt-5 flex justify-center">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {weather && !loading && (
          <div className="flex flex-col items-center mt-6">
            <h2 className="text-3xl font-semibold">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-xl">{weather.main.temp}<WiCelsius className="inline-block size-10"/></p>
            <p className="capitalize">{weather.weather[0].description}</p>

            <Image
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              width={100}
              height={100}
            />

            <div className="mt-4 text-sm bg-grey bg-opacity-20 p-3 rounded-lg flex flex-wrap gap-4 justify-center">
              <p className="flex items-center hover:scale-110 transition-ease-in-out duration-900"><FaTemperatureHigh className="inline-block size-5 pr-1" /> {weather.main.feels_like}°C</p>
              <p className="flex items-center hover:scale-110 transition-ease-in-out duration-900"><FaWind className="inline-block size-5 pr-1" /> {weather.wind.speed} m/s</p>
              <p className="flex items-center hover:scale-110 transition-ease-in-out duration-900"><WiHumidity className="inline-block size-8 pr-1" /> {weather.main.humidity}%</p>
              <p className="flex items-center hover:scale-110 transition-ease-in-out duration-900"><WiSunrise className="inline-block size-8 pr-1" /> {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p className="flex items-center hover:scale-110 transition-ease-in-out duration-900"><WiSunset className="inline-block size-8 pr-1" /> {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
