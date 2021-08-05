const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  mongoURI: `mongodb+srv://don:${process.env.MONGODB_PASSWORD}@dondon.pln33.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
};
