const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
	day: {
		type: Number,
		default: 1
	},
	pool1: {
		type: String,
		default: ""
	},
	pool2: {
		type: String,
		default: ""
	}
});

module.exports = Schedule = mongoose.model("schedule", ScheduleSchema);