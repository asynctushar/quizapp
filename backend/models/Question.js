const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		image: {
			public_id: String,
			url: String,
		},
		module: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "module",
		},
		isMulti: {
			type: Boolean,
			default: false,
		},
		subjects: [
			{
				type: String,
				required: true,
			},
		],
		skills: [
			{
				type: String,
				required: true,
			},
		],
		test: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "test",
		},
		difficulty: {
			type: String,
			required: true,
			enum: ["easy", "medium", "hard"],
		},
		standardTime: {
			type: Number,
			required: true,
		},
		optionsType: {
			type: String,
			required: true,
			default: "string",
			enum: ["string", "image", "type"],
		},
		options: [
			{
				option: {
					type: mongoose.Schema.Types.Mixed,
					required: true,
					validate: function (value) {
						if (typeof value === "string") {
							return true;
						}
						if (
							typeof value === "object" &&
							value.hasOwnProperty("public_id") &&
							value.hasOwnProperty("url")
						) {
							return true;
						}
						return false;
					},
					message: "Invalid value for the field",
				},
				answer: {
					type: String,
					enum: ["right", "wrong"],
					required: true,
					select: false,
				},
				reason: {
					type: String,
					required: true,
					select: false,
				},
			},
		],
	},
	{ timestamps: true },
);

const Question = mongoose.model("question", questionSchema);

module.exports = Question;
