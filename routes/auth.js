const Account = require('../models/account')
const express = require("express")
const router = express.Router()
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const { loginValidation} = require("../middleware/validation")


//-- Login
//-Method: Get
router.get('/login', async (req, res) => {
    try{
        res.render('pages/login', {
            title: 'Login'
        })
    } catch (err) {
        res.json(err)
    }
})

//-Method: Post
router.post('/login', async (req, res) => { 
    //Validation
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    try{
        //Find account
        const account = await Account.findOne({ username: req.body.username});
    
        //Check exist the account
        if (!account) return res.status(400).json({ success: false, message: 'Incorrect username or password' })
    
        //Check password
        const validPassword = await argon2.verify(account.password, req.body.password)
        if (!validPassword) return res.status(400).json({ success: false, message: 'Incorrect username or password' })
    
        //Create a token
        const accessToken = jwt.sign({_id: account._id}, process.env.ACCESS_TOKEN_SECRET); 
        res.cookie("token", accessToken);
        res.redirect('/admin')
        //res.header('Auth-Access-Token', accessToken).send(accessToken);
    } catch(error){
        console.log(error)
        res.status(400).json({success:false , message:'Error'}) 
    }
});

module.exports = router;