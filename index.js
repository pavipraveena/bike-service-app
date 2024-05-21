const express = require('express');
const mongoose = require('mongoose');
// const User = require('./models/user.model.js');
// const Service = require('./models/service.model.js');
const userRoute  = require('./routes/user.route.js');
const serviceRoute  = require('./routes/service.route.js');
const bookingRoute  = require('./routes/booking.route.js');
const loginRoute = require('./routes/login.route.js');


const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/api/user",userRoute);
app.use("/api/service",serviceRoute);
app.use("/api/booking",bookingRoute);
app.use("/api",loginRoute);

app.get('/', (req, res) => {
    res.send('Hello Node API')
});

mongoose.connect("mongodb+srv://Pavi:pavi@backend.mrznroy.mongodb.net/Node_api?retryWrites=true&w=majority&appName=Backend")
.then(() =>{
    console.log("conneted to database");
    app.listen(3000, () =>{
        console.log("server is running in port 3000 ");
    });
})
.catch(() =>{
    console.log("connection failed");
});
  