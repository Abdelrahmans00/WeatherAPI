import { useState, useEffect, useCallback } from "react";

const API_KEY = "173636578f0b71bd4983f3836f121797";

interface WeatherItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: { main: string; icon: string }[];
  dt_txt: string;
  pop?: number;
  visibility?: number;
}

interface ForecastResponse {
  list: WeatherItem[];
  city: {
    name: string;
  };
}

interface CurrentWeather {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: { main: string; icon: string }[];
  visibility?: number;
  name: string;
}

export const useWeeklyWeather = (city: string) => {
  const [data, setData] = useState<WeatherItem[]>([]);
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!currentRes.ok) throw new Error("Current weather API error.");
      const currentResult: CurrentWeather = await currentRes.json();
      setCurrent(currentResult);

      // Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!forecastRes.ok) throw new Error("City not found or forecast API error.");
      const forecastResult: ForecastResponse = await forecastRes.json();

      const filtered = forecastResult.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setData(filtered.slice(0, 5));
      setCityName(forecastResult.city.name);

      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return { data, current, error, refetch: fetchWeatherData, loading, cityName };
};