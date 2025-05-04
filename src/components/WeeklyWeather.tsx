import { useState } from "react";
import { useWeeklyWeather } from "../hooks/useWeeklyWeather";

const getWeatherTip = (condition: string, temp: number) => {
  if (condition.toLowerCase().includes("rain")) return "Don't forget your umbrella!";
  if (temp <= 15) return "Stay warm and wear boots!";
  if ( temp > 30) return "Stay hydrated, it's hot!";
  if (condition.toLowerCase().includes("clear") && temp < 15) return "Sunny but chilly, grab a jacket!";
  if (condition.toLowerCase().includes("cloud" ) || temp<25) return " Maybe carry a light jacket.";
  if (temp < 10) return "It's really cold today. Dress warmly!";
  if (temp > 35) return "Extreme heat! Stay in shade and drink water.";
  return "Have a great day!";
};

const getBackgroundImage = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case "clear": return "url('/images/clear.jpg')";
    case "clouds": return "url('/images/cloudy1.jpg')";
    case "rain": return "url('/images/rainy2.jpg')";
    case "snow": return "url('/images/snow.jfif')";
    case "thunderstorm": return "url('/images/thunderstorm.jfif')";
    case "drizzle": return "url('/images/drizzle.jfif')";
    case "mist":
    case "fog": return "url('/images/fog.jfif')";
    default: return "url('/images/default.jfif')";
  }
};

const WeeklyWeather = () => {
  const [city, setCity] = useState("Cairo");
  const [submittedCity, setSubmittedCity] = useState("Cairo");
  const [flippedToday, setFlippedToday] = useState(false);
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
  
  const { data, current, error, refetch, loading, cityName } = useWeeklyWeather(submittedCity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedCity(city);
  };

  if (error) {
    return (
      <div className="text-center p-6 text-red-500 bg-red-100 rounded-xl shadow-md">
        <p className="font-semibold text-lg mb-2">Oops! Something went wrong.</p>
        <p className="mb-4">{error}</p>
        <button onClick={() => refetch()} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
          Retry
        </button>
      </div>
    );
  }

  if (loading || !data.length || !current) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="ml-4 text-xl">Loading weather data...</p>
      </div>
    );
  }

  // Make sure we're using current (today's) weather for the tip and background
  const today = current;
  const mainCondition = today.weather[0].main;
  const temp = Math.round(today.main.temp);
  
  // Generate tip based on today's weather condition and temperature
  const tip = getWeatherTip(mainCondition, temp);
  const backgroundImage = getBackgroundImage(mainCondition);

  return (
    <div
      className="text-white rounded-2xl shadow-lg p-6 bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{
        backgroundImage,
        backgroundColor: "rgba(0,0,0,0.5)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8 w-full">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 
              focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
              dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search City..."
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 
              dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>

      {/* Today's Card */}
      <div className="flex justify-center mb-6">
        <div
          onClick={() => setFlippedToday(!flippedToday)}
          className="cursor-pointer relative w-60 h-60 transition-transform transform hover:scale-105"
        >
          <div className={`absolute inset-0 transition-transform duration-500 transform ${flippedToday ? "rotate-y-180" : ""} [transform-style:preserve-3d]`}>
            {/* Front */}
            <div className="absolute inset-0 bg-white/20 rounded-2xl p-4 flex flex-col items-center shadow-md [backface-visibility:hidden]">
              <div className="text-xl font-medium">Today</div>
              <img src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`} alt={mainCondition} className="w-12 h-12 mb-2" />
              <div className="text-2xl font-semibold">{temp}°C</div>
              <div className="text-sm text-gray-200 mt-1">{mainCondition}</div>
              <div className="text-sm text-gray-300 mt-1">
                Max: {Math.round(today.main.temp_max)}°C | Min: {Math.round(today.main.temp_min)}°C
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 bg-white/20 rounded-2xl p-4 flex flex-col items-center shadow-md [backface-visibility:hidden] rotate-y-180">
              <div className="text-xl font-medium">Details</div>
              <div className="text-sm text-gray-200 mt-2">Humidity: {today.main.humidity}%</div>
              <div className="text-sm text-gray-200 mt-2">Wind Speed: {Math.round(today.wind.speed*3.6)} km/h</div>
              <div className="text-sm text-gray-200 mt-2">Pressure: {today.main.pressure} millibars</div>
              <div className="text-sm text-gray-200 mt-2">Visibility: {today.visibility ? `${today.visibility / 1000} km` : "N/A"}</div>
            </div>
          </div>
        </div>  
      </div>


      <p className="text-center text-lg italic mb-2">{tip}</p>
      <h2 className="text-3xl font-bold text-center mb-6">5-Day Forecast in {cityName}</h2>      

      {/* Forecast Cards */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.map((day) => {
            const date = new Date(day.dt * 1000);
            const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
            const temp = Math.round(day.main.temp);
            const tempMax = Math.round(day.main.temp_max);
            const tempMin = Math.round(day.main.temp_min);
            const condition = day.weather[0].main;
            const humidity = day.main.humidity;
            const windSpeed = Math.round(day.wind.speed*3.6);
            const pressure = day.main.pressure;
            const flipped = flippedCards[day.dt] || false;

            return (
              <div
                key={day.dt}
                onClick={() =>
                  setFlippedCards((prev) => ({ ...prev, [day.dt]: !flipped }))
                }
                className="relative w-full h-60 cursor-pointer transition-transform transform hover:scale-105"
              >
                <div className={`absolute inset-0 transition-transform duration-500 transform ${flipped ? "rotate-y-180" : ""} [transform-style:preserve-3d]`}>
                  {/* Front */}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl p-4 flex flex-col items-center shadow-md [backface-visibility:hidden]">
                    <div className="text-xl font-medium">{weekday}</div>
                    <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={condition} className="w-12 h-12 mb-2" />
                    <div className="text-2xl font-semibold">{temp}°C</div>
                    <div className="text-sm text-gray-200 mt-1">{condition}</div>
                    <div className="text-sm text-gray-300 mt-1">Max: {tempMax}°C | Min: {tempMin}°C</div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl p-4 flex flex-col items-center shadow-md [backface-visibility:hidden] rotate-y-180">
                    <div className="text-xl font-medium">Details</div>
                    <div className="text-sm text-gray-200 mt-2">Humidity: {humidity}%</div>
                    <div className="text-sm text-gray-200 mt-2">Wind Speed: {windSpeed} Km/h</div>
                    <div className="text-sm text-gray-200 mt-2">Pressure: {pressure} millibars</div>
                    <div className="text-sm text-gray-200 mt-2">Chance of Rain: {Math.round((day.pop ?? 0) * 100)}%</div>
                    <div className="text-sm text-gray-200 mt-2">Visibility: {day.visibility ? `${day.visibility / 1000} km` : "N/A"}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyWeather;