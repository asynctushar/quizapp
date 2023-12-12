const express = require("express");
const {
	createTest,
	createModule,
	createImageQuestion,
	createStringQuestion,
	deleteQuestion,
	startPractice,
	getModule,
	getModuleWithQuestions,
	getQuestionDetails,
	updateTest,
	deleteTest,
	updateModule,
	deleteModule,
	uploadQuestionImage,
	updateStringQuestion,
	updateImageQuestion,
} = require("../controllers/questionController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");
const imageUpload = require("../middlewares/imageUpload");

const router = express.Router();

// routes
router.post(
	"/test/new",
	isAuthenticatedUser,
	authorizedRole("admin"),
	createTest,
);
router.post(
	"/test/:id/module/new",
	isAuthenticatedUser,
	authorizedRole("admin"),
	createModule,
);
router.post(
	"/test/:id/module/:module/question/image/new",
	isAuthenticatedUser,
	authorizedRole("admin"),
	imageUpload.multiple("images"),
	createImageQuestion,
);
router.post(
	"/test/:id/module/:module/question/string/new",
	isAuthenticatedUser,
	authorizedRole("admin"),
	createStringQuestion,
);
router.post(
	"/test/:id/module/:module/question/:id/string/update",
	isAuthenticatedUser,
	authorizedRole("admin"),
	updateStringQuestion,
);
router.post(
	"/test/:id/module/:module/question/:id/image/update",
	isAuthenticatedUser,
	authorizedRole("admin"),
	imageUpload.multiple("images"),
	updateImageQuestion,
);
router
	.route("/question/:id")
	.delete(isAuthenticatedUser, authorizedRole("admin"), deleteQuestion)
	.put(
		isAuthenticatedUser,
		authorizedRole("admin"),
		imageUpload.single("question"),
		uploadQuestionImage,
	);

router.get("/practice/test/:id", isAuthenticatedUser, startPractice);
router.get(
	"/test/:id/module/:module",
	isAuthenticatedUser,
	authorizedRole("admin"),
	getModule,
);
router.get(
	"/test/:id/module/:module/questions",
	isAuthenticatedUser,
	authorizedRole("admin"),
	getModuleWithQuestions,
);
router.get(
	"/test/:id/module/:module/question/:question",
	isAuthenticatedUser,
	authorizedRole("admin"),
	getQuestionDetails,
);
router
	.route("/test/:id")
	.put(isAuthenticatedUser, authorizedRole("admin"), updateTest)
	.delete(isAuthenticatedUser, authorizedRole("admin"), deleteTest);
router
	.route("/module/:id")
	.put(isAuthenticatedUser, authorizedRole("admin"), updateModule)
	.delete(isAuthenticatedUser, authorizedRole("admin"), deleteModule);

module.exports = router;
