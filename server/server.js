const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session');


require('dotenv').config();

const HTTPPort = 5000;

const http = require('http');
const server = http.createServer(app);
const {initSocket} = require('./controllers/socketController');

const db = require('./db');

const temperatureRouter = require('./routes/temperatureRouter');
const humidityRouter = require('./routes/humidityRouter');
const userRouter = require("./routes/userRouter");
const componentRouter = require("./routes/componentRouter");
const automationRouter = require("./routes/automationRouter");

app.use(cors());
app.use(session({
  secret: 'codeforgeek',
  resave: true,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Setup routes
app.use('/api', temperatureRouter);
app.use('/api', humidityRouter);
app.use('/api', userRouter);
app.use('/api', componentRouter);
app.use('/api', automationRouter);

// Initiate sockets
initSocket(server);

server.listen(HTTPPort, () => {
  console.log(`Server gestart op poort ${HTTPPort}`);
});
