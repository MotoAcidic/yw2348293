const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BattleSchema = new Schema({
	finished: {
		type: Boolean,
		default: false
	},
	day: {
		type: Number,
		default: 1
	},
	pool1: {
		name: {
			type: String,
			default: ""
		},
		totalVotes: {
			type: Number,
			default: 0
		},
		votes: [{
			address: {
				type: String,
			},
			amount: {
				type: Number,
			},
			timestamp: {
				type: Number
			}
		}]
	},
	pool2: {
		name: {
			type: String,
			default: ""
		},
		totalVotes: {
			type: Number,
			default: 0
		},
		votes: [{
			address: {
				type: String,
			},
			amount: {
				type: Number,
			},
			timestamp: {
				type: Number
			}
		}]
	}
});

module.exports = Battle = mongoose.model("battle", BattleSchema);