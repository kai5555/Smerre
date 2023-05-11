import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import { redirect, useNavigate } from 'react-router-dom';
import axios from 'axios'
import styled from 'styled-components';
import { withAuth } from './Authentication';
import LoadingSpinner from "../components/LoadingSpinner";
import '../style/body.css'
import LandingPage from "./LandingPage"

const Home = styled.div`
  display:flex;
  height:100vh;
`;

const Plants = styled.div`
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

function WeatherApi({user}) {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [automations, setAutomations] = useState([]);
  const[loading, setLoading] = useState(true);
  const [data,setData] = useState({})
  const [forecastData,setforecastData] = useState({})

  const handlePlantClick = useCallback((name) => {
    window.location.href = `/plant/${name}`;
  }, []);

  const handleAutomationClick = useCallback((name) => {
    window.location.href = `/automation/${name}/edit`;
  }, []);

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
    try {
        const res = await api.getAllPlants();
        setPlants(res.data.data);
    } catch (err) {
        console.log('Something went wrong while fetching plants!');
    }
    try {
      const res = await api.getAllAutomations();
      setAutomations(res.data.data);
      setLoading(false);
    } catch (err) {
      console.log("Something went wrong while fetching automations!");
    }
  }

  if(loading){
    return (<LoadingSpinner/>)
  }
  return (
    <Home>
      <Automations>
        <div className="container my-3 ">
          <div className="row mb-1">
            <div className="col-6"><h1 className="h2 mb-4">Automations</h1></div>
            </div>
            {automations.length === 0 && <p>No automations found.</p>}
              <div className="row">
                {automations.map(({ name, alias, enabled }) => (
                  <div className="col-md-12 col-lg-12" key={name}>
                    <div className="card shadow-sm mb-5 " style={{minHeight: "150px"}}>
                      <div className="card-body pt-0">

                        <div className="row">
                          <div className="col-6 pt-3 pe-0">
                            <h5 className="card-title">{name}</h5>
                            <p className="card-text">{alias}</p>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-between align-items-center">
                        <button className="btn btn-outline-secondary" onClick={() => handleAutomationClick(name)}>
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
      </Automations>
      <Plants>
        <div className="container my-3">
            <div className="row"><h1 className="h2 mb-4">Plants</h1></div>
            {plants.length === 0 && <p>No plants found.</p>}
            <div className="row">
                {plants.map(({ name, description }) => (
                    <div className="col-md-6 col-lg-4" key={name}>
                        <div className="card shadow-sm mb-4" style={{minHeight: "150px"}}>
                            <div className="card-body">
                                <h5 className="card-title">{name}</h5>
                                <p className="card-text">{description}</p>
                            </div>
                            <div className="card-footer d-flex justify-content-between align-items-center">
                                <button className="btn btn-outline-secondary" onClick={() => handlePlantClick(name)}>
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </Plants>
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

