const express = require("express");
const router = express.Router();
const Idea = require('../../models/idea')

//view all idea 
//--Method: Get 
router.get('/' , async (req ,res) => {
    try {
        const ideas = await Idea.find().populate({
            path: 'userId', 
            select: ['department', 'username', 'fullName'],
            populate: {
                path: 'department.departmentId'
            }
        }).populate('categoryId').populate('submissionId')
        
        res.render('pages/admin/idea' ,{
            title: 'View List',
            page: 'Idea',
            ideas,
            categories
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//delete idea 
//--Method: Get
router.get('/delete/:id', async (req, res) => {
	try {
		const deletedIdea = await Idea.findByIdAndRemove(req.params.id)

		if (!deletedIdea)
			return res.status(401).json({
				success: false,
				message: 'cant not delete account'
			})

		res.redirect('/admin/idea')
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Error', error })
	}
})

//detail idea
//--Method: Get 
router.get('/detail/:id', async (req, res) => {
    const ideaId = req.params.id

    try {
        const idea = await Idea.findById(ideaId).populate({
            path: 'userId',
            select: '-password',
            populate: 'department.departmentId',
            populate: 'roles.roleId'
        }).populate({
            path: 'comments.commentId',
            populate: {
                path: 'userId',
                select: '-password'
            }
        })

        // res.json(idea)
		res.render('pages/admin/idea-detail', {
            idea
        })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Error', error })
	}
})

module.exports = router;