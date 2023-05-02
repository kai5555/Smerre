import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import axios from 'axios'
import '../style/weather.css'

const scheduleNotification = async () => {
  console.log("OK");
  if (Capacitor.isPluginAvailable('LocalNotifications')) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'My notification',
          body: 'This is my notification message!',
          id: 1,
          schedule: { at: new Date(Date.now()) },
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null,
        },
      ],
    });
  }
};
scheduleNotification();

function WeatherApi() {
  const [data,setData] = useState({})
  const [forecastData,setforecastData] = useState({})
  const [location, setLocation] = useState('')

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
  const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`

  const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayInAWeek = new Date().getDay();
  const forecastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length).concat(WEEK_DAYS.slice(0, dayInAWeek));


  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data)
        console.log(response.data)
      })
      axios.get(forecast).then((response) => {
        setforecastData(response.data)
        console.log(response.data)
      })
      setLocation('')
    }
  }

  return (
      <div className='weather'>
        <div className='search'>
          <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type='text'/>
        </div>
        <div className='containerWeather'>
          <div className='top'>
            <div className='location'>
              <p>{data.name}</p>
            </div>
            <div className='temp'>
              {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
            </div>
            <div className='description'>
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>
        {data.name !== undefined &&
          <div className='bottom'>
            <div className="feels">
              {data.main ? <p className='boldWeather'>{data.main.feels_like.toFixed()}°C</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='boldWeather'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='boldWeather'>{data.wind.speed.toFixed()} m/s</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }
        </div>
        <div className="forecast">
          {forecastData.list !== undefined &&
          <label className="title">Daily</label>
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
                    <label className="description">{item.weather[0].description}</label>
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
  );

}
export default WeatherApi;



