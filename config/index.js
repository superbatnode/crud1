const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    PORT:process.env.PORT,
    DBURL:process.env.DBURL,
    TOKEN_KEY:process.env.JWT_KEY,
    cloud_name:process.env.CLOUD_NAME, 
    api_key:process.env.API_KEY, 
    api_secret:process.env.API_SECRET
}
