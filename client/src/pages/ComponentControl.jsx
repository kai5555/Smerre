import logo from '../logo.svg';
import React from 'react';
import img from '../images/img.png'
import api, {toggleLed} from "../api";
import io from 'socket.io-client';

class ComponentControl extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            leds: {
                'led1': false,
                'led2': false,
                'led3': false
            }
        };

        this.socket = io('http://10.129.55.155:5001');

        this.socket.on('initial', (leds) => {
            this.setState({ leds });
        });

        this.socket.on('toggle', (led, value) => {
            this.setState({ leds: { ...this.state.leds, [led]: value } });

        });
    }

    toggleLed(led) {
        const button = document.getElementById(`${led}`);
        const currentStatus = this.state.leds[led];
        this.socket.emit('toggle', led);
        this.setState({ leds: { ...this.state.leds, [led]: !currentStatus } });

        if(currentStatus) {
            button.style.backgroundColor = 'MediumSeaGreen';
        }
        else {
            button.style.backgroundColor ="LightGrey";
        }
    }

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

    handleSlider =async () => {
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
    }
    /*  var slider = document.getElementById("servo_range");
      var output = document.getElementById("servo_range_hmtl");
      output.innerHTML = slider.value;
      alert(test);*/
    render() {
        return (
            <>
                {/*<div class="container" >*/}
                {/*  <div class="row justify-content-center"   >*/}
                {/*    <button type="button" class="btn btn-success p-4 my-3 col-4"   onClick={this.handleClick}>Toggle LED</button>*/}
                {/*  </div>*/}
                {/*  <div class="row justify-content-center" >*/}
                {/*    <button type="button"  class="btn btn-success p-4  my-3 col-4" onClick={this.handleClick2}>Toggle Servo</button>*/}
                {/*  </div>*/}
                {/*  <div class="row justify-content-center">*/}
                {/*    <button type="button" class="btn btn-success p-4  my-3 col-4" onClick={this.handleClick3}>Toggle Magneet</button>*/}
                {/*  </div>*/}

                {/*  <div className="row justify-content-center">*/}
                {/*    <label id="servo_range_hmtl" className="form-label">Example range</label>*/}
                {/*    <input type="range" className="form-range" min="-100" max="100" id="servo_range" onInput={this.handleSlider}/>*/}
                {/*  </div>*/}

                {/*</div>*/}

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
                                        <input className="form-check-input ms-1" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={this.handleClick}></input>
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                    </div>
                                </div>
                            </div>
                        < /div>
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
                                <button style={{backgroundColor: (this.state.leds['led1'] ? 'MediumSeaGreen' : 'LightGrey')}} id={'led1'} type="button" className="btn" onClick={() => this.toggleLed('led1')}>power</button>
                            </div>
                        < /div>
                    </div>
                </div>
            </>
        );
    }
}

export default ComponentControl;
