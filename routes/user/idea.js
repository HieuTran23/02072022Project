const express = require('express')
const router = express.Router()
const Idea = require('../../models/idea')
const User = require('../../models/user')
const { verifyToken } = require('../../middleware/verifyAuth')
const Comment = require('../../models/comment')
const Reaction = require('../../models/reaction')
const ideaAnonymous = require('../../models/ideaAnonymous')
const { sendMail } = require('../../utils/mailer')

//List idea
//--Method:Get 
router.get('/', verifyToken ,async (req, res) => {
    try{
        const ideas = await Idea.find().populate('userId', ['fullName', '_id']).populate('submissionId')

        const { name } = req.user
        const user = await User.findOne({ username: name})
        
        const ideaList = ideaAnonymous.arrayFilter(ideas)

        res.render('pages/user/idea', {
            title: 'List',
            page: 'Idea',
            ideas: ideaList,
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
        const idea = await Idea.findById(req.params.id).populate({
            path: 'userId',
            select: ['username', 'fullName'],
            populate: {
                path: 'department.departmentId'
            }
        }).populate('categoryId').populate({
            path: 'comments.commentId',
            populate: {
                path: 'userId',
                select: ['username', 'fullName']
            }
        }).populate({
            path: 'reactions.reactionId'
        })
        // res.json(idea)

        const ideaFilter = ideaAnonymous.singleFilter(idea)

        // res.json(ideaFilter)
        res.render('pages/user/idea-detail', {
            title: 'View',
            page: 'Idea',
            user,
            idea: ideaFilter
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false, message: "Error"})
    }
} )


//--Idea comment
//--Method:post 
router.post('/:ideaId/comment',verifyToken, async (req, res) =>{
    const {ideaId} = req.params
    const {content} = req.body

    if(!content) res.status(400).json({success: false, message: 'Missing test'})

    try {
        

        const user = await User.findOne({
            username: req.user.name
        })

        const idea = await Idea.findById(ideaId).populate('userId', '-password').populate('submissionId')
        if(Number(idea.submissionId.finalClosureDate) < Date.now()) return res.status(400).json({success: false, message: 'Submission Comment Close'})
        
        const comment = new Comment({
            content,
            userId :user._id
        })

        await comment.save() 

        await idea.update({
            $push: {comments : {commentId: comment._id}}
        })

        //Send email

        if(idea.userId.contact.emails[0].email){
            const mail = {
                to: idea.userId.contact.emails[0].email,
                subject: `New comment in your idea(${idea.title}) in submission(${idea.submissionId.name})`,
                text: `${user.username} + ${user.contact.emails[0].email} send comment is ${comment.content}`
            }
            await sendMail(mail)
        }

        res.redirect(`/idea/${ideaId}`)
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error'})
    }
})

//--Idea reaction
//--Method: post 
router.post('/:ideaId/reaction', verifyToken, async(req, res) => {
    try {
        const ideaId = req.params.ideaId

        const user = await User.findOne({
            username: req.user.name
        })

        

        const idea = await Idea.findById(ideaId).populate({
            path: 'reactions.reactionId'
        })

        let result = false
        let i = 0;
        for(i; idea.reactions[i] != undefined; i++){
            if(idea.reactions[i].reactionId.userId.toString() == user._id.toString()){
                result = true;
                break;
            }
        }

        if(result == true) {
            const reactionId = idea.reactions[i].reactionId._id

            const update = await Idea.findByIdAndUpdate(ideaId, {
                $pull: {reactions: {reactionId: reactionId}}
            })

            await Reaction.findByIdAndRemove(reactionId)

            const findIdea = await Idea.findById(ideaId).populate({
                path: 'reactions.reactionId',
                match: { userId: user._id }
            })

            res.json({idea: findIdea})
        }
        else{
            const reaction = new Reaction({
                reactionType: 1,
                userId: user._id
            })

            await reaction.save()

            const update = await Idea.findByIdAndUpdate(ideaId, {
                $push: {reactions: {reactionId: reaction._id}}
            })

            const findIdea = await Idea.findById(ideaId).populate({
                path: 'reactions.reactionId'
            })

            res.json({idea: findIdea})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false , message:'Error'})
    }
})

module.exports = router