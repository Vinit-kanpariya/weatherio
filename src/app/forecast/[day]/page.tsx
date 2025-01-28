"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getWeather } from "../../../lib/getWeather";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { WiHumidity, WiSunrise, WiSunset } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { BsEmojiSunglasses } from "react-icons/bs";
import { GiWindTurbine } from "react-icons/gi";
import Link from "next/link";

interface DailyWeather {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
    city: string;
    country: string;
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

export default function ForecastDetail() {
  const params = useParams();
  const router = useRouter();
  const dayIndex = parseInt(Array.isArray(params?.day) ? params.day[0] : params?.day || "0");
  const [weather, setWeather] = useState<DailyWeather | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Ensure Dark Mode is Applied from Local Storage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch weather data for the selected day
  useEffect(() => {
    async function fetchWeather() {
      const storedCity = localStorage.getItem("lastCity");
      if (storedCity) {
        const data = await getWeather(storedCity);
        if (data.daily && data.daily.length > dayIndex) {
          setWeather(data.daily[dayIndex]);
        }
      }
    }
    fetchWeather();
  }, [dayIndex]);

  if (!weather) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-all duration-500 ease-in-out ${
        darkMode ? "bg-gray-900 text-white" : "bg-yellow-100 text-black"
      }`}
    >
      {/* Header with Back Button & Dark Mode Toggle */}
      <div className="absolute top-4 flex items-center gap-4 w-full px-4">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
        >
          ⬅ Back
        </button>

        {/* Weather App Title */}
        <Link href="/" className="text-2xl font-bold flex-grow text-center">
          <TiWeatherPartlySunny className="inline-block mb-1" /> Weatherio
        </Link>

        {/* Dark Mode Toggle */}
        <button
          className={`p-2 rounded-full ${
            darkMode ? "bg-yellow-400" : "bg-stone-800"
          } transition-all duration-200`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-stone-900 hover:text-stone-50" />
          ) : (
            <MoonIcon className="w-6 h-6 text-stone-200 hover:text-stone-50" />
          )}
        </button>
      </div>

      {/* Weather Details */}
      <h1 className="text-3xl font-bold mt-12">
        {new Date(weather.dt * 1000).toLocaleDateString()}
      </h1>
      <h2 className="text-xl mt-1 font-semibold">
        {weather.main.city}, {weather.main.country}
      </h2>
      <Image
        src={`http://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
        alt={weather.weather?.[0]?.description || "Weather icon"}
        width={100}
        height={100}
      />
      <p className="text-2xl">{weather.main.temp}°C</p>
      <p className="text-xl capitalize">{weather.weather?.[0]?.description || "No data"}</p>

      <div className="mt-4 text-md text-center bg-grey bg-opacity-20 p-3 rounded-lg flex flex-col gap-4 justify-center">
        <p className="flex items-center">
          <WiHumidity className="inline-block mr-2" />Humidity: {weather.main.humidity}%
        </p>
        <p className="flex items-center">
          <FaWind className="inline-block mr-2" />Wind: {weather.wind.speed} m/s
        </p>
        <p className="flex items-center">
          <BsEmojiSunglasses className="inline-block mr-2" />Feels like: {weather.main.feels_like}°C
        </p>
        <p className="flex items-center">
          <GiWindTurbine className="inline-block mr-2" />Pressure: {weather.main.pressure} hPa
        </p>
        <p className="flex items-center">
          <WiSunrise className="inline-block mr-2" />
          Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
        </p>
        <p className="flex items-center">
          <WiSunset className="inline-block mr-2" />
          Sunset: {weather.sys.sunset ? new Date(weather.sys.sunset * 1000).toLocaleTimeString() : "N/A"}
        </p>
      </div>
    </div>
  );
}
