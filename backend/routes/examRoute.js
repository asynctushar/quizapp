const express = require("express");
const {
	startExam,
	getModules,
	getTests,
	completeModule,
	skipModuleBreak,
	finishModuleBreak,
	completeExam,
	getExamDetails,
	getOwnAllExams,
	getUserAllExams,
	getUserExamDetails,
} = require("../controllers/examController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");

const router = express.Router();

// routes
router.route("/exam/test/:id/start").get(isAuthenticatedUser, startExam);
router.route("/tests").get(isAuthenticatedUser, getTests);
router.route("/test/:id/modules").get(isAuthenticatedUser, getModules);
router
	.route("/exam/:id/:module/submit")
	.put(isAuthenticatedUser, completeModule);
router.route("/exam/:id/break/skip").get(isAuthenticatedUser, skipModuleBreak);
router
	.route("/exam/:id/break/finish")
	.get(isAuthenticatedUser, finishModuleBreak);
router.route("/exam/:id/complete").get(isAuthenticatedUser, completeExam);
router.route("/exam/:id").get(isAuthenticatedUser, getUserExamDetails);
router
	.route("/admin/exam/:id")
	.get(isAuthenticatedUser, authorizedRole("admin"), getExamDetails);
router.route("/me/exams").get(isAuthenticatedUser, getOwnAllExams);
router
	.route("/admin/exams")
	.get(isAuthenticatedUser, authorizedRole("admin"), getUserAllExams);

module.exports = router;
