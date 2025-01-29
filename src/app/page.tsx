"use client";

import { useState, useEffect, useRef } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { TiWeatherPartlySunny } from "react-icons/ti";
import Link from "next/link";

export default function Home() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Load dark mode preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setDarkMode(storedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch city suggestions from OpenWeather Geocoding API
  const fetchCitySuggestions = async (query: string) => {
    if (!query) return setSuggestions([]);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setSuggestions(data.map((city:{ name: string; country: string }) => `${city.name}, ${city.country}`));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setSuggestions([]);
    }
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
        <TiWeatherPartlySunny className={`${darkMode ? "text-yellow-400" : "text-black"}`} /> Weatherio
      </Link>

      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col items-center space-y-4">
        <p className="text-2xl font-semibold">5 - Day Forecast</p>

        {/* Search Box */}
        <div className="relative w-full flex flex-col sm:flex-row items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter city name"
              className={`w-full sm:w-3/4 px-4 py-2 rounded-md border-2 focus:outline-none transition-all duration-300 
                ${darkMode 
                  ? "bg-white border-gray-600 text-black placeholder-gray-400 focus:ring-1 focus:ring-yellow-400" 
                  : "bg-white border-gray-300 text-black placeholder-gray-600 focus:ring-1 focus:ring-black"
                }`}
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                fetchCitySuggestions(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className={`w-full sm:w-auto px-5 py-2 rounded-md font-semibold transition-all duration-300 
                ${darkMode 
                  ? "bg-yellow-400 text-black hover:bg-yellow-300" 
                  : "bg-black text-white hover:bg-blue-500"
                }`}
            >
              Search
            </button>


          {/* City Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <ul
              ref={dropdownRef}
              className={`absolute top-12 w-full md:w-3/4 border rounded-md shadow-lg z-10 overflow-hidden transition-all duration-300 bg-white text-black
              ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300 text-black"}`}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 cursor-pointer transition-all duration-200
                    ${darkMode 
                      ? "hover:bg-gray-700" 
                      : "hover:bg-gray-200"
                    }`}
                  onClick={() => {
                    setCity(suggestion);
                    setSuggestions([]);
                    setShowDropdown(false);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
