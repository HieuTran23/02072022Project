const express = require("express");
const router = express.Router();
const Submission = require('../../models/submission')
const Category = require('../../models/category')
const Idea = require('../../models/idea');
const { verifyToken } = require('../../middleware/verifyAuth')
const User = require('../../models/user')
const Department = require('../../models/department')

//View profile list 
//--Method:Get
router.get('/' , verifyToken, async (req ,res) => {
    try {
        const { name, roles } = req.user

        const user = await User.findOne({ username: name })

        const submissions = await Submission.find();

        res.render('pages/user/submission', {
            title: 'View',
            page: 'Submission',
            submissions,
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//View idea list (Submission details)
//--Method:Get 
router.get('/:id', async (req, res) => {
    try {
        const submissionId = req.params.id
        const categories = await Category.find()
        const ideas = await Idea.find()

        res.render('pages/user/submission-idea-list', {
            title: 'View',
            page: 'Submission',
            submissionId,
            categories,
            ideas
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//--Create new idea
//--Method:Get 
router.get('/:id/idea-create', verifyToken, async(req, res) => {
    try {
        const categories = await Category.find();
        const submissionId = req.params.id

        res.render('pages/user/submission-idea-create', {
            title: 'Create',
            page: 'Idea',
            categories,
            submissionId
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})
//--Method:Post
router.post('/:id/idea-create', verifyToken, async(req, res) => {
    try{
        const user = await User.findOne({
            username : req.user.name
        })

        const {title, description, categoryId, content} = req.body
        const submissionId = req.params.id
        
        
        const newIdea = new Idea({
            title,
            categoryId,
            description,
            content,
            userId: user._id,
            submissionId
        })

        await newIdea.save()
        res.redirect(`/submission/${submissionId}`)
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false , message:'Error'})
    }
})

//--Edit idea
//--Method:Get 
router.get('/:submissionId/idea-edit/:ideaId', verifyToken, async(req, res) => {
    try {
        const { submissionId, ideaId }= req.params
        const categories = await Category.find();
        const idea = await Idea.findById({ _id: ideaId})

        res.render('pages/user/submission-idea-edit', {
            title: 'Create',
            page: 'Idea',
            categories,
            submissionId,
            idea
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})
//--Method:Post
router.post('/:submissionId/idea-edit/:ideaId', verifyToken, async(req, res) => {
    try{
        const user = await User.findOne({
            username : req.user.name
        })

        const {title, description, categoryId, content} = req.body
        const {submissionId, ideaId} = req.params
        
        
        const editIdea = {
            title,
            categoryId,
            description,
            content,
            userId: user._id,
            submissionId
        }

        await Idea.findOneAndUpdate({ _id: ideaId}, editIdea)
        res.redirect(`/submission/${submissionId}`)
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false , message:'Error'})
    }
})


//--Delete idea
//--Method:Get 
router.get('/:submissionId/idea-delete/:ideaId', verifyToken, async(req, res) => {
    try {
        const { ideaId, submissionId }= req.params
        await Idea.deleteOne({ _id: ideaId})
        res.redirect(`/submission/${submissionId}`)
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//--Details idea
//--Method:Get 
router.get('/:submissionId/idea/:ideaId', verifyToken, async(req, res) => {
    try {
        const { ideaId, submissionId }= req.params

        const idea = await Idea.findById({ _id: ideaId})
        const user = await User.findById({ _id: idea.userId})
        const userDepartment = await Department.findById({ _id: user.departmentId }) 
        const ideaCategory = await Category.findById({_id: idea.categoryId})


        res.render('pages/user/submission-idea-detail', {
            title: 'Detail',
            page: 'Idea',
            idea,
            submissionId,
            user,
            userDepartment,
            ideaCategory
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

module.exports = router;