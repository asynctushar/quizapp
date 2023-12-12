const cron = require("node-cron");
const Test = require("../models/Test");
const Module = require("../models/Module");
const Question = require("../models/Question");

// every minute update the test schedule
module.exports = async () => {
	cron.schedule("* * * * * * *", async () => {
		try {
			const testsWithActiveBreaks = await Test.find({
				breakTime: { $ne: null },
				isComplete: false,
			});

			for (const test of testsWithActiveBreaks) {
				const currentTimestamp = Date.now();

				if (currentTimestamp > test.breakTime.getTime()) {
					const lastModuleIndex = test.modules.length - 1;

					if (lastModuleIndex >= 0) {
						const lastModule = test.modules[lastModuleIndex];
						const moduleQuestions = lastModule.questions;

						const hasUnansweredQuestions = moduleQuestions.some(
							(question) => !question.hasAnswered,
						);

						if (!hasUnansweredQuestions) {
							const modules = await Module.find({
								subject: test.subject,
							});

							const nextModuleIndex = lastModuleIndex + 1;

							if (nextModuleIndex < modules.length) {
								const nextModule = modules[nextModuleIndex];
								const questions = await Question.find({
									module: nextModule.id,
								});

								if (questions.length > 0) {
									test.modules.push({
										module: nextModule._id,
										questions: [
											{
												question: questions[0]._id,
												lastStartTime: new Date(
													Date.now(),
												),
											},
										],
									});
								}
							}
						}
					}

					test.breakTime = null;
					await test.save();
				}
			}
		} catch (error) {
			console.error("Error in module scheduler:", error);
		}
	});
};
