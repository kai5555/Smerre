const Component = require('../modals/ComponentModal')
const WebSocket = require('ws');
const axios = require('axios')

function initSocket(server){

    const api = axios.create({
        baseURL: `http://localhost:5000/api`,
    })

    let tel = 2;
    let actors = {};
    let automations = {};
    const socket = new WebSocket(`ws://${process.env.HOMEASSISTANT_IP}:8123/api/websocket`);

    const heartbeatInterval = 60000; // 30 seconds

    let heartbeat = () =>{
        if (socket.readyState === WebSocket.OPEN) {
            tel += 1;
            socket.send(JSON.stringify({ "id":tel, "type": 'ping' }));
            console.log("ping send");
        }
    }

    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    (async () =>{
        const components = await Component.find({type: 'actor'});
        if (components.length) {
            for (const component of components){
                actors[component.entity_id] = component.state === "on";
            }
        }
        console.log(actors)
    })();

    let getAutomations = async () => {
        const res = await api.get("/getAllAutomations");
        if(res) {
            automations = res.data.data;
        }
        console.log(automations);
    };

    socket.addEventListener('open', (event) => {
        const auth = {
            "type": "auth",
            "access_token": process.env.HOMEASSISTANT_TOKEN,
        };
        socket.send(JSON.stringify(auth));

        const subscribe = {
            "id": 1,
            "type": "subscribe_events",
            "event_type": "state_changed",
        };
        socket.send(JSON.stringify(subscribe));

        const states = {
            "id": 2,
            "type": "get_states"
        };
        socket.send(JSON.stringify(states));

        setInterval(heartbeat, heartbeatInterval);
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);

        if(message.type ==="auth_ok")
            console.log('Received message:', message);

        else if(message.type ==="result" && message.result !== null){
            //console.log(message);
            if(message.success === "true") {
                setActorsValues(message);
            }
        }
        else if(message.type === 'event' && message.event.event_type ==="state_changed") {
            changeActorValue(message);

        }
    });

    socket.addEventListener('error', (event) => {
        console.log('WebSocket error:', event);
    });
    socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
    });


    let setActorsValues = (message) => {
        for (const entity_id in actors) {
            const actor = message.result.find((c) => c.entity_id === entity_id);
            if (actor?.state !== undefined) {
                console.log(actor.state);
                actors[entity_id] = actor.state === "on" || actor.state >= 0;
            }
        }
        console.log(actors);
    };

    let changeActorValue = (message) => {
        if (message.event.data.entity_id in actors) {
            const state = message.event.data.new_state.state;
            const actor = message.event.data.entity_id;

            actors[actor] =  state === "on" || state >= 0;
            console.log(actors);
            io.emit('toggleActors', actor, actors[actor]);
        }

    };

    io.on('connection', async (socket) => {

        socket.on('initialAutomations',async () => {
            console.log('a user connected to automations');
            await getAutomations();
            // Stuur de huidige status van alle automations naar de nieuwe client
            socket.emit('initialAutomations', automations);
        });

        socket.on('initialActors', () =>{
            console.log('a user connected to Components');
            // Stuur de huidige status van alle LED's naar de nieuwe client
            socket.emit('initialActors', actors);

        });

        // Luister naar wijzigingen in de LED-status van de client
        socket.on('toggleActors', (actor) => {
            actors[actor] = !actors[actor];
            // Stuur de nieuwe LED-status naar alle clients, behalve degene die de wijziging heeft aangebracht
            socket.broadcast.emit('toggleActors', actor, actors[actor]);

            if (actor.includes('switch')) handleSwitch(actor);
            else if (actor.includes('input_number')) handleInputNumber(actor);
            else console.log("no handler found.");
        });

        // Luister naar wijzigingen in de automation-status van de client
        socket.on('toggleAutomations', async (name) => {
            const automation = automations.find(item => item.name === name);
            if (automation) {
                automation.enabled = !automation.enabled;
                socket.broadcast.emit('toggleAutomations', automation.name, automation.enabled);
                await api.post(`/toggleAutomation`, {automationName: automation.name});
            }
        });

        socket.on('deleteAutomations', async (name) => {
            const automation = automations.find(item => item.name === name);
            const targetIndex = automations.findIndex(item => item.name === name);
            if (targetIndex !== -1) {
                automations.splice(targetIndex, 1);
                socket.broadcast.emit('deleteAutomations', automation.name);
                console.log("trying to delete" + automation.name);
                await api.post(`/deleteAutomation`, {automationName: automation.name});
                console.log("automation deleted");
            }
        });

        handleSwitch = async (actor) => {
            try {
                console.log("TRIED LED");
                await fetch(`http://${process.env.HOMEASSISTANT_IP}:8123/api/services/switch/toggle`, {
                    method: 'POST',
                    body: JSON.stringify({
                        "entity_id": actor,
                    }),
                    headers: {
                        "Authorization": `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (err) {
                console.log(err.message);
            }
        }

        handleInputNumber = async (actor) => {
            try {
                console.log("TRIED SERVO, value is: " + String(actors[actor] ? 100 : -100));
                await fetch(`http://${process.env.HOMEASSISTANT_IP}:8123/api/services/input_number/set_value`, {
                    method: 'POST',
                    body: JSON.stringify({
                        "entity_id": "input_number.servo_control",
                        "value": actors[actor] ? 100 : -100,
                    }),
                    headers: {
                        "Authorization": `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (err) {
                console.log(err.message);
            }
        }
    });
}

module.exports = {initSocket};