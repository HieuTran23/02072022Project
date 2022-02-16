const express = require("express")
const router = express.Router()
const verify = require('../middleware/verifyAuth')
const posts = [
    {
        title: 'first post',
        description: 'first description'
    },
    {
        title: 'second post',
        description: 'second description'
    }
]

//-- Login
//-Method: Post
router.get('/', verify ,async (req, res) => { 

    try{
       res.json(posts)
    } catch(error){
        console.log(error)
        res.status(400).json({success:false , message:'Error'}) 
    }
});

module.exports = router;