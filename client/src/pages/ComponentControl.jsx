import React from 'react';
import led from '../images/led.png'
import valve from '../images/valve.png'
import servo from '../images/servo.png'
import api from "../api";
import io from 'socket.io-client';
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

        this.socket = io('http://'+ this.ip + ':5000');

        this.socket.emit('initialActors');

        this.socket.on('initialActors', (value) => {
            this.setState({ actors:  value });
        });

        this.socket.on('toggleActors', (actor, value) => {
            this.setState({ actors: { ...this.state.actors, [actor]: value } });

        });

    }

    async componentDidMount() {
        try {
            const { actors } = this.props;
            console.log(actors);
            if(actors){
                this.setState({ components: actors});
            }
            else{
                const res = await api.getAllActors(); // make API call
                this.setState({ components: res.data.data}); // update state with response data
            }
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
        this.socket.emit('toggleActors', actor);
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

                if(image != null) {
                    const plant = this.state.plants.find((c) => c.block === component.block);
                    const blockName = (component.block === 0) ? "serre" : plant ? plant.name : "no plant";

                    return (
                        <div className="card mb-5 shadow-sm" key={key}>
                            <div className="row g-0">
                                <div className="col-7 col-sm-6 col-md-2 mx-auto">
                                    <img src={image} className="img-fluid rounded-start"></img>
                                </div>
                                <div className=" col-md-9">
                                    <div className="card-body text-center text-md-start">
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

