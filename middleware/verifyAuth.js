const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Role = require('../models/role')
const role = require('../models/role')

const verifyToken = (req, res, next) => {
    //const  accessToken = req.header('Auth-Access-Token')
    const  accessToken = req.cookies.token
    if (!accessToken) return res.status(401).send('Access Denied')

    try {
        const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).send({ message: "Invalid Token!" })
    }
}

const isAdmin = (req, res, next) => {
    try{
        for(let i = 0; req.user.roles[i] != undefined; i++){
            if(req.user.roles[i] === "Admin"){
                next()
                return;
            }
        }
        res.status(403).send({ message: "Require Admin Role!" });
        return;
    } catch (err){
        res.status(400).send({ message: "Invalid Token!", err })
    }
    
    
    
    
}

const verifyAuth = {
    verifyToken,
    isAdmin
}

module.exports = verifyAuth