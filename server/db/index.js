const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://IB3:IB3@cluster0.vx5fwxx.mongodb.net/IB3?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
    console.log('MongoDB connected!');
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});

module.exports = mongoose;

