const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('build'))

server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`)
})
