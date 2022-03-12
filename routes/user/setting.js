const express = require("express");

const router = express.Router();

const User = require('../../models/user')
const Role = require('../../models/role');
const Department = require('../../models/department')

//Edit and update user
//-- get
router.get('/:id', async (req, res) => {
    try {
		const user = await User.findById({ _id: req.params.id})
        const roles = await Role.find()
        const departments = await Department.find()
        res.render('pages/user/setting', {
            title: "Edit",
            page: "User",
            user,
            roles,
            departments
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error', error})
    }
})

//-- Post 
router.post('/:id' , async(req,res)=>{
    const {fullName, departmentId,emails, phones, streets, cities, countries} = req.body
     //validation
    try {
        //Create contact field (object)
        let contact = {
            emails: [],
            phones: [],
            addresses:[]
        }
        
        //Handle contact request
        if(emails != undefined){
            emails.forEach(email => {
                if(email == "") return
                contact.emails.push({email})
            });
        }
        if(phones != undefined){
            phones.forEach(phone => {
                if(phone == "") return
                contact.phones.push({phone})
            });
        }
        if(streets || cities || countries){
            for(let i = 0; streets[i] != undefined; i++){
                if(streets[i] == "" && cities[i] == "" && countries[i] == "") continue
                const addressHandle = { street: streets[i],
                                        city: cities[i],
                                        country: countries[i]
                                    }
                contact.addresses.push(addressHandle)
            }
        }
        const user = await User.findById({_id: req.params.id})

        let editUser = {
            fullName: fullName,
            contact: contact,
            departmentId
        }
        
        //Update user to database
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, editUser, {new: true})
        var id= req.params.id;
        res.redirect('/setting/'+ id)

        
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})

//-- Get
router.get('/setting-password/:id', async (req, res) => {
    try {
		const getUser = await User.findOne({_id : req.params.id})
        const roles = await Role.find()
        res.render('pages/user/setting/setting-password', {
            title: "Edit-Password"
        })   
    }catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error', error})
    }
})

//-- Post 
router.post('/setting-password/:id' , async(req,res)=>{
    const { password} = req.body
    try {
        const user = await User.findById({_id: req.params.id})
        
        let changePassword = {
            password: password ,
        }
        if(password != undefined){
            password.forEach(password => {
                if(password == "") return
                changePassword.password.push({password})
            });
        }
        res.json({success : true ,message:'change password successful' , change : changePassword})


        //Update user to database
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, changePassword, {new: true})
        var id= req.params.id;
        res.redirect('/setting/setting-password'+ id)

    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})

module.exports = router;