const express = require("express");
const router = express.Router();
const Submission = require('../../models/submission')
const Category = require('../../models/category')
const Idea = require('../../models/idea');
const { verifyToken } = require('../../middleware/verifyAuth')
const User = require('../../models/user')
const Department = require('../../models/department')
const Upload = require('../../middleware/multerUpload')



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
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { name, roles } = req.user

        const user = await User.findOne({ username: name }, '-password')

        const submissionId = req.params.id
        const categories = await Category.find()
        const ideas = await Idea.find({ userId: user._id, submissionId })

        res.render('pages/user/submission-idea-list', {
            title: 'View',
            page: 'Submission',
            submissionId,
            categories,
            ideas,
            user
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
        const { name, roles } = req.user

        const user = await User.findOne({ username: name }, '-password')
        const categories = await Category.find();
        const submissionId = req.params.id

        res.render('pages/user/submission-idea-create', {
            title: 'Create',
            page: 'Idea',
            categories,
            submissionId,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})
//--Method:Post
router.post('/:id/idea-create', verifyToken, Upload.array('files'), async(req, res) => {
    const {title, description, categoryId, content, ideaMode} = req.body
    const submissionId = req.params.id

    if(!title) return res.status(400).json({success: false, message: 'Missing text'})

    try{
        const user = await User.findOne({
            username : req.user.name
        })

        
        
        var files = []

        if(req.files != undefined){
            req.files.forEach(file => {
                const filePath = `/uploads/${file.filename}`
                files.push({filePath})
            });
        }

        const newIdea = new Idea({
            title,
            categoryId,
            description,
            content,
            userId: user._id,
            submissionId,
            files,
            isAnonymously: ideaMode
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
        const user = await User.findOne({
            username : req.user.name
        }, '-password')


        const { submissionId, ideaId }= req.params
        const categories = await Category.find();
        const idea = await Idea.findById({ _id: ideaId})

        Idea.f

        res.render('pages/user/submission-idea-edit', {
            title: 'Create',
            page: 'Idea',
            categories,
            submissionId,
            idea,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})
//--Method:Post
router.post('/:submissionId/idea-edit/:ideaId', verifyToken, async(req, res) => {
    const {title, description, categoryId, content, ideaMode} = req.body
    const {submissionId, ideaId} = req.params

    try{
        const user = await User.findOne({
            username : req.user.name
        })
        
        const editIdea = {
            title,
            categoryId,
            description,
            content,
            userId: user._id,
            submissionId,
            isAnonymously: ideaMode != null ? true: false
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