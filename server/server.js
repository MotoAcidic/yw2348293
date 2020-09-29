const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const web3Router = require('./web3.router')
const dotenv = require('dotenv')
const Web3 = require('web3');
const cors = require('cors')
const connectDB = require('./db')


app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

dotenv.config()
connectDB()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', web3Router)


server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`)
})
