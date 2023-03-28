

function initSocket(server){
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });


    //let components = getComponents();


    const leds = {
        'led1': false,
        'led2': false,
        'led3': false
    };

    io.on('connection', (socket) => {
        console.log('a user connected');
        //console.log(components);
        // Stuur de huidige status van alle LED's naar de nieuwe client
        socket.emit('initial', leds);

        // Luister naar wijzigingen in de LED-status van de client
        socket.on('toggle', (led) => {
            leds[led] = !leds[led];
            console.log(leds);
            // Stuur de nieuwe LED-status naar alle clients, behalve degene die de wijziging heeft aangebracht
            socket.broadcast.emit('toggle', led, leds[led]);

            handleClick();
        });

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

        // Wanneer een client verbinding verbreekt
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

getComponents = async (req, res) => {
    const Component = require('../modals/ComponentModal')
    await Component.find({})
        .then(components => {
            if (!components.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `components list empty` })
            }
            return res.status(200).json({ success: true, data: components })
        })
        .catch(err => console.log(err))
}


module.exports = {initSocket};