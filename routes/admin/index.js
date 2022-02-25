const express = require("express")
const router = express.Router()
const {verifyToken, isAdmin} = require('../../middleware/verifyAuth')

//-- Login
//-Method: Post
router.get('/', verifyToken, isAdmin , async (req, res) => { 

    try{
       res.render('pages/admin', {
           title: 'Admin'
       })
    } catch(error){
        console.log(error)
        res.status(400).json({success:false , message:'Error'}) 
    }
});

module.exports = router;