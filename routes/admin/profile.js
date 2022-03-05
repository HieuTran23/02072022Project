const express = require("express");
const router = express.Router();
const argon2 = require("argon2")
const User = require('../../models/user')
const Role = require('../../models/role');
const Role = require('../../models/profile');



//view user profile
//--Method: Get 
router.get('/profile/:id' , async (req ,res) => {
    try {
        const user = await User.findOne({
            _id :req.params.id
        })
        const roles = await Role.find()
        res.render('pages/admin/view-profile',{
            title: 'View Profile',
            page: 'Profile',
            user,
            roles
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})


//--Method: Post 
router.post('/create' , async (req ,res) => {
    // res.json(req.body)
    const {username , password, confirmPassword, fullName, roles, emails, phones, streets, cities, countries} = req.body
     //validation
    if(!username || !password || !confirmPassword)
        return res .status(400) .json({success:false , message:'Missing text'})
    try {
        //Check password with confirm password
        if(password != confirmPassword) 
            return res.status(400).json({success:false , message:'password different confirm password'})

        //Check existing username password
        const user = await User.findOne({username})
        if(user)
            return res.status(400) .json({success:false , message:'existing username'})

        //Hash password    
        const hashPassword = await argon2.hash(password)

        //Create contact field (object)
        let contact = {
            emails: [],
            phones: [],
            addresses:[]
        }

        //Create array role list for roles field
        let roleList = [];
        // for(let i = 0; req.body.email[i] != undefined; i++){
        //     const emailHandle = { username: req.body.email[i]}
        //     contactHandle.email.push(emailHandle)
        // }
        
        //Handle roles request
        if(roles != undefined){
            roles.forEach(roleId => {
                if(roleId == "") return
                roleList.push({roleId})
            })
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
        

        //Save user to database
        const newUser = new User ({
            username: username,
            password: hashPassword,
            fullName: fullName,
            roles: roleList,
            contact: contact
        })
        await newUser.save()
        res.redirect('/admin/profile')
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})



//update or edit profile 
//--Method: Get 
router.get('/edit/:id', async(req, res) => {
    try{
        const user = await User.findById({ _id: req.params.id})
        const roles = await Role.find()
        res.render('pages/admin/profile-edit', {
            title: "Edit Profile",
            page: "Profile",
            user,
            roles
        })
    } catch(error){
        console.log(error)
        res.status(500).json({success: false, message: 'Error'})
    }
})

//--Method: Post 
router.post('/edit/:id' , async(req,res)=>{
    const {fullName, roles, emails, phones, streets, cities, countries} = req.body

     //validation
    try {
        //Create contact field (object)
        let contact = {
            emails: [],
            phones: [],
            addresses:[]
        }

        //Create array role list for roles field
        let roleList = [];
        // for(let i = 0; req.body.email[i] != undefined; i++){
        //     const emailHandle = { username: req.body.email[i]}
        //     contactHandle.email.push(emailHandle)
        // }
        
        //Handle roles request
        if(roles != undefined){
            roles.forEach(roleId => {
                if(roleId == "") return
                roleList.push({roleId})
            })
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
            username: user.username,
            password: user.password,
            fullName: fullName,
            roles: roleList,
            contact: contact
        }

        //Update user to database
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, editUser, {new: true})


        res.redirect('/admin/profile')
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})

