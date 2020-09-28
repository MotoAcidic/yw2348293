const express = require('express')
const router = express.Router()
const Leaderboard = require('./Leaderboard.schema')
const Schedule = require('./Schedule.schema')
const Battle = require('./Battle.schema')
const cron = require('node-cron')

const Web3 = require('web3');

let day = getDay()
let todaysBattle = null

function getDay() {
	return 1
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

router.get('/battles', async (req, res) => {
	try {
		let battles = await Battle.find({ day: day })
		let leaderboard = await Leaderboard.findOne()
		let schedule = await Schedule.find()
		res.send({battles, leaderboard, schedule})
	} catch (error) {
		res.status(500).send('error retrieving info')
	}
})

module.exports = router