const express = require('express')
const router = express.Router()
const Leaderboard = require('./Leaderboard.schema')
const Schedule = require('./Schedule.schema')
const Battle = require('./Battle.schema')
const cron = require('node-cron')
const abi = require('./BATTLEPool.json')
const Web3 = require('web3');
const BigNumber = require('bignumber.js')
// const Contract = require('web3-eth-contract');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/a768678405854cf584ae620be7844cc3'))
const contract = new web3.eth.Contract(abi.abi, '0xa9CDb5e3C911884Ca6D4b32273c219B536Ee9e6A')
// console.log(contract.methods);
// let value = contract.methods.balanceOf('0x0f93e12029b7a934b40443889eea09dea97d48a9').call();
const fs = require('fs');


let leaderboard = new Leaderboard({
	leaderboard: [
		{
			pool: "mbBASED",
			votes: 0
		},
		{
			pool: "FARM",
			votes: 0
		},
		{
			pool: "LINK",
			votes: 0
		},
		{
			pool: "SNX",
			votes: 0
		},
		{
			pool: "YFI",
			votes: 0
		},
		{
			pool: "COMP",
			votes: 0
		},
		{
			pool: "BZRX",
			votes: 0
		},
		{
			pool: "UNI",
			votes: 0
		},
		{
			pool: "AAVE",
			votes: 0
		},
		{
			pool: "WNXM",
			votes: 0
		},
		{
			pool: "MKR",
			votes: 0
		},
		{
			pool: "SRM",
			votes: 0
		},
		{
			pool: "MEME",
			votes: 0
		},
		{
			pool: "PICKLE",
			votes: 0
		},
		{
			pool: "YAM",
			votes: 0
		}
	]
})
leaderboard.save()


let day = 0
day = getDay()

function getDay() {
	let day = Math.floor(((Date.now() - 1601395200) / 86400) + 1)
	console.log(day);
	
	return day
}

cron.schedule('0 1 */1 * *', async () => {
	let today = getDay()
	let tomorrow = Math.floor(((Date.now() + 3600 - 1601395200) / 86400) + 1)
	console.log(today, tomorrow);

	if (tomorrow > today) {
		finishBattle(today)
		setTimeout(async () => {
			let schedule = await Schedule.find({ day: tomorrow })
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
		}, 3600000);
	}
});

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
	await leaderboard.save()
	await battles.save()
}

router.post('/vote', async (req, res) => {
	if (!req.body) {
		res.sendStatus(500)
		return
	}
	try {
		let s = {
			address: req.body.address,
			vote: req.body.vote
		}
		const signingAddress = web3.eth.accounts.recover(JSON.stringify(s), req.body.sig);
		let day = 3
		let votes = new BigNumber(await contract.methods.balanceOf(req.body.address).call()).dividedBy(10 ** 18).toFixed(18)
		console.log(votes);

		if (req.body.address !== signingAddress || parseFloat(votes) === 0) {
			res.sendStatus(403)
			return
		}
		req.body.vote.forEach(async r => {
			let battle = await Battle.findOne({ _id: r._id, day: day })
			if (battle.pool1.votes.findIndex(vote => vote.address === req.body.address) !== -1 || battle.pool2.votes.findIndex(vote => vote.address === req.body.address) !== -1) {
				res.status(403)
				return
			}
			if (battle.pool1.name === r.vote) {
				battle.pool1.totalVotes += parseFloat(votes)
				battle.pool1.votes.push({ address: req.body.address, amount: parseFloat(votes), timestamp: Date.now() })
				await battle.save()
			}
			if (battle.pool2.name === r.vote) {
				battle.pool2.totalVotes += parseFloat(votes)
				battle.pool2.votes.push({ address: req.body.address, amount: parseFloat(votes), timestamp: Date.now() })
				await battle.save()
			}
		})
		res.send("ok")
	} catch (error) {
		console.log(error);

		res.status(500).send(error)
	}
})

router.post('/status', async (req, res) => {
	// console.log(req.body.address);

	try {
		let day = 3
		let battles = await Battle.find({ day: day })
		let battle1 = battles[0]
		let battle2 = battles[1]
		// console.log(battle1, battle2);

		if ((battle1.pool1.votes.findIndex(vote => vote.address === req.body.address) !== -1)
			|| (battle1.pool2.votes.findIndex(vote => vote.address === req.body.address) !== -1)
			|| (battle2.pool1.votes.findIndex(vote => vote.address === req.body.address) !== -1)
			|| (battle2.pool2.votes.findIndex(vote => vote.address === req.body.address) !== -1)
		) {
			res.send(true)
		} else {
			res.send(false)
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('error')
	}
})

router.get('/battles', async (req, res) => {
	try {
		let day = 3

		let battles = await Battle.find({ day: day })
		for (let i = 0; i < battles.length; i++) {
			battles[i].pool1.votes = null
			battles[i].pool1.totalVotes = null
			battles[i].pool2.votes = null
			battles[i].pool2.totalVotes = null
		}
		let leaderboard = await Leaderboard.findOne()
		let schedule = await Schedule.find()
		res.send({ battles, leaderboard, schedule })
	} catch (error) {
		console.log(error);

		res.status(500).send('error retrieving info')
	}
})

router.post('/previous-battles', async (req, res) => {
	let day = ((Date.now() - 1601395200) / 86400)
	if (req.body.day >= day) {
		res.sendStatus(403)
		return
	}
	try {
		console.log(req.body);
		
		let battles = await Battle.find({ day: req.body.day })
		res.send(battles)
	} catch (error) {
		console.log(error);

		res.status(500).send('error retrieving info')
	}
})

module.exports = router