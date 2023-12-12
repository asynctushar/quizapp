const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require("passport");
const User = require("../models/User");

const passportConnect = () => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: process.env.CALLBACK_URL,
				scope: ["profile", "email"],
			},
			async (accessToken, refreshToken, profile, cb) => {
				try {
					let user = null;
					const isUserExist = await User.findOne({
						googleId: profile.id,
						provider: profile.provider
					});

					if (!isUserExist) {
						user = await User.create({
							email: profile._json.email,
							name: profile.displayName,
							googleId: profile.id,
							provider: profile.provider
						});
					} else {
						user = isUserExist;
					}

				    const token = user.generateAuthToken();
					cb(null, token);
				} catch (err) {
					cb(err, false);
				}
			}
		)
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_APP_ID,
    			clientSecret: process.env.FACEBOOK_APP_SECRET,
				callbackURL: process.env.FACEBOOK_CALLBACK_URL,
				profileFields: ['email', 'displayName'],
			},
			async (accessToken, refreshToken, profile, cb) => {
				try {
					let user = null;
					const isUserExist = await User.findOne({
						facebookId: profile.id,
						provider: profile.provider
					});

					if (!isUserExist) {
						user = await User.create({
							email: profile._json.email,
							name: profile.displayName,
							facebookId: profile.id,
							provider: profile.provider
						});
					} else {
						user = isUserExist;
					}

				    const token = user.generateAuthToken();
					cb(null, token);
				} catch (err) {
					return cb(err, true);
				}
			}
		)
	);

	passport.serializeUser(function (token, done) {
		done(null, token);
	});

	passport.deserializeUser(function (token, done) {
		done(null, token);
	});
};

module.exports = passportConnect;