"use client";

import { useState, useEffect } from "react";
import { getWeather } from "@/lib/getWeather";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { TiWeatherPartlySunny } from "react-icons/ti";
import Link from "next/link";
import Image from "next/image";
import { WiBarometer, WiHumidity, WiSunrise, WiSunset } from "react-icons/wi";
import { BsEmojiSunglasses } from "react-icons/bs";
import { GiWindTurbine } from "react-icons/gi";
import { IoHome } from "react-icons/io5";

interface DailyWeather {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
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
  };
}

interface WeatherData {
  city: string;
  daily: DailyWeather[];
}

export default function Forecast() {
  const [weather, setWeather] = useState<WeatherData | undefined>(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference and fetch weather data
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setDarkMode(storedTheme === "dark");

    const fetchWeather = async () => {
      if (typeof window === 'undefined') return;
      
      const params = new URLSearchParams(window.location.search);
      const city = params.get('city');
      
      if (!city) {
        setError("No city specified");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getWeather(city);
        setWeather(data);
      } catch {
        setError("City not found!");
      }
      setLoading(false);
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen transition-all duration-500 ease-in-out px-4 sm:px-8 lg:px-16 ${
        darkMode ? "bg-gray-900 text-white" : "bg-yellow-100 text-black"
      }`}
    >
      {/* Dark Mode Toggle */}
      <Link href="/" className={`absolute top-4 right-14 text-2xl font-bold ${darkMode ? "text-yellow-400" : "text-black"}`}><IoHome className="inline-block mr-3"/></Link>
      <button
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-500 ${
          darkMode ? "bg-yellow-400 text-black" : "bg-gray-800 text-white"
        }`}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </button>

      {/* App Title */}
      <Link
        href="/"
        className="text-2xl sm:text-3xl md:text-3xl font-bold absolute top-4 left-4 flex items-center gap-1"
      >
        <TiWeatherPartlySunny className={`${darkMode ? "text-yellow-400" : "text-black"}`} /> Weatherio
      </Link>

      {/* Updated container width */}
      <div
        className={`w-full max-w-7xl ${
          weather ? "mt-24 sm:mt-16" : "mt-0"
        } flex flex-col items-center space-y-4`}
      >
        <p className="text-2xl font-semibold">5 - Day Forecast</p>

        {/* Loading and Error Messages */}
        {loading && <p className="mt-4 text-lg">Loading...</p>}
        {error && <p className="text-red-500 mt-4 text-lg">{error}</p>}

        {/* Weather Forecast Cards with updated grid */}
        {weather && weather.daily.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 w-full">
            {/* First Card (Today) */}
            <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5">
              <Link href={`/forecast/0`} passHref>
                <div className="p-6 bg-white bg-opacity-20 rounded-md flex flex-col items-center transition-all duration-300 hover:scale-105 cursor-pointer shadow-md">
                  
                  <div className="flex flex-col items-center text-center mt-4 mx-auto">
                    {/* Today label at the top center */}
                    <p className="font-semibold text-2xl">Today</p>

                    {/* Weather Icon in the middle */}
                    <Image
                      src={`http://openweathermap.org/img/wn/${weather.daily[0]?.weather?.[0]?.icon}@2x.png`}
                      alt={weather.daily[0]?.weather?.[0]?.description || "Weather icon"}
                      width={70}
                      height={70}
                    />
                    <p className="text-xl font-semibold">{weather.daily[0]?.main.temp}°C</p>
                    <p className="text-sm">{weather.daily[0]?.weather?.[0]?.description || "No data"}</p>
                  </div>

                  {/* Remaining data at the bottom, horizontally on large screens */}
                  <div className="lg:mt-6 lg:justify-evenly md:justify-evenly sm:justify-center grid grid-cols-2 gap-4 w-full mt-4 sm:flex sm:flex-wrap w-full mt-">
                    <div className="flex flex-col items-center">
                      <WiHumidity className="inline-block mr-1 w-7 h-7"/>
                      <p className="font-semibold">{weather.daily[0]?.main.humidity}%</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <WiBarometer className="inline-block mr-1 w-7 h-7"/>
                      <p className="font-semibold">{weather.daily[0]?.main.pressure} hPa</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <BsEmojiSunglasses className="inline-block mr-1 w-6 h-6 mb-1"/>
                      <p className="font-semibold">{weather.daily[0]?.main.feels_like}°C</p>  
                    </div>
                    <div className="flex flex-col items-center ">
                      <GiWindTurbine className="inline-block w-7 h-7"/>
                      <p className="font-semibold">{weather.daily[0]?.wind.speed} m/s</p>
                    </div>
                    <div className="flex flex-col items-center ">
                      <WiSunrise className=" inline-block w-7 h-7"/>
                      <p className="font-semibold">
                      {weather.daily[0]?.sys.sunset ? new Date(weather.daily[0]?.sys.sunrise * 1000).toLocaleTimeString() : "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                     <WiSunset className=" inline-block w-7 h-7"/>
                      <p className="font-semibold">
                      {weather.daily[0]?.sys.sunset ? new Date(weather.daily[0]?.sys.sunset * 1000).toLocaleTimeString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  
                </div>
              </Link>
            </div>

            {/* Remaining 4 Days - Now they'll spread evenly */}
            {weather.daily.slice(1, 5).map((day: DailyWeather, index: number) => (
              <Link key={index} href={`/forecast/${index + 1}`} passHref>
                <div className="p-6 bg-white bg-opacity-20 rounded-md flex flex-col items-center transition-all duration-300 hover:scale-105 cursor-pointer shadow-md h-full">
                  <p className="font-semibold text-lg">
                    {index === 0 ? "Tomorrow" : new Date(day.dt * 1000).toLocaleDateString()}
                  </p>
                  <Image
                    src={`http://openweathermap.org/img/wn/${day.weather?.[0]?.icon}@2x.png`}
                    alt={day.weather?.[0]?.description || "Weather icon"}
                    width={70}
                    height={70}
                    className="mt-2"
                  />
                  <p className="text-xl font-semibold">{day.main.temp}°C</p>
                  <p className="text-sm">{day.weather?.[0]?.description || "No data"}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
