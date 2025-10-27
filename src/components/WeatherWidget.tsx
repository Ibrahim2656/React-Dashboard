import { useState } from 'react';
import type { WeatherData } from '../types';

const WeatherWidget: React.FC = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const API_KEY = 'ba5817684cfcfe0734aa9f1df73881e0';

    const fetchWeather = async (url: string) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data: WeatherData = await response.json();
            setWeather(data);
        } catch (err) {
            setError('Failed to fetch weather data');
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (city.trim()) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`;
            fetchWeather(url);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
                    fetchWeather(url);
                },
                () => {
                    setError('Unable to retrieve your location');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser');
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Controls */}
            <div className="flex gap-2 flex-wrap">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Search
                </button>
                <button
                    onClick={getCurrentLocation}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    My Location
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-4 text-gray-500">Fetching weather...</div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Weather Display */}
            {weather && !loading && (
                <div className="bg-linear-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-center mb-4">{weather.name}</h3>
                    <div className="flex items-center justify-between">
                        <div className="text-center">
                            <div className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</div>
                            <div className="capitalize mt-1">{weather.weather[0].description}</div>
                            <div className="text-sm opacity-90 mt-2">Humidity: {weather.main.humidity}%</div>
                        </div>
                        {weather.weather[0].icon && (
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt={weather.weather[0].description}
                                className="w-20 h-20"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;