import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import { useNavigate} from 'react-router-dom';
import axios from 'axios'
import styled from 'styled-components';
import { withAuth } from './Authentication';
import LoadingSpinner from "../components/LoadingSpinner";
import '../style/body.css'

const Home = styled.div`
  display:flex;
  height:100vh;
`;

const Plants = styled.div`
  position:relative;
  right:-100px;
`;


const PlantWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: 250px;
  text-align: center;
  position: relative;

`;

const PlantName = styled.div`
  font-size: 12px;
`;

const PlantAlias = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Weather = styled.div`
  position: absolute;
  right:0;
  top:70px;
`;

const TitlePlants = styled.div`
  position:relative;
  right:-75px;
  font-size: 20px;
  font-weight: bold;
`;

const TitleAuto = styled.div`
  position:relative;
  right:-45px;
  font-size: 20px;
  font-weight: bold;
`;

const ContainerWeather = styled.div`
  position:relative;
  display: flex;
  gap: 10px;
  right:10px;
`;

const Automations = styled.div`

`;

const AutomationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: 250px;
  text-align: center;
  position: relative;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const AutomationName = styled.div`
  font-size: 12px;
`;

const AutomationAlias = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Today = styled.div`

`;
const Tomorrow = styled.div`
`;

const Location = styled.div`
  position:relative;
  right:10px;
  font-size: 30px;
  font-weight: bold;
`;

const ForecastButton = styled.div`
  position:relative;
  right:-10px;
`;

const StyledButton = styled.button`
  border-radius:15px;
  width:100px;
`;

function WeatherApi({user}) {
  console.log(user);
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
        <TitleAuto>
          Your automations:
        </TitleAuto>
      {automations.map(({ name, alias, enabled }) => (
      <AutomationWrapper key={name}>
        <div onClick={() => handleAutomationClick(name)}>
          <AutomationAlias>{alias}</AutomationAlias>
          <AutomationName>{name}</AutomationName>
        </div>
      </AutomationWrapper>
    ))}
      </Automations>
      <Plants>
        <TitlePlants>
          Your plants:
        </TitlePlants>
        {plants.map(({ name }) => (
        <PlantWrapper key={name}>
          <div onClick={() => handlePlantClick(name)}>
            <PlantAlias>{name}</PlantAlias>
            <PlantName>{name}</PlantName>
          </div>
        </PlantWrapper>
      ))}
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
export default withAuth(WeatherApi);

