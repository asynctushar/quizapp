const mongoose = require("mongoose");

const moduleSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		test: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "test",
		},
		standardTime: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true },
);

const Module = mongoose.model("module", moduleSchema);

module.exports = Module;
