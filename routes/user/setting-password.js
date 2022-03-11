const express = require("express");
const role = require("../../models/role");
const router = express.Router();
const User = require('../../models/user');
const Role = require('../../models/role');

//-- Get
router.get('/:id', async (req, res) => {
    try {
		const getUser = await User.findOne({
            _id : req.params.id
        })
        res.json(getUser)
    }catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error', error})
    }
})

//-- Post 
router.post('/:id' , async(req,res)=>{
    const {fullName, password} = req.body
    try {
        const user = await User.findById({_id: req.params.id})

        let changeUsername = {
            fullName: fullName,
        }
        res.json({success : true ,message:'change username successful' , change : changeUsername})
        
        let changePassword = {
            password: password,
        }
        if(password != undefined){
            password.forEach(password => {
                if(password == "") return
                changePassword.password.push({password})
            });
        }
        res.json({success : true ,message:'change password successful' , change : changePassword})


        //Update user to database
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, changeUsername, changePassword, {new: true})

    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})
module.exports = router;