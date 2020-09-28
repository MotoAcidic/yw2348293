const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const web3Router = require('./web3.router')
const dotenv = require('dotenv')
const connectDB = require('./db')
dotenv.config()
connectDB()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', web3Router)


server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`)
})
