const dotenv = require('dotenv')
// const mongoose = require('mongoose');
const express = require('express')
const app = express()



const middleware = (req, res, next) => {
    console.log(`hello my middleware`)
    next();
}

dotenv.config({ path: './config.env' });

require('./db/conn')

app.use(express.json());

const User = require('./model/userSchema')

// const DB = process.env.DATABASE;
const PORT = process.env.PORT

app.use(require('./router/auth'));


// mongoose.connect(DB).then(() => {
//     console.log('connetion successful')
// }).catch((err) => console.log('no connection'));

app.get("/", (req, res) => {
    res.send('hello world')
})

app.get("/about", middleware, (req, res) => {
    res.send('hello about world')
})

app.listen(PORT, (req, res) => {
    console.log(`connection running on port no.${PORT}`)
})

