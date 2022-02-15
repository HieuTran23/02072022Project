const Account = require('../models/account')
const express = require("express");
const router = express.Router();
const argon2 = require("argon2")
const { loginValidation} = require("../middleware/validation")


//-- Login
//-Method: Post
router.post('/login', async (req, res) => { 
    //Validation
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const account = await Account.findOne({ username: req.body.username});
    if (!account) return res.status(400).json({ success: false, message: 'Incorrect username or password' })

    const validPassword = await argon2.verify(account.password, req.body.password)
    if (!validPassword) return res.status(400).json({ success: false, message: 'Incorrect username or password' })

    res.json({ success: true, message: 'Logged in' })
});

module.exports = router;