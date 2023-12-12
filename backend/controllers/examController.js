const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Module = require("../models/Module");
const Question = require("../models/Question");
const Test = require("../models/Test");
const Exam = require("../models/Exam");

// get all available tests
exports.getTests = catchAsyncErrors(async (req, res, next) => {
	const tests = await Test.find();

	const testsWithModules = await Promise.all(
		tests.map(async (test) => {
			const modules = await Module.find({
				test: test.id,
			});

			return {
				...test.toObject(),
				modules,
			};
		}),
	);

	res.status(200).json({
		success: true,
		tests: testsWithModules,
	});
});

// get all available modules of a test
exports.getModules = catchAsyncErrors(async (req, res, next) => {
	const test = await Test.findById(req.params.id);

	if (!test) return next(new ErrorHandler("Test not found", 404));

	const modules = await Module.find({
		test: test.id,
	});

	const moduleWithQuestionsCount = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				module: module._id,
				test: test._id,
			});

			return {
				...module.toObject(),
				questionsCount: questions.length,
			};
		}),
	);

	res.status(200).json({
		success: true,
		test: {
			...test.toObject(),
			modules: moduleWithQuestionsCount,
		},
	});
});

// starting a exam(will recieve the questions without answer)
exports.startExam = catchAsyncErrors(async (req, res, next) => {
	const test = await Test.findById(req.params.id);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	const modules = await Module.find({
		test: test.id,
	});

	const modulesQuestions = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				test: test.id,
				module: module.id,
			});

			const moduleObj = module.toObject();

			return { ...moduleObj, questions };
		}),
	);

	const exam = await Exam.create({
		test: test.id,
		user: req.user.id,
		modules: [
			{
				module: modulesQuestions[0]._id,
				lastStartTime: new Date(Date.now()),
				questions: modulesQuestions[0].questions.map((question) => ({
					question: question._id,
				})),
			},
		],
	});

	await exam.populate("test");

	res.status(201).json({
		success: true,
		modulesQuestions,
		exam,
	});
});

// complete module
exports.completeModule = catchAsyncErrors(async (req, res, next) => {
	const { answers, totalTime } = req.body;
	if (!answers) return next(new ErrorHandler("Please provide answers"));
	if (!totalTime) return next(new ErrorHandler("Please provide module time"));

	const exam = await Exam.findOne({
		_id: req.params.id,
		user: req.user.id,
	}).populate("test");
	if (!exam) return next(new ErrorHandler("Exam not found", 404));

	if (exam.isComplete)
		return next(new ErrorHandler("Exam completed before", 400));

	if (exam.breakTime)
		return next(new ErrorHandler("Skip the break time to continue", 400));

	const module = await Module.findById(req.params.module);
	if (!module) return next(new ErrorHandler("Module not found", 404));

	const moduleIndex = exam.modules.findIndex(
		(mod) => mod.module.toString() === module._id.toString(),
	);
	if (moduleIndex === -1)
		return next(new ErrorHandler("Module not found in Exam", 404));

	if (exam.modules[moduleIndex].isComplete)
		return next(new ErrorHandler("Module already complete", 404));

	const questions = await Question.find({
		module: module.id,
	})
		.select("+options.answer")
		.select("+options.reason");

	const moduleQuestions = exam.modules.find((testModule) =>
		testModule.module.equals(module._id),
	).questions;

	// Check if answers match module questions
	const isAnswersMatching = answers.every((answer) =>
		moduleQuestions.some(
			(moduleQuestion) =>
				moduleQuestion.question.toString() === answer.question,
		),
	);

	if (!isAnswersMatching) {
		return next(
			new ErrorHandler(
				"Mismatch between answers and exam questions",
				400,
			),
		);
	}

	// Check if answers are correct and update the answers array
	const updatedAnswers = answers.map((answer) => {
		const moduleQuestion = questions.find(
			(question) => question.id === answer.question,
		);

		if (moduleQuestion.optionsType === "type") {
			const selectedOptions = moduleQuestion.options.filter((option) =>
				answer.answer.includes(option.option),
			);

			const isCorrect =
				selectedOptions.length < 1
					? false
					: selectedOptions.some(
							(option) => option.answer === "right",
					  );

			const reason =
				selectedOptions.length < 1
					? ["Conceptual understanding"]
					: selectedOptions.map((option) => option.reason);

			return {
				...answer,
				isCorrect,
				reason,
				hasAnswered: true,
			};
		} else {
			const selectedOptions = moduleQuestion.options.filter((option) =>
				answer.answer.includes(option.id),
			);

			const allCorrect = selectedOptions.every(
				(option) => option.answer === "right",
			);

			const isCorrect =
				allCorrect &&
				selectedOptions.every((selectedOption) =>
					answer.answer.includes(selectedOption.id),
				) &&
				moduleQuestion.options
					.filter((option) => option.answer === "right")
					.every((correctOption) =>
						answer.answer.includes(correctOption.id),
					);

			const reason = selectedOptions.map((option) => option.reason);

			return {
				...answer,
				isCorrect,
				reason,
				hasAnswered: true,
			};
		}
	});

	exam.modules[moduleIndex].questions = updatedAnswers;
	exam.modules[moduleIndex].totalTime = totalTime;

	const modules = await Module.find({
		test: exam.test,
	});

	if (moduleIndex + 1 >= modules.length) {
		exam.breakTime = null;
		exam.modules[moduleIndex].isComplete = true;
		await exam.save();
		const examCopy = await Exam.findById(exam.id);
		await examCopy.populate("test");

		return res.status(200).json({
			success: true,
			message: "All module answered, you can submit the test now",
			exam,
		});
	}

	const currentTimestamp = Date.now();

	const breakDuration = 10 * 60 * 1000;
	const newBreakTime = new Date(currentTimestamp + breakDuration);
	exam.breakTime = newBreakTime;
	exam.modules[moduleIndex].isComplete = true;

	await exam.save();

	return res.status(200).json({
		success: true,
		message: " You have a 10-minute break before starting the next module.",
		breakTime: newBreakTime,
		exam,
	});
});

// skip module break
exports.skipModuleBreak = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findOne({
		_id: req.params.id,
		user: req.user.id,
	}).populate("test");

	if (!exam) return next(new ErrorHandler("Exam not found", 404));
	if (exam.isComplete)
		return next(new ErrorHandler("Exam completed before", 400));

	if (!exam.breakTime) {
		res.status(200).json({
			success: false,
			message: "Module is running",
			exam,
		});
	}

	const modules = await Module.find({
		test: exam.test,
	});

	const lastModuleIndex = exam.modules.length - 1;

	if (lastModuleIndex < 0) {
		return next(new ErrorHandler("No modules found in the Exam", 400));
	}

	const nextModuleIndex = lastModuleIndex + 1;

	if (nextModuleIndex < modules.length) {
		const nextModule = modules[nextModuleIndex];
		const questions = await Question.find({ module: nextModule.id });
		if (questions.length > 0) {
			exam.modules.push({
				module: nextModule._id,
				lastStartTime: Date.now(),
				questions: questions.map((question) => ({
					question: question._id,
				})),
			});
		} else {
			return res.status(200).json({
				success: false,
				message:
					"Then next module has no question, Might be in maintainance mode. you can submit the test",
			});
		}
	} else {
		exam.breakTime = null;
		await exam.save();

		return res.status(200).json({
			success: true,
			message: "All module answered, you can submit the test now",
			exam,
		});
	}

	exam.breakTime = null;
	await exam.save();

	return res.status(200).json({
		success: true,
		exam,
	});
});

// module break finish
exports.finishModuleBreak = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findOne({
		_id: req.params.id,
		user: req.user.id,
	}).populate("test");

	if (!exam) return next(new ErrorHandler("Exam not found", 404));

	if (exam.isComplete)
		return next(new ErrorHandler("Exam completed before", 400));

	if (exam.breakTime) {
		return next(new ErrorHandler("Please skip module break or wait", 400));
	}

	const lastModuleIndex = exam.modules.length - 1;

	if (lastModuleIndex < 0) {
		return next(new ErrorHandler("No modules found in the Exam", 400));
	}

	const lastModule = exam.modules[lastModuleIndex - 1];
	const moduleQuestions = lastModule.questions;

	const hasUnansweredQuestions = moduleQuestions.some(
		(question) => !question.hasAnswered,
	);

	if (hasUnansweredQuestions) {
		return next(
			new ErrorHandler("Previous module is still in progress", 400),
		);
	}

	const modules = await Module.find({
		test: exam.test,
	});
	const nextModuleIndex = lastModuleIndex + 1;

	if (nextModuleIndex < modules.length) {
		const nextModule = modules[nextModuleIndex];
		const questions = await Question.find({ module: nextModule.id });
		if (questions.length > 0) {
			exam.modules.push({
				module: nextModule._id,
				lastStartTime: Date.now(),
				questions: questions.map((question) => ({
					question: question._id,
				})),
			});
		} else {
			return res.status(200).json({
				success: false,
				message:
					"Then next module has no question, Might be in maintainance mode. you can submit the test",
			});
		}
	} else {
		exam.breakTime = null;
		await exam.save();

		return res.status(200).json({
			success: true,
			message: "All module answered, you can submit the test now",
			exam,
		});
	}

	await exam.save();

	return res.status(200).json({
		success: true,
		exam,
	});
});

//complete a exam
exports.completeExam = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findOne({
		_id: req.params.id,
		user: req.user.id,
	}).populate("test");

	if (!exam) return next(new ErrorHandler("Test not found", 404));

	if (exam.isComplete)
		return next(new ErrorHandler("Test completed before", 400));

	const modules = await Module.find({ test: exam.test });

	const missingModules = modules.filter(
		(module) =>
			!exam.modules.some((examModule) =>
				examModule.module.equals(module._id),
			),
	);

	if (missingModules.length > 0) {
		return next(
			new ErrorHandler("Some modules are missing in the test", 400),
		);
	}

	for (const module of exam.modules) {
		const allQuestionsAnswered = module.questions.every(
			(question) => question.hasAnswered,
		);

		if (!allQuestionsAnswered) {
			return next(
				new ErrorHandler(
					"All questions in the modules must be answered",
					400,
				),
			);
		}
	}

	// Complete the test
	exam.isComplete = true;
	await exam.save();

	return res.status(200).json({
		success: true,
		message: "Test completed successfully",
		exam,
	});
});

// get all exams(as a user)
exports.getOwnAllExams = catchAsyncErrors(async (req, res, next) => {
	const exams = await Exam.find({
		user: req.user.id,
	})
		.populate("user")
		.populate("test");

	res.status(200).json({
		success: true,
		exams
	});
});

// get a exam's details( for user)
exports.getUserExamDetails = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findOne({
		user: req.user.id,
		_id: req.params.id,
	})
		.populate("test")
		.populate("user")
		.populate({
			path: "modules",
			populate: {
				path: "questions",
				populate: {
					path: "question",
					select: "+options.answer +options.reason",
					populate: {
						path: "module",
					},
				},
			},
		})

		.select("+modules.questions.isCorrect")
		.select("+modules.questions.reason");

	if (!exam) {
		return next(new ErrorHandler("Exam not found", 404));
	}

	const modules = await Module.find({ test: exam.test.id });

	const modulesQuestions = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				test: exam.test.id,
				module: module.id,
			})
				.select("+options.answer")
				.select("+options.reason");

			return {
				...module.toObject(),
				questions,
			};
		}),
	);

	res.status(200).json({
		success: true,
		exam: {
			...exam.toObject(),
			test: {
				...exam.test.toObject(),
				modules: modulesQuestions,
			},
		},
	});
});

// get a exam's details( for admin)
exports.getExamDetails = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findById(req.params.id)
		.populate("test")
		.populate("user")
		.populate({
			path: "modules",
			populate: {
				path: "questions",
				populate: {
					path: "question",
					select: "+options.answer +options.reason",
					populate: {
						path: "module",
					},
				},
			},
		})

		.select("+modules.questions.isCorrect")
		.select("+modules.questions.reason");

	if (!exam) {
		return next(new ErrorHandler("Exam not found", 404));
	}

	const modules = await Module.find({ test: exam.test.id });

	const modulesQuestions = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				test: exam.test.id,
				module: module.id,
			})
				.select("+options.answer")
				.select("+options.reason");

			return {
				...module.toObject(),
				questions,
			};
		}),
	);

	res.status(200).json({
		success: true,
		exam: {
			...exam.toObject(),
			test: {
				...exam.test.toObject(),
				modules: modulesQuestions,
			},
		},
	});
});

// get all tests(as a admin)
exports.getUserAllExams = catchAsyncErrors(async (req, res, next) => {
	const exams = await Exam.find().populate("user").populate("test");

	res.status(200).json({
		success: true,
		exams,
	});
});
