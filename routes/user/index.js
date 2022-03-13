const express = require("express");
const router = express.Router();
const { verifyToken } = require('../../middleware/verifyAuth')
const User = require('../../models/user')
 
router.get('/', verifyToken, async (req ,res) => {
    try {
        const { name } = req.user
        
        const user = await User.findOne({ username: name })

        res.render('pages/user',{
            title: '',
            page: 'Home',
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

module.exports = router;