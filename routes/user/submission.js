const express = require("express");
const router = express.Router();
const Submission = require('../../models/submission')

//View profile list 
//--Method:Get
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

//View idea list (Submission details)
//--Method:Get 
router.get('/detail/:id', async (req, res) => {
    try {
        res.render('pages/user/submission-idea-list', {
            title: 'Detail',
            page: 'Submission',
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//--Create new idea
//--Method:Get 
router.get('/idea-create', async(req, res) => {
    try {
        res.render('pages/user/submission-idea-create', {
            title: 'Create',
            page: 'Idea',
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

module.exports = router;