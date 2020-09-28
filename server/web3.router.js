const express = require('express')
const router = express.Router()

const Web3 = require('web3');

router.get('/projects', rejectUnauthenticated, async (req, res) => {
  
})

module.exports = router