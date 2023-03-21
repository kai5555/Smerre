const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')

const HTTPPort = 5000;

const http = require('http');
const server = http.createServer(app);
const {initSocket} = require('./controllers/socketController')

const db = require('./db')

const temperatureRouter = require('./routes/temperature-router')
const humidityRouter = require('./routes/humidity-router')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {  
  res.send('Hello World!')
})

// Setup mongoDB connection
//db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Setup routes
app.use('/api', temperatureRouter, humidityRouter)

// Start the server
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });


initSocket(server);

server.listen(HTTPPort, () => {
  console.log(`Server gestart op poort ${HTTPPort}`);
});
