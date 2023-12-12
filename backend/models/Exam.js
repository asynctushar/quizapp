const mongoose = require("mongoose");

const examSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: "user",
			required: true,
		},
		test: {
			type: mongoose.Types.ObjectId,
			ref: "test",
			required: true,
		},
		isComplete: {
			type: Boolean,
			required: true,
			default: false,
		},
		breakTime: {
			type: Date,
		},
		modules: [
			{
				module: {
					type: mongoose.Types.ObjectId,
					ref: "module",
					required: true,
				},
				isComplete: {
					type: Boolean,
					required: true,
					default: false,
				},
				lastStartTime: {
					type: Date,
					required: true,
				},
				totalTime: {
					type: Number,
				},
				questions: [
					{
						question: {
							type: mongoose.Types.ObjectId,
							ref: "question",
							required: true,
						},
						answer: {
							type: [
								{
									type: String,
								},
							],
						},
						isCorrect: {
							type: Boolean,
							select: false,
						},
						reason: [
							{
								type: String,
								select: false,
							},
						],
						totalTime: {
							type: Number,
						},
						hasAnswered: {
							type: Boolean,
							required: true,
							default: false,
						},
					},
				],
			},
		],
	},
	{ timestamps: true },
);

const Exam = mongoose.model("exam", examSchema);

module.exports = Exam;
