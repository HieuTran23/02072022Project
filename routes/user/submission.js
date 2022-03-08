const express = require("express");
const router = express.Router();
const Submission = require('../../models/submission')

//View profile list 
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

module.exports = router;