const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
	day: {
		type: Number,
		default: 1
	},
	vs1: {
		pool1: {
			type: String,
			default: ""
		},
		pool2: {
			type: String,
			default: ""
		}
	},
	vs2: {
		pool1: {
			type: String,
		},
		pool2: {
			type: String,
		}
	},
});

module.exports = Schedule = mongoose.model("schedule", ScheduleSchema);