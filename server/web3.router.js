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

let previousday = 0
let day = 0
day = getDay()

function getDay() {
	let day = contract.methods.battleDay().call()
	// console.log('hi', day);
	Promise.resolve(day).then(res => {
		console.log('day', res);
		// console.log(value);
		
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
	await leaderboard.save()
	await battles.save()
}

cron.schedule('* * */1 * *', async () => {
	let today = await getDay()
	if (today > day) {
		finishBattle(day)
		previousday = day
		day = today
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
		let day = await contract.methods.battleDay().call()
		let votes = new BigNumber(await contract.methods.balanceOf(req.body.address).call()).dividedBy(10**18).toFixed(18)
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
		let day = await contract.methods.battleDay().call()
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
		let day = await contract.methods.battleDay().call()

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

module.exports = router