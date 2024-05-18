export const formatTemperature = (temperature: number) : number => {
    return parseInt((temperature - 273.15).toString())
}