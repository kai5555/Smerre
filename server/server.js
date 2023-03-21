const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = 5000;
const HTTPPort = 5001;

const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const db = require('./db')

const temperatureRouter = require('./routes/temperature-router')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {  
  res.send('Hello World!')
})

// Setup mongoDB connection
//db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Setup routes
app.use('/api', temperatureRouter)

// Start the server
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });



const leds = {
  'led1': false,
  'led2': false,
  'led3': false
};

console.log("test 123")
io.on('connection', (socket) => {
  console.log('a user connected');

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

server.listen(HTTPPort, () => {
  console.log(`Server gestart op poort ${HTTPPort}`);
});
