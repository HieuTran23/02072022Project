const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const  accessToken = req.header('Auth-Access-Token')
    if (!accessToken) return res.status(401).send('Access Denied')

    try {
        const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).send('Invalid Token')
    }
}

module.exports = verifyToken