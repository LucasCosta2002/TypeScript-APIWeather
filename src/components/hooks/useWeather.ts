import axios from "axios";
import { z } from "zod";
import { SearchType } from "../../types";
import { useMemo, useState } from "react";
// import {object, string, number, Output, parse} from 'valibot'


// ZOD
const Weather = z.object({

    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
});

export type Weather = z.infer<typeof Weather>;

// valibot
// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number()
//     })
// });

// type Weather = Output<typeof WeatherSchema>;

const initialState = {
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0
    }
}


export default function useWeather() {

    const [weather, setWeather] = useState<Weather>(initialState);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);


    const fetchWeather = async (search : SearchType) => {
        const appId = import.meta.env.VITE_API_KEY;
        
        setLoading(true);
        setWeather(initialState);
        try {
 
            const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;

            const {data} = await axios.get(geoURL);

            //comprobar si existe
            if(!data[0]) {
                setNotFound(true);
                return;
            }



            const lat = data[0].lat;
            const lon = data[0].lon;

            const weather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

            const {data : weatherData} = await axios.get(weather);
            

            // ZOD
            //safeParse retorna true si las propiedades que devuelve la api son iguales a las propiedades de Weather
            const result = Weather.safeParse(weatherData);
            if(result.success){
                setWeather(result.data);
            };
 
            // valibot
            // const result = parse(WeatherSchema, weatherData);
            // if(result){
            //     console.log(result.name);
            //     console.log(result.main.temp);
            // };
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        
    }

    const hasWeatherData = useMemo(() => weather.name, [weather]);
        
 
    return {
        weather,
        fetchWeather,
        hasWeatherData,
        loading,
        notFound
    };
}