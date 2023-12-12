const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler.js");
const User = require("../models/User");

// auto login using cookie
exports.loginSuccess = catchAsyncErrors((req, res, next) => {
	res.status(200).json({
		success: true,
		user: req.user,
	});
});

// logout user
exports.logout = catchAsyncErrors((req, res, next) => {
	req.logout((err) => {
		if (err) return next(new ErrorHandler("Logout failed", 400));

		res.cookie("token", null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		});

		res.status(200).json({
			success: true,
			message: "Logged Out",
		});
	});
});

// fake login to test on postman
exports.fakeLogin = catchAsyncErrors(async (req, res, next) => {
	const users = await User.find();

	const token = users[0].generateAuthToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
	};

	res.status(200).cookie("token", token, options).json({
		success: true,
		user: users[0],
	});
});

// get user details -- admin
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
	const id = req.params.id;

	const user = await User.findById(id);

	if (!user) {
		return next(new ErrorHandler("User not found", 404));
	}

	res.status(200).json({
		success: true,
		user,
	});
});

// get all users --admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		success: true,
		users,
	});
});

// change user role -- admin
exports.chageUserRole = catchAsyncErrors(async (req, res, next) => {
	const id = req.params.id;
	const role = req.body.role;

	if (id === req.user.id) {
		return next(
			new ErrorHandler("You can't change change your own role", 400),
		);
	}

	const user = await User.findById(id);
	if (!user) {
		return next(new ErrorHandler("User not found", 404));
	}

	if (role !== "user" && role !== "admin") {
		return next(
			new ErrorHandler("Only user and admin role available", 400),
		);
	}

	user.role = role;

	await user.save();
	const users = await User.find();

	res.status(200).json({
		success: true,
		users,
	});
});
