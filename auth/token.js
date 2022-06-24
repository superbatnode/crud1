const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = require("../config");
const access_token = async(payload, expiry=60*60) => {
    const key = await jwt.sign(payload, TOKEN_KEY,{expiresIn:expiry});
    return key;
}
const refresh_token = async(payload) => {
    const key = await jwt.sign(payload, TOKEN_KEY,{expiresIn:60});
    return key;
}
const check_token = async(token)=>{
        return await jwt.verify(token, TOKEN_KEY);   
}
module.exports = {
    access_token,
    check_token
};
