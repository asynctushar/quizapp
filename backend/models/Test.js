const mongoose = require("mongoose");

const testSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true },
);

const Test = mongoose.model("test", testSchema);

module.exports = Test;
