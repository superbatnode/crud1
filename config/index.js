const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    PORT:process.env.PORT,
    DBURL:process.env.DBURL,
    TOKEN_KEY:process.env.JWT_KEY
}
