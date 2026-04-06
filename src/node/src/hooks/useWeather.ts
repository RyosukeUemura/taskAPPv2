import { useEffect, useState } from 'react'
import { WeatherData } from '../types/task'
import { authFetch } from '../lib/api'

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  // src/node/src/hooks/useWeather.ts （該当部分を修正）
const fetchWeather = async () => {
    try {
        const res = await authFetch('/api/weather');
        
        if (!res.ok) {
            if (res.status === 401) {
                console.warn("未認証です。天気情報をクリアします。");
                setWeather(null); // または適切な初期値
                return;
            }
            throw new Error(`エラーが発生しました: ${res.status}`);
        }

        const data = await res.json();
        setWeather(data);
    } catch (error) {
        console.error("天気取得エラー:", error);
        setWeather(null);
    }
};

  useEffect(() => {
    fetchWeather()
  }, [])

  return { weather }
}
