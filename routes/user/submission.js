const express = require("express");
const router = express.Router();
const Submission = require('../../models/submission')
const Category = require('../../models/category')

//View profile list 
//--Method:Get
router.get('/' , async (req ,res) => {
    try {
        const submissions = await Submission.find();


        res.render('pages/user/submission', {
            title: 'View',
            page: 'Submission',
            submissions
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
        const categories = await Category.find();

        res.render('pages/user/submission-idea-create', {
            title: 'Create',
            page: 'Idea',
            categories
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})
//--Method:Post
router.post('/idea-create', async(req, res) => {
    try{

    } catch (err) {
        console.log(err)
        res.status(500).json({success:false , message:'Error'})
    }
})

module.exports = router;