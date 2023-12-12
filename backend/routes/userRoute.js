const express = require("express");
const passport = require("passport");
const {
	loginSuccess,
	logout,
	fakeLogin,
	getAllUsers,
	getUserDetails,
	chageUserRole,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");

const router = express.Router();

// routes
router.get("/auth/google", passport.authenticate("google"));
router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: process.env.FRONTEND_URL
			? process.env.FRONTEND_URL
			: "/",
	}),
	(req, res) => {
		const options = {
			expires: new Date(
				Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
			),
			httpOnly: true,
		};
		res.cookie("token", req.user, options);
		res.redirect(process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "/");
	},
);

router.get(
	"/auth/facebook",
	passport.authenticate("facebook", {
		scope: ["email"],
	}),
);
router.get(
	"/auth/facebook/callback",
	passport.authenticate("facebook", {
		failureRedirect: process.env.FRONTEND_URL
			? process.env.FRONTEND_URL
			: "/",
	}),
	(req, res) => {
		const options = {
			expires: new Date(
				Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
			),
			httpOnly: true,
		};
		res.cookie("token", req.user, options);
		res.redirect(process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "/");
	},
);

router.get("/login/fake", fakeLogin);
router.get("/login/success", isAuthenticatedUser, loginSuccess);
router.get("/logout", logout);
router
	.route("/admin/user/:id")
	.get(isAuthenticatedUser, authorizedRole("admin"), getUserDetails)
	.put(isAuthenticatedUser, authorizedRole("admin"), chageUserRole);
router
	.route("/admin/users")
	.get(isAuthenticatedUser, authorizedRole("admin"), getAllUsers);

module.exports = router;
