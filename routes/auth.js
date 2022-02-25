const User = require('../models/user')
const express = require("express")
const router = express.Router()
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const { loginValidation} = require("../middleware/validation")
const Role = require('../models/role')
const role = require('../models/role')



//-- Login
//-Method: Get
router.get('/login', async (req, res) => {
    try{
        res.render('pages/auth/login', {
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
        //Find user
        const user = await User.findOne({ username: req.body.username});
    
        //Check exist the user
        if (!user) return res.status(400).json({ success: false, message: 'Incorrect username or password' })
    
        //Check password
        const validPassword = await argon2.verify(user.password, req.body.password)
        if (!validPassword) return res.status(400).json({ success: false, message: 'Incorrect username or password' })
        
        //Find role
        const roles = await Role.find()

        //Create role
        let roleList = []

        user.roles.forEach(role => {
            
            for(let i = 0; roles[i] != undefined; i++){
                if(role.roleId == roles[i].id) return roleList.push(roles[i].name)
            }
        });
        //Create a token
        const accessToken = jwt.sign({name: user.username, roles: roleList}, process.env.ACCESS_TOKEN_SECRET); 
        res.cookie("token", accessToken);
        res.redirect('/admin')
        //res.header('Auth-Access-Token', accessToken).send(accessToken);
    } catch(error){
        console.log(error)
        res.status(400).json({success:false , message:'Error'}) 
    }
});

module.exports = router;