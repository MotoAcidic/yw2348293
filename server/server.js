const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const dotenv = require('dotenv')
const Web3 = require('web3');
dotenv.config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`)
})
