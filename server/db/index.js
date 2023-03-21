const mongoose = require("mongoose");
const {log} = require("mercedlogger");
const mongoDB = "mongodb+srv://IB3:IB3@cluster0.vx5fwxx.mongodb.net/IB3?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

module.exports = mongoose;

