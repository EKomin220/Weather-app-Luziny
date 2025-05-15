"use client"; 
import { useState, useEffect } from "react"; 
import ApiClient from "../../ApiClient/client"; 
import WeatherCard from "../components/WeatherCard";

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const client = new ApiClient();

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.getPragueWeather(0);
      console.log('Weather data received:', response);
      setWeatherData(response);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-sky-100 p-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Počasí na Lužinách</h1>  
        </div>
        
        {loading && (
          <div className="text-center text-gray-600">Loading weather data...</div>
        )}
        
        {error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        {weatherData && weatherData.daily && weatherData.daily.time && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {weatherData.daily.time.map((time, index) => (
              <WeatherCard
                key={time.toISOString()}
                day={formatDate(time)}
                weatherCode={weatherData.daily.weatherCode[index]}
                maxTemp={weatherData.daily.temperature2mMax[index]}
                minTemp={weatherData.daily.temperature2mMin[index]}
                windSpeed={weatherData.daily.windSpeed10mMax[index]}
                precipSum={weatherData.daily.precipitationSum[index]}
                precipChance={weatherData.daily.precipitationProbabilityMax[index]}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 