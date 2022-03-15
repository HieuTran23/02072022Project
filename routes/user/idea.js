const express = require('express')
const router = express.Router()
const Idea = require('../../models/idea')
const User = require('../../models/user')
const { verifyToken } = require('../../middleware/verifyAuth')
const Comment = require('../../models/comment')


//List idea
//--Method:Get 
router.get('/', verifyToken ,async (req, res) => {
    try{
        const ideas = await Idea.find().populate('userId', 'fullName').populate('submissionId')

        const { name } = req.user
        const user = await User.findOne({ username: name})
        
        res.render('pages/user/idea', {
            title: 'List',
            page: 'Idea',
            ideas,
            user
        })
    } catch(err) {
        console.log(err)
        res.status(400).json({success: false, message: 'Error'})
    }
})

//Idea detail
//--Method:get 
router.get('/:id', verifyToken, async (req, res) => {
    try{ 
        const { name } = req.user
        const user = await User.findOne({ username: name})
        const comments = await Comment.find({})
        const idea = await Idea.findById(req.params.id).populate({
            path: 'userId',
            populate: {
                path: 'departmentId'
            }
        }).populate('categoryId').populate({
            path: 'comments',
            populate: {
                path: 'userId'
            }
        })
        // res.json(idea)
        res.render('pages/user/idea-detail', {
            title: 'View',
            page: 'Idea',
            user,
            idea
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false, message: "Error"})
    }
} )



router.post('/:ideaID/comment',verifyToken, async (req, res) =>{
    try {
        const {ideaID} = req.params

        const user = await User.findOne({
            username: req.user.name
        })
        const {content} = req.body
        const comment = new Comment({
            content,
            userId :user._id,
            user,
        })
        await comment.save() 
        await Idea.findById(ideaID , {
            push: {comments : comment._id}
        })
        res.redirect(`/idea/${ideaID}`)
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error'})
    }
})

module.exports = router