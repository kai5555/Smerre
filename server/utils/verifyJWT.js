const jwt = require("jsonwebtoken")

function verifyJWT(req, res, next) {
    // removes 'Bearer` from token
    const token = req.body.token?.split(' ')[1]

    if(token){
        jwt.verify(token, process.env.PASSWORDSECRET, (err, decoded) => {
            if (err){
                console.log("Error with verifyJWT: "+err);
                return res.json({isLoggedIn: false, message: "Failed To Authenticate"})
            }
            req.user = {};
            req.user.username = decoded.username
            next()
        })
    } else {
        res.json({message: "Incorrect Token Given", isLoggedIn: false})
    }
}

module.exports = verifyJWT;