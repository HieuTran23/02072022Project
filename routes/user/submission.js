const express = require("express");
const router = express.Router();
const Submission = require('../../models/submission')

//View profile list 
router.get('/' , async (req ,res) => {
    try {
        const user = await Submission.findOne({
            _id :req.params.id
        })
        const roles = await Role.find()
        const departments = await Department.find()

        res.render('pages/user/profile',{
            title: 'Profile',
            page: 'User',
            user,
            roles,
            departments
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

module.exports = router;