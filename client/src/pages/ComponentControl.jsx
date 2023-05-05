import logo from '../logo.svg';
import React from 'react';
import led from '../images/led.png'
import valve from '../images/valve.png'
import servo from '../images/servo.png'
import api from "../api";
import io from 'socket.io-client';
import { Navigate  } from 'react-router-dom';
import { withAuth } from './Authentication';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LoadingSpinner from "../components/LoadingSpinner";

class ComponentControl extends React.Component {

    constructor(props) {
        super(props);

        this.ip = process.env.REACT_APP_MY_IP;
        console.log("server ip is: " + this.ip);

        this.state = {
            components:{},
            actors: {},
            plants: {},
            lastUpdated: {}, // new state variable
            loading: true
        };

        this.socket = io('http://laptop_van_wout:5000');
        if(!this.socket.connected)
            this.socket = io('http://'+ this.ip + ':5000');

        this.socket.on('initial', (value) => {
            this.setState({ actors:  value });
        });


        this.socket.on('toggle', (actor, value) => {
            this.setState({ actors: { ...this.state.actors, [actor]: value } });

        });

    }

    async componentDidMount() {
        try {
            const res = await api.getAllActors(); // make API call
            this.setState({ components: res.data.data}); // update state with response data
        } catch (error) {
            console.error(error);
        }

        try {
            const res = await api.getAllPlants(); // make API call
            this.setState({ plants: res.data.data, loading: false }); // update state with response data
        } catch (error) {
            console.error(error);
        }
    }

    toggleActor(actor) {
        const button = document.getElementById(`${actor}`);
        const currentStatus = this.state.actors[actor];
        this.socket.emit('toggle', actor);
        this.setState({
            actors: { ...this.state.actors, [actor]: !currentStatus } ,
            lastUpdated: { ...this.state.lastUpdated, [actor]: new Date() } // update the last updated time for the actor
        });

        if(currentStatus) {
            button.style.color = 'MediumSeaGreen';
        }
        else {
            button.style.color ="LightGrey";
        }
    }

    getImageForSubType(subType) {
        if (subType === "led") {
            return led;
        } else if (subType === "ventiel") {
            return valve;
        } else if (subType === "servo"){
            return servo;
        } else {
            return null;
        }
    }

    render() {
        console.log(this.state);

        if(this.state.loading){
            return (<LoadingSpinner/>);
        }
        else{
            const actorCards = Object.entries(this.state.actors).map(([key, value]) => {
                const component = this.state.components.find((c) => c.entity_id === key);
                const subType = component ? component.sub_type : null;
                const name = component ? component.name : null;
                const image = this.getImageForSubType(subType);

                const plant = this.state.plants.find((c) => c.block === component.block);
                const blockName = plant ? plant.name : "serre";

                if(image != null) {
                    return (
                        <div className="card mb-5 shadow-sm" key={key}>
                            <div className="row g-0">
                                <div className="col-md-2">
                                    <img src={image} className="img-fluid rounded-start"></img>
                                </div>
                                <div className="col-md-9">
                                    <div className="card-body">
                                        <h5 className="card-title">{name}</h5>
                                        <p className="card-text"></p>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                Actor is connected to {blockName}.
                                            </small>
                                        </p>
                                    </div>
                                </div>

                                <div className="col-md-1 py-3 d-flex justify-content-center">
                                    <i className="bi bi-power"
                                       style={{fontSize: "2rem", color: value ? "MediumSeaGreen" : "LightGrey", cursor: "pointer"}}
                                       id={key}
                                       onClick={() => this.toggleActor(key)}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    );
                }
            });

        return (
            <>
                <div className="container my-3">
                    <div className="row"><h1 className="h2 mb-4">Components</h1></div>
                    {actorCards.length === 0 && <p>No actors found.</p>}
                        <div >{actorCards}</div>
                </div>
            </>
            );
        }
    }


}

export default withAuth(ComponentControl);


/*
import logo from '../logo.svg';
import React from 'react';
import led from '../images/led.png'
import valve from '../images/valve.png'
import servo from '../images/servo.png'
import api from "../api";
import io from 'socket.io-client';
import { Navigate  } from 'react-router-dom';
import { withAuth } from './Authentication';
import { ip } from '../index';


class ComponentControl extends React.Component {
    constructor(props) {
        super(props);

        this.ip = ip;
        console.log("server ip is: " + ip);

        this.state = {
            components: {},
            actors: {},
            loading: true
        };

        this.socket = null;
    }

    async componentDidMount() {
        await this.getActors();
        this.configWebSocket();
    }

    async getActors(){
        try {
            const res = await api.getAllActors(); // make API call
            this.setState({ components: res.data.data, loading: false }); // update state with response data
        } catch (error) {
            console.error(error);
        }
    }

    configWebSocket(){
        this.socket = new WebSocket(`ws://10.129.55.146:8123/api/websocket`);

        this.socket.addEventListener('open', (event) => {
            const auth = {
                "type": "auth",
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2ZmE2NThhMzJlN2M0YTA5OTg1MzA5OTYzNTNhMGNlOCIsImlhdCI6MTY2OTcyNTgwNCwiZXhwIjoxOTg1MDg1ODA0fQ.PQsPlGsNVNxbYGwXfvsGi1k10rskekiDkayAD59gziw",
            };
            this.socket.send(JSON.stringify(auth));

            const subscribe = {
                "id": 1,
                "type": "subscribe_events",
                "event_type": "state_changed",

            };
            this.socket.send(JSON.stringify(subscribe));

            const states = {
                "id": 2,
                "type": "get_states"
            };
            this.socket.send(JSON.stringify(states));
        });

        this.socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);

            if(message.type ==="auth_ok")
                console.log('Received message:', message);

            else if(message.type ==="result" && message.result !== null){
                this.setActorsValues(message);
            }
            else if(message.type === 'event' && message.event.event_type ==="state_changed") {
                this.changeActorValue(message);

            }
        });

        this.socket.addEventListener('error', (event) => {
            console.log('WebSocket error:', event);
        });
        this.socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event);
        });
    }

    setActorsValues(message) {
        console.log(message);
        for (const { entity_id } of this.state.components) {
            const actor = message.result.find((c) => c.entity_id === entity_id);
            if (actor?.state !== undefined) {
                console.log(actor.state);
                this.setState((prevState) => ({
                    actors: {
                        ...prevState.actors,
                        [entity_id]: actor.state === "on" || actor.state >= 0,
                    },
                }));
            }
        }
    }

    changeActorValue(message) {
        if (message.event.data.entity_id in this.state.actors) {
            const state = message.event.data.new_state.state;
            this.setState((prevState) => ({
                actors: {
                    ...prevState.actors,
                    [message.event.data.entity_id]: state === "on" || state >= 0,
                },
            }));
        }
    }

    toggleActor(actor) {
        // const button = document.getElementById(`${actor}`);
        // const currentStatus = this.state.actors[actor];

        if(actor.includes('switch')) this.handleSwitch(actor);
        else if (actor.includes('input_number')) this.handleInputNumber(actor);
        else console.log("no handler found.");

        // this.setState({ actors: { ...this.state.actors, [actor]: !currentStatus } });
        //
        // if(currentStatus) {
        //     button.style.backgroundColor = 'MediumSeaGreen';
        // }
        // else {
        //     button.style.backgroundColor ="LightGrey";
        // }
    }

    handleSwitch = async (actor) => {
        try {
            console.log("TRIED LED");
            await fetch('http://10.129.55.146:8123/api/services/switch/toggle', {
                method: 'POST',
                body: JSON.stringify({
                    "entity_id": actor,
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

    handleInputNumber = async (actor) => {
        try {
            console.log("TRIED SERVO, value is: " + String(this.state.actors[actor] ? 100 : -100));
            await fetch('http://10.129.55.146:8123/api/services/input_number/set_value', {
                method: 'POST',
                body: JSON.stringify({
                    "entity_id": actor,
                    "value": !this.state.actors[actor] ? 100 : -100,
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

    getImageForSubType(subType) {
        if (subType === "led") {
            return led;
        } else if (subType === "ventiel") {
            return valve;
        } else if (subType === "servo"){
            return servo;
        } else {
            return null;
        }
    }


    render() {
        console.log(this.state);

        if(this.state.loading){
            return (<><h1>loading</h1></>);
        }
        else{
            const actorCards = Object.entries(this.state.actors).map(([key, value]) => {
                const component = this.state.components.find((c) => c.entity_id === key);
                const subType = component ? component.sub_type : null;
                const name = component ? component.name : null;
                const image = this.getImageForSubType(subType);

                if(image != null) {
                    return (
                        <div className="card mt-5" key={key}>
                            <div className="row g-0">
                                <div className="col-md-2">
                                    <img src={image} className="img-fluid rounded-start"></img>
                                </div>
                                <div className="col-md-9">
                                    <div className="card-body">
                                        <h5 className="card-title">{name}</h5>
                                        <p className="card-text"></p>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                Last updated 3 mins ago
                                            </small>
                                        </p>
                                    </div>
                                </div>

                                <div className="col-md-1 py-4">
                                    <button
                                        style={{
                                            backgroundColor: value ? "MediumSeaGreen" : "LightGrey",
                                        }}
                                        id={key}
                                        type="button"
                                        className="btn"
                                        onClick={() => this.toggleActor(key)}
                                    >
                                        power
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
            });

            return (
                <>
                    <div className="container ">
                        <div >{actorCards}</div>
                    </div>
                </>
            );
        }
    }

}
export default withAuth(ComponentControl);*/
