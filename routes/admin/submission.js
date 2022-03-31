const express = require("express");
const router = express.Router();
const Submission = require('../../models/submission');
const User = require('../../models/user')
const { verifyToken, isAdmin } = require('../../middleware/verifyAuth')


//get list article
router.get("/", verifyToken, isAdmin, async (req, res) => {
    try{
        const user = await User.findOne({username: req.user.name}, '-password')

        const submissions = await Submission.find({})
        res.render('pages/admin/submission', {
            title: 'Submission List',
            page: 'Submission',
            submissions,
            user
        })
    }
    catch(err) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//add new  submission
//get
router.get('/create', verifyToken, isAdmin, async (req, res) => {
    try{
        const user = await User.findOne({username: req.user.name}, '-password')

        res.render('pages/admin/submission-create', {
            title: 'Create Submission',
            page: 'Submission',
            user
        })
    }
    catch(error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})
router.post('/create', verifyToken, isAdmin,  async (req, res) => {
    const {name , description , closureDate , finalClosureDate} = req.body

    //validation
    if(!name || !closureDate || !finalClosureDate)
        return res.status(400).json({success:false , message:'Missing submission text'})
    try {
        const submissionExisting = await Submission.findOne({name})
        if(submissionExisting)
            return res.status(400).json({success:false , message:'Existing submission title'})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    }
    try {
        const newSubmission = new Submission({
            name  ,
            description ,
            closureDate ,
            finalClosureDate
        })
        await newSubmission.save()
        res.redirect('/admin/submission')
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    }
})
//edit submission
router.get('/edit/:id', verifyToken, isAdmin, async(req , res) =>{
    try {
        const user = await User.findOne({username: req.user.name}, '-password')

        const submission = await Submission.findOne({
            _id : req.params.id
        })

        res.render('pages/admin/submission-edit',{
            title: 'Edit Submission',
            page: 'Submission' ,
            submission,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})
router.post('/edit/:id', verifyToken, isAdmin, async(req, res)=>{
     //validation
    const {submissionTitle , submissionDescription, closureDate, finalClosureDate} = req.body
    
    
    if(!submissionTitle)
        return res.status(400).json({success:false , message:'Missing submission title'})
    try {
        let editSubmission ={ 
            submissionTitle : submissionTitle || '' ,
            submissionDescription : submissionDescription || '',
            closureDate ,
            finalClosureDate
        }
        const editedSubmission = await Submission.findOneAndUpdate(
            {_id : req.params.id} ,
            editSubmission ,
            {new : true}
        )
        if(!editedSubmission)
            return res.status(401).json({success:false , message : 'cant not edit submission'})
        res.redirect('/admin/submission')
    } catch (error) {
        console.log(error)
            res.status(500) .json({success:false , message:'Error'}) 
    }

})

//delete submission
router.get('/delete/:id', verifyToken, isAdmin, async ( req,res) => {
    try {
        const submission = {_id: req.params.id}
        const deleteSub = await Submission.findByIdAndRemove(submission._id)
        if(!deleteSub)
        return res.status(401).json({success:false , message : 'cant not delete submission'})
        res.redirect('/admin/submission')
    } catch (error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Error', error })
    }
})
module.exports = router;