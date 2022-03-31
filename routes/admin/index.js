const express = require("express")
const router = express.Router()
const {verifyToken, isAdmin} = require('../../middleware/verifyAuth')
const User = require('../../models/user')
//-- Login
//-Method: Post
router.get('/', verifyToken, isAdmin , async (req, res) => { 
    try{
        const user = await User.findOne({username: req.user.name}, '-password')
        res.render('pages/admin', {
            page: 'Admin',
            title: 'Dashboard',
            user
        })
    } catch(error){
        console.log(error)
        res.status(400).json({success:false , message:'Error'}) 
    }
});

module.exports = router;