const express = require('express')
const router = express.Router()
const Idea = require('../../models/idea')
const User = require('../../models/user')
const { verifyToken } = require('../../middleware/verifyAuth')
const category = require('../../models/category')

//List idea
//--Method:Get 
router.get('/', verifyToken ,async (req, res) => {
    try{
        const ideas = await Idea.find().populate('userId', 'fullName')

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
        
        const idea = await Idea.findById(req.params.id).populate({
            path: 'userId',
            populate: {
                path: 'departmentId'
            }
        }).populate('categoryId')


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


module.exports = router