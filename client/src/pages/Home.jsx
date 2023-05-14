import { useEffect, useState } from 'react';
import api from '../api';
import axios from 'axios'
import styled from 'styled-components';
import { withAuth } from './Authentication';
import LoadingSpinner from "../components/LoadingSpinner";
import '../style/body.css'
import ComponentControl from './ComponentControl';

const Home = styled.div`
  display:flex;
  height:100vh;
`;


const Weather = styled.div`
`;

const ContainerWeather = styled.div`
  position:relative;
  display: flex;
  gap: 10px;
  right:10%;
`;

const Automations = styled.div`

`;

const Today = styled.div`

`;
const Tomorrow = styled.div`
`;

const Location = styled.div`
  position:relative;
  right:8%;
  font-size: 30px;
  font-weight: bold;
`;

const ForecastButton = styled.div`
  position:relative;
  right:-8%;
`;

const StyledButton = styled.button`
  border-radius:15px;
  width:100px;
`;

const ActorContainer = styled.div`
`;

const SensorContainer = styled.div`

`;


function WeatherApi({user}) {
  const[loading, setLoading] = useState(true);
  const [data,setData] = useState({})
  const [actors, setActors] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [forecastData,setforecastData] = useState({})

  useEffect( () => {
    setup();
  },[])

  useEffect(() => {
    if(!user) window.location = "/landing";

  }, [user]);
 
  const setup = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${user.location}&units=metric&appid=7c29b2d75ea3419fe77514b3d6bdd43b`
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${user.location}&units=metric&appid=7c29b2d75ea3419fe77514b3d6bdd43b`
    axios.get(url).then((response) => {
      setData(response.data)
    })
    axios.get(forecast).then((response) => {
      setforecastData(response.data)
    })
    try{
      const res = await api.getGeneralActors();
      console.log('test:', res.data.actors);
      setActors(res.data.actors);
    } catch (err) {
      console.log('Something went wrong while fetching actors!');
    }
    try{
      const res = await api.getGeneralSensors();
      console.log('test:', res.data.sensors);
      setSensors(res.data.sensors);
      setLoading(false);
    } catch (err) {
      console.log('Something went wrong while fetching sensors!');
    }
  }

  if(loading){
    return (<LoadingSpinner/>)
  }
  return (
    <Home>   
      <ActorContainer>
        <ComponentControl actors={actors}></ComponentControl>
      </ActorContainer>
      {forecastData.list !== undefined &&
      <Weather>
        <Location>
          <p>{data.name}</p>
        </Location>
        <ContainerWeather>
          <Today>
            <label>Today:</label>
            <div className='temp'>
              {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
            </div>
            <div className='description'>
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </Today>
          <Tomorrow>
            {forecastData.list !== undefined &&
              <div className="tomorrow">
                  <label>Tomorrow:</label>
                <div className="temptmrw">
                  <h1>{forecastData.list[0].main.temp.toFixed()}°C</h1>
                </div>
                <div className="desctmrw">
                  <p>{forecastData.list[0].weather[0].main}</p>
                </div>
              </div>
            }
          </Tomorrow>
        </ContainerWeather>
          <ForecastButton>
            <form action="http://localhost:3000/forecast">
              <StyledButton type='submit'>
                Forecast
              </StyledButton>
            </form>
          </ForecastButton>
      </Weather>
      }
    </Home>
  );

}
export default withAuth(WeatherApi, false, "/landing");

