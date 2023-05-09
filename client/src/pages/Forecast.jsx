import {  useEffect, useState } from 'react';
import api from '../api';
import { useNavigate} from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import axios from 'axios'
import { withAuth } from './Authentication';
import LoadingSpinner from "../components/LoadingSpinner";
import '../style/forecast.css'

function Forecast({user}) {
    const [data,setData] = useState({})
    const [forecastData,setforecastData] = useState({})
    const [location, setLocation] = useState('')
    const[loading, setLoading] = useState(true);

    const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayInAWeek = new Date().getDay();
    const forecastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length).concat(WEEK_DAYS.slice(0, dayInAWeek));
    const navigate = useNavigate();

    useEffect( () => {
      setup();
    },[])

    const setup = async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${user.location}&units=metric&appid=7c29b2d75ea3419fe77514b3d6bdd43b`
      const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${user.location}&units=metric&appid=7c29b2d75ea3419fe77514b3d6bdd43b`
      axios.get(url).then((response) => {
        setData(response.data)
      })
      axios.get(forecast).then((response) => {
        setforecastData(response.data)
        setLoading(false);
      })
    }

    if(loading){
      return (<LoadingSpinner/>)
    }
    return (
        <div className="forecastContainer">
            <div className="forecast">
            {forecastData.list !== undefined &&
            <label className="title">Daily Forecast for next 7 days</label>
            }
            {forecastData.list !== undefined &&
            <Accordion allowZeroExpanded>
              {forecastData.list.slice(0, 7).map((item, idx) => (
                <AccordionItem key={idx}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className="daily-item">
                      <img src={`icons/${item.weather[0].icon}.png`} className="icon-small" alt="weather" />
                      <label className="day">{forecastDays[idx]}</label>
                      <label className="descriptionForecast">{item.weather[0].description}</label>
                      <label className="min-max">{Math.round(item.main.temp_max)}°C /{Math.round(item.main.temp_min)}°C</label>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div className="daily-details-grid">
                    <div className="daily-details-grid-item">
                      <label>Pressure:</label>
                      <label>{item.main.pressure}</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Humidity:</label>
                      <label>{item.main.humidity}</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Clouds:</label>
                      <label>{item.clouds.all}%</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Wind speed:</label>
                      <label>{item.wind.speed} m/s</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Sea level:</label>
                      <label>{item.main.sea_level}m</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Feels like:</label>
                      <label>{item.main.feels_like}°C</label>
                    </div>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
              ))}
            </Accordion>
            }
          </div>
        </div>

    )
}
export default withAuth(Forecast);