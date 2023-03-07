const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = 5000;

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
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
