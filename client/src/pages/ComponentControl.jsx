import { useState, useEffect, useLayoutEffect } from 'react';
import logo from '../logo.svg';
import img from '../images/img.png';
import api, {toggleLed} from "../api";
import io from 'socket.io-client';
import { useNavigate} from 'react-router-dom';

function ComponentControl(){
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [leds, setLeds] = useState({
        'led1': false,
        'led2': false,
        'led3': false
    });

    useLayoutEffect(() => {
        async function checkUserAuth() {
            try {
                const res = await api.isUserAuth({token: localStorage.getItem("token")});
                if(res.data.isLoggedIn) {
                    console.log("Logged in");
                    setup();
                }
                else{
                    console.log("Not logged in");
                    navigate('/login');
                }
            } catch (err) {
                setErrorMessage(err)
            }
        }
        checkUserAuth();
    }, [navigate])

    const setup = () => {
        let socket = io('http://laptop_van_wout:5000');
        if(!socket.connected)
            socket = io('http://10.129.55.147:5000');

        socket.on('initial', (leds) => {
            setLeds(leds);
        });

        socket.on('toggle', (led, value) => {
            setLeds({ ...leds, [led]: value });
        });

        return () => {
            socket.disconnect();
        }
    }

    const toggleLed = (led) => {
        const button = document.getElementById(`${led}`);
        const currentStatus = leds[led];
        let socket = io('http://laptop_van_wout:5000');
    
        if (!socket.connected) {
          socket = io('http://10.129.55.147:5000');
        }
    
        socket.emit('toggle', led);
        setLeds({ ...leds, [led]: !currentStatus });
    
        if (currentStatus) {
          button.style.backgroundColor = 'MediumSeaGreen';
        } else {
          button.style.backgroundColor = 'LightGrey';
        }
    };
    
  

    const handleClick = async () => {
        try {
            console.log("TRIED LED");
            const response = await fetch('http://10.129.55.146:8123/api/services/switch/toggle', {
                method: 'POST',
                body: JSON.stringify({
                    "entity_id": "switch.status_led",
                }),
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2ZmE2NThhMzJlN2M0YTA5OTg1MzA5OTYzNTNhMGNlOCIsImlhdCI6MTY2OTcyNTgwNCwiZXhwIjoxOTg1MDg1ODA0fQ.PQsPlGsNVNxbYGwXfvsGi1k10rskekiDkayAD59gziw",
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleClick2 = async () => {
        try {
            console.log("TRIED SERVO");
            const response = await fetch('http://10.129.55.146:8123/api/services/input_number/set_value', {
                method: 'POST',
                body: JSON.stringify({
                    "entity_id": "input_number.servo_control",
                    "value": Math.floor(Math.random() * (201) - 100),
                }),
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2ZmE2NThhMzJlN2M0YTA5OTg1MzA5OTYzNTNhMGNlOCIsImlhdCI6MTY2OTcyNTgwNCwiZXhwIjoxOTg1MDg1ODA0fQ.PQsPlGsNVNxbYGwXfvsGi1k10rskekiDkayAD59gziw",
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleClick3 = async () => {
        try {
            console.log("TRIED SERVO");
            const response = await fetch('http://10.129.55.146:8123/api/services/switch/toggle', {
                method: 'POST',
                body: JSON.stringify({
                    "entity_id": "switch.Magneetventiel",
                }),
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2ZmE2NThhMzJlN2M0YTA5OTg1MzA5OTYzNTNhMGNlOCIsImlhdCI6MTY2OTcyNTgwNCwiZXhwIjoxOTg1MDg1ODA0fQ.PQsPlGsNVNxbYGwXfvsGi1k10rskekiDkayAD59gziw",
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleSlider =async () => {
        try{
            console.log("TRIED SERVO");
            var slider = document.getElementById("servo_range")
            const response = await fetch('http://10.129.55.146:8123/api/services/input_number/set_value', {
                method: 'POST',
                body: JSON.stringify({
                    "entity_id": "input_number.servo_control",
                    "value": document.getElementById("servo_range").value,
                }),
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2ZmE2NThhMzJlN2M0YTA5OTg1MzA5OTYzNTNhMGNlOCIsImlhdCI6MTY2OTcyNTgwNCwiZXhwIjoxOTg1MDg1ODA0fQ.PQsPlGsNVNxbYGwXfvsGi1k10rskekiDkayAD59gziw",
                    'Content-Type': 'application/json',
                },
            });
        }catch (err) {
            console.log(err.message);
        }
    };

    return (
        <>
          <div className="container ">
            <div className="card mt-5">
              <div className="row g-0">
                <div className="col-md-2">
                  <img src={img} className="img-fluid rounded-start"></img>
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">LED LIGHT</h5>
                    <p className="card-text"></p>
                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                  </div>
                </div>
    
                <div className="col-md-2">
                  <div className="form p-3">
                    <div className="form-check form-switch">
                      <input className="form-check-input ms-1" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={handleClick}></input>
                      <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
    
            <div className="card mt-5">
              <div className="row g-0">
                <div className="col-md-2">
                  <img src={img} className="img-fluid rounded-start"></img>
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <h5 className="card-title">LED LIGHT</h5>
                    <p className="card-text"></p>
                    <p className="card-text"><small className="text-muted">Last updated 3 mins
                      ago</small></p>
                  </div>
                </div>
    
                <div className="col-md-1 py-4">
                  <button style={{backgroundColor: (leds['led1'] ? 'MediumSeaGreen' : 'LightGrey')}} id={'led1'} type="button" className="btn" onClick={() => toggleLed('led1')}>power</button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
}

export default ComponentControl;