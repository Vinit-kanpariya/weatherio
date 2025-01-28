"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getWeather } from "../../../lib/getWeather";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { WiBarometer, WiHumidity, WiSunrise, WiSunset } from "react-icons/wi";
import { IoHome } from "react-icons/io5";
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
      {/* Dark Mode Toggle */}
      <Link href="/" className="absolute top-5 left-4 text-2xl font-bold">
        <TiWeatherPartlySunny className="inline-block mb-1" /> Weatherio
      </Link>
      <Link href="/" className={`absolute top-4 right-14 text-2xl font-bold ${darkMode ? "text-yellow-400" : "text-black"}`}><IoHome className="inline-block mr-3"/></Link>
      <button
        className={`absolute top-4 right-4 p-2 rounded-full ${
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
      <p className="text-xl capitalize mb-3">{weather.weather?.[0]?.description || "No data"}</p>

      <div className="lg:mt-6 lg:justify-evenly md:justify-evenly sm:justify-center grid grid-cols-2 gap-4 w-full mt-4 sm:flex sm:flex-wrap w-full">
        <div className="flex flex-col items-center">
          <WiHumidity className="inline-block mr-1 w-7 h-7"/>
          <p>Humidity</p>
          <p className="font-semibold">{weather.main.humidity}%</p>
        </div>
        <div className="flex flex-col items-center">
          <WiBarometer className="inline-block mr-1 w-7 h-7"/>
          <p>Pressure</p>
          <p className="font-semibold">{weather.main.pressure} hPa</p>
        </div>
        <div className="flex flex-col items-center">
          <BsEmojiSunglasses className="inline-block mr-1 w-6 h-6 mb-1"/>
          <p>Feels like</p>
          <p className="font-semibold">{weather.main.feels_like}°C</p>  
        </div>
        <div className="flex flex-col items-center ">
          <GiWindTurbine className="inline-block w-7 h-7"/>
          <p>Wind</p>
          <p className="font-semibold">{weather.wind.speed} m/s</p>
        </div>
        <div className="flex flex-col items-center ">
          <WiSunrise className=" inline-block w-7 h-7"/>
          <p>Sunrise</p>
          <p className="font-semibold">
          {weather.sys.sunset ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString() : "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-center">
         <WiSunset className=" inline-block w-7 h-7"/>
         <p>Sunset</p>
          <p className="font-semibold">
          {weather.sys.sunset ? new Date(weather.sys.sunset * 1000).toLocaleTimeString() : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
