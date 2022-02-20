const express = require("express")
const router = express.Router()
const verify = require('../../middleware/verifyAuth')

//-- Login
//-Method: Post
router.get('/', verify , async (req, res) => { 
    try{
       res.render('admin', {
           title: 'Admin'
       })
    } catch(error){
        console.log(error)
        res.status(400).json({success:false , message:'Error'}) 
    }
});

module.exports = router;