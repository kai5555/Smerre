import React, { useState } from 'react';
import axios from 'axios'
import api from '../api';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { useNavigate} from 'react-router-dom';
import '../style/weather.css'


function WeatherApi() {
  //const url = 'https://api.openweathermap.org/data/2.5/weather?q=ghent&appid=7c29b2d75ea3419fe77514b3d6bdd43b'

  return (
      <div className='weather'>
        <div className='container'>
          <div className='top'>
            <div className='location'>
              <p>Ghent</p>
            </div>
            <div className='temp'>
              <h1>20 graden ofzo jwz</h1>
            </div>
            <div className='description'>
              <p>Clear</p>
            </div>
          </div>
          <div className='bottom'>
            <div className="feels">
              <p>22 graden</p>
            </div>
            <div className="humidity">
              <p>20%</p>
            </div>
            <div className="wind">
              <p>12 mph</p>
            </div>
          </div>
        </div>
      </div>
  );

}
export default WeatherApi;



