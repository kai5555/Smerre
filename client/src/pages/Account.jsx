import React from 'react';
import "../css/home.css";

class Home extends React.Component {
    handleClick = async () => {
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
    }

    handleClick2 = async () => {
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
    }

    handleClick3 = async () => {
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
    }

    getWeather = async () => {
        console.log("Getting weather");
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }

        function showPosition(position) {
            console.log("Latitude: " + position.coords.latitude +
            "<br>Longitude: " + position.coords.longitude);
        }
        getLocation();
    }

    render() {
        return (
            <>
                {this.getWeather()}
                <div>
                    <button type="button" onClick={this.handleClick}>Toggle LED</button>
                </div>
                <div>
                    <button type="button" onClick={this.handleClick2}>Toggle Servo</button>
                </div>
                <div>
                    <button type="button" onClick={this.handleClick3}>Toggle Magneet</button>
                </div>
            </>
        );
    }
}

export default Home;