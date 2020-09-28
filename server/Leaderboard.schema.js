const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaderboardSchema = new Schema({
	first: {
		pool: {
			type: String,
			default: ""
		},
		votes: {
			type: Number,
			default: 0
		}
	},
	second: {
		pool: {
			type: String,
			default: ""
		},
		votes: {
			type: Number,
			default: 0
		}
	},
	third: {
		pool: {
			type: String,
			default: ""
		},
		votes: {
			type: Number,
			default: 0
		}
	},
	fourth: {
		pool: {
			type: String,
			default: ""
		},
		votes: {
			type: Number,
			default: 0
		}
	},
	fifth: {
		pool: {
			type: String,
			default: ""
		},
		votes: {
			type: Number,
			default: 0
		}
	}
});

module.exports = Leaderboard = mongoose.model("leaderboard", LeaderboardSchema);