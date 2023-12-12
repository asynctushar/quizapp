const mongoose = require("mongoose"); 

const databaseConnect = async () => {
	try {
		mongoose.set("bufferTimeoutMS", 100000);
		mongoose.set("strictQuery", false);
		await mongoose
			.connect(process.env.DB_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				autoIndex: true,
			})
			.then((data) => {
				console.log(`Database connected to ${data.connection.host}`);
			});
	} catch (error) {
		console.log(error);
		return null;
	}
};

module.exports = databaseConnect;
