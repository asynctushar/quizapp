const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Module = require("../models/Module");
const Question = require("../models/Question");
const getDataUri = require("../utils/getDataUri");
const Test = require("../models/Test");
const Exam = require("../models/Exam");
const cloudinary = require("cloudinary").v2;

// create test ---- admin
exports.createTest = catchAsyncErrors(async (req, res, next) => {
	const name = req.body.name;
	if (!name) return next(new ErrorHandler("Please provide test name", 400));

	const test = await Test.create({
		name,
	});

	res.status(201).json({
		success: true,
		message: "Test created",
		test,
	});
});

// update test details -- admin
exports.updateTest = catchAsyncErrors(async (req, res, next) => {
	const id = req.params.id;
	const { name } = req.body;

	const test = await Test.findByIdAndUpdate(
		id,
		{
			$set: {
				name,
			},
		},
		{ new: true },
	);

	if (!test) {
		return next(new ErrorHandler("Test not found", 404));
	}

	res.status(200).json({
		success: true,
		test,
	});
});

// delete test -- admin
exports.deleteTest = catchAsyncErrors(async (req, res, next) => {
	const test = await Test.findById(req.params.id);

	if (!test) {
		return next(new ErrorHandler("Test not found", 404));
	}

	// delete test modules
	const modules = await Module.find({
		test: test.id,
	});

	if (modules.length > 0) {
		await Promise.all(
			modules.map(
				async (module) => await Module.findByIdAndDelete(module._id),
			),
		);
	}
	// delete test exams
	const exams = await Exam.find({
		test: test.id,
	});

	if (exams.length > 0) {
		await Promise.all(
			exams.map(async (exam) => await Exam.findByIdAndDelete(exam._id)),
		);
	}

	// delete test's questions
	const questions = await Question.find({
		test: test.id,
	});

	if (questions.length > 0) {
		await Promise.all(
			questions.map(
				async (question) =>
					await Question.findByIdAndDelete(question._id),
			),
		);
	}

	await Test.findByIdAndDelete(test._id);
	const tests = await Test.find();

	const testsWithModules = await Promise.all(
		tests.map(async (test) => {
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

			return {
				...test.toObject(),
				modules: moduleWithQuestionsCount,
			};
		}),
	);

	res.status(200).json({
		success: true,
		tests: testsWithModules,
		message: "Test deleted successfully",
	});
});

// create test's module ---- admin
exports.createModule = catchAsyncErrors(async (req, res, next) => {
	const { name, standardTime } = req.body;
	if (!name) return next(new ErrorHandler("Please provide module name", 400));
	if (!standardTime)
		return next(new ErrorHandler("Please provide standardTime", 400));

	const test = await Test.findById(req.params.id);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	const module = await Module.create({
		name,
		test: test.id,
		standardTime,
	});

	res.status(201).json({
		success: true,
		message: `Module for ${test.name} created`,
		module,
	});
});

// update module details -- admin
exports.updateModule = catchAsyncErrors(async (req, res, next) => {
	const id = req.params.id;
	const { name, standardTime } = req.body;

	const module = await Module.findByIdAndUpdate(
		id,
		{
			$set: {
				name,
				standardTime,
			},
		},
		{ new: true },
	);

	if (!module) {
		return next(new ErrorHandler("Module not found", 404));
	}

	res.status(200).json({
		success: true,
		module,
	});
});

// delete module -- admin
exports.deleteModule = catchAsyncErrors(async (req, res, next) => {
	const module = await Module.findById(req.params.id);

	if (!module) {
		return next(new ErrorHandler("Module not found", 404));
	}

	const test = await Test.findById(module.test);

	if (!test) {
		return next(new ErrorHandler("Test not found", 404));
	}
	// delete module's questions
	const questions = await Question.find({
		module: module.id,
		test: test.id,
	});

	// delete test exams
	const exams = await Exam.find({
		test: test.id,
	});

	if (exams.length > 0) {
		await Promise.all(
			exams.map(async (exam) => await Test.findByIdAndDelete(exam._id)),
		);
	}

	if (questions.length > 0) {
		await Promise.all(
			questions.map(
				async (question) =>
					await Question.findByIdAndDelete(question._id),
			),
		);
	}

	await Module.findByIdAndDelete(module._id);
	const modules = await Module.find({
		test: test._id,
	});

	const moduleWithQuestionsCount = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				module: module._id,
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

// add image to question
exports.uploadQuestionImage = catchAsyncErrors(async (req, res, next) => {
	if (!req.file)
		return next(new ErrorHandler("Please upload question image", 404));

	const question = await Question.findById(req.params.id);
	if (!question) return next(new ErrorHandler("Question not found", 404));

	const test = await Test.findById(question.test);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	const module = await Module.findById(question.module);
	if (!module) return next(new ErrorHandler("Module not found", 404));

	if (question.image?.public_id) {
		await cloudinary.uploader.destroy(question.image.public_id);
	}

	const pictureUri = getDataUri(req.file);
	const myCloud = await cloudinary.uploader.upload(pictureUri.content, {
		folder: "/quizapp/question",
		crop: "scale",
	});

	question.image = {
		public_id: myCloud.public_id,
		url: myCloud.secure_url,
	};

	await question.save();

	const moduleQuestions = await Question.find({
		module: module.id,
		test: test.id,
	})
		.select("+options.answer")
		.select("+options.reason");

	res.status(200).json({
		success: true,
		module: {
			...module.toObject(),
			questions: moduleQuestions,
		},
	});
});

// create test's module's question(image) ---- admin
exports.createImageQuestion = catchAsyncErrors(async (req, res, next) => {
	const {
		title,
		difficulty,
		options,
		standardTime,
		subjects,
		skills,
		isMulti,
	} = req.body;

	if (
		!title ||
		!difficulty ||
		!options ||
		!standardTime ||
		!skills ||
		!subjects
	)
		return next(new ErrorHandler("Please fill all the fields", 400));
	if (req.files.length !== 4)
		return next(new ErrorHandler("Please upload four option image", 404));

	const test = await Test.findById(req.params.id);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	const module = await Module.findOne({
		_id: req.params.module,
		test: test.id,
	}).populate("test");

	if (!module) return next(new ErrorHandler("Module not found", 404));

	const questions = await Question({
		module: module.id,
		test: test.id,
	});

	if (questions.length >= 27)
		return next(
			new ErrorHandler(
				"question limit per module(27) has been reached",
				400,
			),
		);

	const optionsArr = JSON.parse(options);
	const skillsArr = JSON.parse(skills);
	const subjectsArr = JSON.parse(subjects);

	// check if every details provided in the array is correct and match with files.
	if (
		optionsArr.every((item) => {
			if (!item.answer || !item.reason) return false;

			if (
				req.files.every((file) => {
					return file.originalname === item.option;
				})
			)
				return true;

			return false;
		})
	) {
		return next(new ErrorHandler("Please provide all valid details"));
	}

	if (isMulti === "true") {
		const rightAnswers = optionsArr.filter(
			(option) => option.answer === "right",
		);

		if (rightAnswers.length < 2)
			return next(
				new ErrorHandler(
					"Multiple choice required atleast two right answer.",
				),
			);
	} else {
		const rightAnswers = optionsArr.filter(
			(option) => option.answer === "right",
		);

		if (rightAnswers.length !== 1)
			return next(new ErrorHandler("Provide single right answer"));
	}

	// upload option image to cloudinary
	const imagePaths = await Promise.all(
		req.files.map(async (picture) => {
			const pictureUri = getDataUri(picture);

			const myCloud = await cloudinary.uploader.upload(
				pictureUri.content,
				{
					folder: "/quizapp/options",
					crop: "scale",
				},
			);

			return {
				fileName: picture.originalname,
				path: {
					public_id: myCloud.public_id,
					url: myCloud.secure_url,
				},
			};
		}),
	);

	// match and set the image with their related data
	const dbOptions = optionsArr.map((item) => {
		const imagePath = imagePaths.find(
			(image) => image.fileName === item.option,
		);

		return {
			answer: item.answer,
			reason: item.reason,
			option: imagePath.path,
		};
	});

	await Question.create({
		title,
		difficulty,
		standardTime,
		optionsType: "image",
		options: dbOptions,
		test: test.id,
		module: module.id,
		isMulti,
		skills: skillsArr,
		subjects: subjectsArr,
	});

	const moduleQuestions = await Question.find({
		module: module.id,
		test: test.id,
	})
		.select("+options.answer")
		.select("+options.reason");

	res.status(200).json({
		success: true,
		module: {
			...module.toObject(),
			questions: moduleQuestions,
		},
	});
});

// create test's module's question(string) ---- admin
exports.createStringQuestion = catchAsyncErrors(async (req, res, next) => {
	const {
		title,
		difficulty,
		options,
		standardTime,
		isMulti,
		subjects,
		skills,
		optionType,
	} = req.body;

	if (
		!title ||
		!difficulty ||
		!options ||
		!standardTime ||
		!skills ||
		!subjects ||
		!optionType
	)
		return next(new ErrorHandler("Please fill all the fields", 400));

	if (optionType !== "string" && optionType !== "type")
		return next(new ErrorHandler("OptionType string or type required"));

	const test = await Test.findById(req.params.id);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	const module = await Module.findOne({
		_id: req.params.module,
		test: test.id,
	}).populate("test");

	if (!module) return next(new ErrorHandler("Module not found", 404));

	const questions = await Question({
		module: module.id,
		test: test.id,
	});

	if (questions.length >= 27)
		return next(
			new ErrorHandler(
				"question limit per module(27) has been reached",
				400,
			),
		);

	// check if every details provided in the array is correct.
	if (
		!options.every((item) => {
			if (!item.answer || !item.reason || !item.option) return false;

			if (typeof item.option !== "string") return false;

			return true;
		})
	) {
		return next(new ErrorHandler("Please provide all valid details"));
	}

	if (isMulti) {
		const rightAnswers = options.filter(
			(option) => option.answer === "right",
		);

		if (rightAnswers.length < 2)
			return next(
				new ErrorHandler(
					"Multiple choice required atleast two right answer.",
				),
			);
	} else {
		const rightAnswers = options.filter(
			(option) => option.answer === "right",
		);

		if (rightAnswers.length !== 1)
			return next(new ErrorHandler("Provide single right answer"));
	}

	await Question.create({
		title,
		difficulty,
		standardTime,
		optionsType: optionType,
		options,
		test: test.id,
		module: module.id,
		isMulti,
		subjects,
		skills,
	});

	const moduleQuestions = await Question.find({
		module: module.id,
		test: test.id,
	})
		.select("+options.answer")
		.select("+options.reason");

	res.status(200).json({
		success: true,
		module: {
			...module.toObject(),
			questions: moduleQuestions,
		},
	});
});

// update question(string)
exports.updateStringQuestion = catchAsyncErrors(async (req, res, next) => {
	const question = await Question.findById(req.params.id);
	if (!question) return next(new ErrorHandler("Question not found", 404));

	const test = await Test.findById(question.test);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	const module = await Module.findOne({
		test: test.id,
		_id: question.module,
	}).populate("test");

	if (!module) return next(new ErrorHandler("Module not found", 404));

	const {
		title,
		difficulty,
		options,
		standardTime,
		isMulti,
		subjects,
		skills,
		optionType,
	} = req.body;

	if (
		!title ||
		!difficulty ||
		!options ||
		!standardTime ||
		!skills ||
		!subjects ||
		!optionType
	)
		return next(new ErrorHandler("Please fill all the fields", 400));

	if (optionType !== "string" && optionType !== "type")
		return next(new ErrorHandler("OptionType string or type required"));

	if (
		!options.every((item) => {
			if (!item.answer || !item.reason || !item.option) return false;

			if (typeof item.option !== "string") return false;

			return true;
		})
	) {
		// check if every details provided in the array is correct.
		return next(new ErrorHandler("Please provide all valid details"));
	}

	if (isMulti) {
		const rightAnswers = options.filter(
			(option) => option.answer === "right",
		);

		if (rightAnswers.length < 2)
			return next(
				new ErrorHandler(
					"Multiple choice required atleast two right answer.",
				),
			);
	} else {
		const rightAnswers = options.filter(
			(option) => option.answer === "right",
		);

		if (rightAnswers.length !== 1)
			return next(new ErrorHandler("Provide single right answer"));
	}

	await Question.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				title,
				difficulty,
				options,
				standardTime,
				isMulti,
				subjects,
				optionsType: optionType,
				skills,
			},
		},
		{ new: true, runValidators: true },
	);

	res.status(200).json({
		success: true,
		message: "Question updated",
	});
});

// update question(image)
exports.updateImageQuestion = catchAsyncErrors(async (req, res, next) => {
	const question = await Question.findById(req.params.id);
	if (!question) return next(new ErrorHandler("Question not found", 404));

	const test = await Test.findById(question.test);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	const module = await Module.findOne({
		test: test.id,
		_id: question.module,
	}).populate("test");

	if (!module) return next(new ErrorHandler("Module not found", 404));

	const {
		title,
		difficulty,
		options,
		standardTime,
		isMulti,
		subjects,
		skills,
	} = req.body;

	if (
		!title ||
		!difficulty ||
		!options ||
		!standardTime ||
		!skills ||
		!subjects
	)
		return next(new ErrorHandler("Please fill all the fields", 400));

	const optionsArr = JSON.parse(options);
	const skillsArr = JSON.parse(skills);
	const subjectsArr = JSON.parse(subjects);

	const imageUpdatedOptions = optionsArr.filter(
		(option) => !option.option.public_id,
	);

	if (imageUpdatedOptions.length !== req.files.length)
		return next(
			new ErrorHandler("Please Provide image for updated field", 400),
		);

	// upload option image to cloudinary
	const imagePaths = await Promise.all(
		req.files.map(async (picture) => {
			const pictureUri = getDataUri(picture);

			const myCloud = await cloudinary.uploader.upload(
				pictureUri.content,
				{
					folder: "/quizapp/options",
					crop: "scale",
				},
			);

			return {
				fileName: picture.originalname,
				path: {
					public_id: myCloud.public_id,
					url: myCloud.secure_url,
				},
			};
		}),
	);

	const updatedOptionsArr = await Promise.all(
		optionsArr.map(async (option) => {
			const matchingImagePath = imagePaths.find((imagePath) => {
				if (option._id) {
					return imagePath.fileName === option._id.toString();
				} else {
					return imagePath.fileName === option.id.toString();
				}
			});

			if (matchingImagePath?.fileName) {
				const oldOption = question.options.find((oldOpt) => {
					if (option.id) {
						return false;
					} else {
						return oldOpt.id === option._id;
					}
				});

				if (oldOption && oldOption.option.public_id) {
					const oldImagePath = {
						public_id: oldOption.option.public_id,
						url: oldOption.option.url,
					};

					await cloudinary.uploader.destroy(oldImagePath.public_id);
				}
				option.option.public_id = matchingImagePath.path.public_id;
				option.option.url = matchingImagePath.path.url;
			}

			return option;
		}),
	);

	// check if every details provided in the array is correct.
	if (
		!updatedOptionsArr.every((item) => {
			if (!item.answer || !item.reason || !item.option.public_id)
				return false;

			return true;
		})
	) {
		return next(new ErrorHandler("Please provide all valid details"));
	}

	if (isMulti === "true") {
		const rightAnswers = updatedOptionsArr.filter(
			(option) => option.answer === "right",
		);

		if (rightAnswers.length < 2)
			return next(
				new ErrorHandler(
					"Multiple choice required atleast two right answer.",
				),
			);
	} else {
		const rightAnswers = updatedOptionsArr.filter(
			(option) => option.answer === "right",
		);

		if (rightAnswers.length !== 1)
			return next(new ErrorHandler("Provide single right answer"));
	}

	await Question.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				title,
				difficulty,
				options: updatedOptionsArr,
				standardTime,
				isMulti,
				subjects: subjectsArr,
				skills: skillsArr,
				optionsType: "image",
			},
		},
		{ new: true, runValidators: true },
	);

	res.status(200).json({
		success: true,
		message: "Question updated",
	});
});

// delete test's module's question ---- admin
exports.deleteQuestion = catchAsyncErrors(async (req, res, next) => {
	const question = await Question.findById(req.params.id);
	if (!question) return next(new ErrorHandler("Question not found", 404));

	const test = await Test.findById(question.test);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	// delete test exams
	const exams = await Exam.find({
		test: test.id,
	});

	if (exams.length > 0) {
		await Promise.all(
			exams.map(async (exam) => await Exam.findByIdAndDelete(exam._id)),
		);
	}

	const module = await Module.findOne({
		test: test.id,
		_id: question.module,
	}).populate("test");

	if (!module) return next(new ErrorHandler("Module not found", 404));

	// delete option image from cloudinary if any
	if (question.optionsType === "image") {
		await Promise.all(
			question.options.map(async (item) => {
				await cloudinary.uploader.destroy(item.option.public_id);
			}),
		);
	}

	if (question.image?.public_id) {
		await cloudinary.uploader.destroy(question.image.public_id);
	}

	await Question.findByIdAndDelete(req.params.id);

	const moduleQuestions = await Question.find({
		module: module.id,
		test: test.id,
	})
		.select("+options.answer")
		.select("+options.reason");

	res.status(200).json({
		success: true,
		message: "Question deleted successfully",
		module: {
			...module.toObject(),
			questions: moduleQuestions,
		},
	});
});

// start practice of a test
exports.startPractice = catchAsyncErrors(async (req, res, next) => {
	const test = await Test.findById(req.params.id);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	const modules = await Module.find({
		test: test.id,
	});

	const moduleWithQuestions = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				module: module._id,
				test: test._id,
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
		test: {
			...test.toObject(),
			modules: moduleWithQuestions,
		},
	});
});

// get module--admin
exports.getModule = catchAsyncErrors(async (req, res, next) => {
	const test = await Test.findById(req.params.id);

	if (!test) return next(new ErrorHandler("Test not found", 404));

	const module = await Module.findOne({
		test: test.id,
		_id: req.params.module,
	}).populate("test");

	if (!module) return next(new ErrorHandler("Module not found", 404));

	res.status(200).json({
		success: true,
		module,
	});
});

// get module with questions --admin
exports.getModuleWithQuestions = catchAsyncErrors(async (req, res, next) => {
	const test = await Test.findById(req.params.id);

	if (!test) return next(new ErrorHandler("Test not found", 404));

	const module = await Module.findOne({
		test: test.id,
		_id: req.params.module,
	}).populate("test");

	if (!module) return next(new ErrorHandler("Module not found", 404));

	const moduleQuestions = await Question.find({
		module: module.id,
		test: test.id,
	})
		.select("+options.answer")
		.select("+options.reason");

	res.status(200).json({
		success: true,
		module: {
			...module.toObject(),
			questions: moduleQuestions,
		},
	});
});

// get question details --admin
exports.getQuestionDetails = catchAsyncErrors(async (req, res, next) => {
	const test = await Test.findById(req.params.id);

	if (!test) return next(new ErrorHandler("Test not found", 404));

	const module = await Module.findOne({
		test: test.id,
		_id: req.params.module,
	});

	if (!module) return next(new ErrorHandler("Module not found", 404));

	const question = await Question.findOne({
		test: test.id,
		module: module.id,
		_id: req.params.question,
	})
		.populate("test")
		.populate("module")
		.select("+options.answer")
		.select("+options.reason");

	if (!question) return next(new ErrorHandler("Question not found", 404));

	res.status(200).json({
		success: true,
		question,
	});
});
