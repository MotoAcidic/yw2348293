const express = require('express')
const router = express.Router()
const Leaderboard = require('./Leaderboard.schema')
const Schedule = require('./Schedule.schema')
const Battle = require('./Battle.schema')
const cron = require('node-cron')
const abi = require('./BATTLEPool.json')
const Web3 = require('web3');
// const Contract = require('web3-eth-contract');
const web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/v3/df0ee84acd8a4a29969695303b0a1a6d'))
const contract = new web3.eth.Contract(abi.abi, '0xCC3A2c4891740e2055f4C6875a28BB9EB32f2e69')
// console.log(contract.methods);


let day = 0
day = getDay()

function getDay() {
	let day = contract.methods.battleDay().call()
	console.log('hi', day);
	Promise.resolve(day).then(res => {
		console.log('bye',res);
		
		return res
	})
}

async function finishBattle(day) {
	let battles = await Battle.find({ day: day })
	let leaderboard = await Leaderboard.findOne()
	battles.forEach(battle => {
		let p1 = leaderboard.leaderboard.findIndex(item => item.pool === battle.pool1.name)
		leaderboard.leaderboard[p1].votes += battle.pool1.totalVotes
		let p2 = leaderboard.leaderboard.findIndex(item => item.pool === battle.pool2.name)
		leaderboard.leaderboard[p2].votes += battle.pool2.totalVotes
	})
	for (let i = 0; i < battles.length; i++) {
		battles[i].finished = true
	}
	await leaderboard.update()
	await battles.update()
}

cron.schedule('* */1 * * *', async () => {
	if (getDay() > day) {
		finishBattle(day)
		let schedule = await Schedule.find({ day: day })
		schedule.forEach(async match => {
			let battle = new Battle({
				day: match.day,
				pool1: {
					name: match.pool1
				},
				pool2: {
					name: match.pool2
				}
			})
			await battle.save()
		})
	}
});

router.post('/vote', async (req, res) => {
	try {
		console.log(req.body);
		
	} catch (error) {
		res.status(500).send(error)
	}
})

router.get('/battles', async (req, res) => {
	try {
		let day = await contract.methods.battleDay().call()
		
		let battles = await Battle.find({ day: day })
		for (let i = 0; i < battles.length; i++) {
			battles[i].pool1.votes = null
			battles[i].pool2.votes = null
		}
		let leaderboard = await Leaderboard.findOne()
		let schedule = await Schedule.find()
		res.send({battles, leaderboard, schedule})
	} catch (error) {
		console.log(error);
		
		res.status(500).send('error retrieving info')
	}
})

router.get('/admin-all', async (req, res) => {
	if (req.body.password !== 'Jxneb@:&4$;!;12$') {
		res.sendStatus(403)
	}
	try {
		let battles = await Battle.find()
		let leaderboard = await Leaderboard.findOne()
		let schedule = await Schedule.find()
		res.send({battles, leaderboard, schedule})
	} catch (error) {
		res.status(500).send('error retrieving info')
	}
})

module.exports = router