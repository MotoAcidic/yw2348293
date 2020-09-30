const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaderboardSchema = new Schema({
	leaderboard: [
		{
			pool: {
				type: String,
				default: "mbBASED"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "FARM"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "LINK"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "SNX"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "YFI"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "COMP"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "BZRX"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "UNI"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "AAVE"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "WNXM"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "MKR"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "SRM"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "MEME"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "PICKLE"
			},
			votes: {
				type: Number,
				default: 0
			}
		},
		{
			pool: {
				type: String,
				default: "YAM"
			},
			votes: {
				type: Number,
				default: 0
			}
		}
	]
});

module.exports = Leaderboard = mongoose.model("leaderboard", LeaderboardSchema);