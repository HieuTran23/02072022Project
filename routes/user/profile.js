const express = require("express");
const router = express.Router();
const User = require('../../models/user');
const Role = require('../../models/role');
const Department = require('../../models/department')

//View profile list 
router.get('/:id' , async (req ,res) => {
    try {
        const user = await User.findOne({
            _id :req.params.id
        })
        const roles = await Role.find()
        const departments = await Department.find()

        res.render('pages/user/profile',{
            title: 'Profile',
            page: 'User',
            user,
            roles,
            departments
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

module.exports = router;