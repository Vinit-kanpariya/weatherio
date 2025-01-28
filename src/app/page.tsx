"use client";

import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { TiWeatherPartlySunny } from "react-icons/ti";
import Link from "next/link";

export default function Home() {
  const [city, setCity] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setDarkMode(storedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSearch = () => {
    if (!city) return;
    localStorage.setItem("lastCity", city);
    window.location.href = `/forecast?city=${encodeURIComponent(city)}`;
  };

  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen transition-all duration-500 ease-in-out px-4 sm:px-8 lg:px-16 ${
        darkMode ? "bg-gray-900 text-white" : "bg-yellow-100 text-black"
      }`}
    >
      {/* Dark Mode Toggle */}
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
        <TiWeatherPartlySunny className="inline-block w-8 h-8" /> Weatherio
      </Link>

      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col items-center space-y-4">
        <p className="text-2xl font-semibold">5 - Day Forecast</p>

        {/* Search Box */}
        <div className="flex flex-wrap items-center justify-center w-full gap-3">
          <input
            type="text"
            placeholder="Enter city name"
            className="w-full sm:w-3/4 px-4 py-2 rounded-md text-black border-none focus:outline-none focus:ring-1 focus:ring-stone-800 hover:scale-105 transition-all duration-500"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className={`w-full sm:w-auto xs:text-xl md:ml-2 px-5 py-2 rounded-md ${
              darkMode
                ? "bg-amber-300 hover:bg-amber-200 text-black"
                : "bg-black hover:bg-blue-700 text-white"
            } hover:scale-105 transition-all duration-500`}
          >
            Search
          </button>
        </div>
      </div>
    </main>
  );
}
