const express = require("express");
const router = express.Router();
const Submission = require('../../models/submission');
const User = require('../../models/user')
const { verifyToken, isAdmin } = require('../../middleware/verifyAuth')
const Idea = require('../../models/idea')
const path = require('path')
const AdmZip = require('adm-zip');

//get list article
router.get("/", verifyToken, isAdmin, async (req, res) => {
    try{
        const user = await User.findOne({username: req.user.name}, '-password')

        const submissions = await Submission.find({})
        res.render('pages/admin/submission', {
            title: 'List',
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
            title: 'Create',
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
            title: 'Edit',
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

//Submission Detail
//--Method Get:
router.get('/detail/:id', verifyToken, isAdmin, async (req ,res) => {
    const submissionId = req.params.id

    if(!submissionId) res.status(400).res.json({success: fail, message: 'Error'})

    try {
        const user = await User.findOne({username: req.user.name}, '-password')

        const ideas = await Idea.find({submissionId: submissionId}).populate({
            path: 'userId', 
            select: ['department', 'username', 'fullName'],
            populate: {
                path: 'department.departmentId'
            }
        }).populate('categoryId').populate('submissionId')
        
        res.render('pages/admin/submission-detail' ,{
            title: 'View Idea List',
            page: 'Submission',
            ideas,
            user,
            submissionId
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//Submission Down
//--Method: Get
router.get('/download/:id', verifyToken, isAdmin, async (req ,res) => { 
    const submissionId = req.params.id

    if(!submissionId) return res.status(400).res.json({success: fail, message: 'Error'})
    var fs = require('fs'); 

    try {
        var uploadDir = fs.readdirSync(path.join(__dirname, `../../public/uploads`, submissionId));
        
        const zip = new AdmZip();

        for(var i = 0; i < uploadDir.length;i++){
            zip.addLocalFile(path.join(__dirname, `../../public/uploads`, submissionId, uploadDir[i]));
        }
    
        // Define zip file name
        const downloadName = `${Date.now()}.zip`;

        const data = zip.toBuffer();

        // save file zip in root directory
        zip.writeZip(path.join(__dirname, `../../public/uploads`, submissionId)+"/"+downloadName);

        res.set('Content-Type','application/octet-stream');
        res.set('Content-Disposition',`attachment; filename=${downloadName}`);
        res.set('Content-Length',data.length);
        res.send(data)

        fs.unlinkSync(path.join(__dirname, `../../public/uploads`, submissionId)+"/"+downloadName);
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

module.exports = router;