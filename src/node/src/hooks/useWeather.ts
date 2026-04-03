import { useEffect, useState } from 'react'
import { WeatherData } from '../types/task'
import { authFetch } from '../lib/api'

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  const fetchWeather = () => {
    authFetch('/api/weather/sapporo')
      .then(res => res.json())
      .then((data: WeatherData) => setWeather(data))
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  return { weather }
}
