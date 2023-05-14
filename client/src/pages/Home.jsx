import { useEffect, useState } from 'react';
import api from '../api';
import axios from 'axios'
import styled from 'styled-components';
import { withAuth } from './Authentication';
import LoadingSpinner from "../components/LoadingSpinner";
import ComponentControl from './ComponentControl';
import 'bootstrap-icons/font/bootstrap-icons.css';
import dht from '../images/dht.png'
import ldr from '../images/ldr.png'
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Home = styled.div`
`;

const ActorContainer = styled.div`
`;

const SensorContainer = styled.div`
  position:relative;
  top:-30px;
`;


function WeatherApi({user}) {
  const [loading, setLoading] = useState(true);
  const [data,setData] = useState({})
  const [date, setDate] = useState(new Date());
  const [actors, setActors] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [forecastData,setforecastData] = useState({})

  useEffect( () => {
    setup();
    const timerId = setInterval(refreshClock, 60000);
    return function cleanup() {
      clearInterval(timerId);
    };
  },[])

  useEffect(() => {
    if(!user) window.location = "/landing";

  }, [user]);

  function refreshClock() {
    setDate(new Date());
  }

  const getImage = (image) => {
    if (image === "dht") {
        return dht;
    } else if (image === "ldr") {
        return ldr;
    } else {
        return null;
    }
}
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
      setActors(res.data.actors);
    } catch (err) {
      console.log('Something went wrong while fetching actors!');
    }
    try{
      const res = await api.getGeneralSensors(); 
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
      {forecastData.list !== undefined &&
        <section className="vh-20 mt-4">
          <MDBContainer className="h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol md="8" lg="6" xl="12">
                <MDBCard style={{ color: "#4B515D", borderRadius: "35px", marginTop: "30px" }}>
                  <MDBCardBody className="p-4">
                    <div className="d-flex">
                      <MDBTypography tag="h6" className="flex-grow-1">
                        {data.name}
                      </MDBTypography>
                      {date.getMinutes() < 10 ? 
                      (<MDBTypography tag="h6">{date.getHours()}:0{date.getMinutes()}</MDBTypography>) :
                      (<MDBTypography tag="h6">{date.getHours()}:{date.getMinutes()}</MDBTypography>)
                      }
                    </div>
                    <div className="d-flex flex-column text-center mt-5 mb-4">
                      {data.main ?
                      <MDBTypography
                        tag="h6"
                        className="display-4 mb-0 font-weight-bold"
                        style={{ color: "#1C2331" }}
                      >
                        {" "}
                        {data.main.temp.toFixed()}°C {" "}
                      </MDBTypography>
                      : null }
                      {data.weather ?
                      <span className="small" style={{ color: "#868B94" }}>
                        {data.weather[0].main}
                      </span> :null} 
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1" style={{fontSize: '1rem'}}>
                        <div>
                          <FontAwesomeIcon icon="fa-solid fa-wind" size="sm" style={{ color: 'grey'}} />
                          <span className="ms-1">{data.wind.speed} m/s </span>
                        </div>
                        <div>
                          <FontAwesomeIcon icon="fa-solid fa-tint" size="sm" style={{ color: 'grey'}} />{" "}
                          <span className="ms-1"> {data.main.humidity}% </span>
                        </div>
                      </div>
                      <div>
                        <img
                          src={`icons/${data.weather[0].icon}.png`}
                          width="100px"
                        />
                      </div>
                    </div>
                      <form action="http://localhost:3000/forecast">
                        <button type="submit" className="btn btn-outline-primary">
                          Forecast
                        </button>
                      </form>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      }
      <ActorContainer>
        <ComponentControl actors={actors}></ComponentControl>
      </ActorContainer>
      <SensorContainer>
          <div className="container my-3">
            <div className="row"><h1 className="h2 mb-4">Sensors</h1></div>
            {sensors.map(({ name, entity_id, value, symbol, image }) => (
              <div>
                <div className="card mb-5 shadow-sm" key={entity_id}>
                  <div className="row g-0">
                    <div className="col-7 col-sm-6 col-md-2 mx-auto" align="center">
                      <img src={getImage(image)} className="img-fluid rounded-start"></img>
                    </div>
                      <div className="col-md-10">
                        <div className="card-body text-center text-md-start">
                          <h5 className="card-title">{name}</h5>
                            <p className="card-text"></p>
                            <p className="card-text">
                              <small className="text-muted">
                                Value: {value}{symbol}
                              </small>
                            </p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </SensorContainer>
    </Home>
  );

}
export default withAuth(WeatherApi, false, "/landing");

