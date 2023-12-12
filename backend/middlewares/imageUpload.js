const multer = require("multer");
const ErrorHandler = require("../utils/errorHandler");
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 3000000,
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			cb(new ErrorHandler("Please upload image file.", 400), false);
		}
	},
});

module.exports = {
	multiple: (imageType) => upload.array(imageType, 4),
	single: (imageType) => upload.single(imageType),
};
