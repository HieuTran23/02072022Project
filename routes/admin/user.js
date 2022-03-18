const express = require("express");
const router = express.Router();
const argon2 = require("argon2")
const User = require('../../models/user')
const Role = require('../../models/role');
const Department = require('../../models/department')
const { createValidation } = require('../../middleware/validation');
const role = require("../../models/role");

// view all user 
router.get('/' , async (req ,res) => {
    try {
        const users = await User.find().populate('roles.roleId').populate('department.departmentId')

        // res.json(users)

        res.render('pages/admin/user',{
            title: "User List",
            page: "User",
            users
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//view user profile
//--Method: Get 
router.get('/profile/:id' , async (req ,res) => {
    try {
        const user = await User.findOne({
            _id :req.params.id
        })

        const roles = await Role.find()
        res.render('pages/admin/user-profile',{
            title: 'Profile',
            page: 'User',
            user,
            roles
        })
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

// create new user
//-- Method: Get 
router.get('/create', async (req, res) => {
    try {
        const roles = await Role.find();
        const departments = await Department.find();

        res.render('pages/admin/user-create', {
            title: 'Create',
            page: 'User',
            roles,
            departments
        })
    }catch (err) {
        console.log(error)
        res.status(500).json({success:false , message:'Error'})
    }
}) 
//--Method: Post 
router.post('/create' , async (req ,res) => {
    // res.json(req.body)
    const {username , password, confirmPassword, fullName, departmentId, roles, emails, phones, streets, cities, countries} = req.body
     //validation
    const { error } = createValidation({username, password, email: emails[0]})
        if (error) return res.status(400).send(error.details[0].message)
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
        
        //Department
        let department = {
            departmentId,
            isQACoordinator: false
        }

        for(let i = 0; roles[i] != undefined; i++){
            const findRole = await Role.findOne({ _id: roles[i]})

            if(findRole.name == 'QA coordinator') {
                department.isQACoordinator = true
            }

        }
        //Save user to database
        const newUser = new User ({
            username: username,
            password: hashPassword,
            fullName: fullName,
            roles: roleList,
            department,
            contact: contact
        })
        await newUser.save()
        res.redirect('/admin/user')
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})



//update or edit user 
//--Method: Get 
router.get('/edit/:id', async(req, res) => {
    try{
        const user = await User.findById({ _id: req.params.id}, '-password').populate('roles.roleId').populate('department.departmentId')
        const roles = await Role.find()
        const departments = await Department.find()

        res.render('pages/admin/user-edit', {
            title: "Edit",
            page: "User",
            user,
            roles,
            departments
        })
    } catch(error){
        console.log(error)
        res.status(500).json({success: false, message: 'Error'})
    }
})

//--Method: Post 
router.post('/edit/:id' , async(req,res)=>{
    const {fullName, roles, departmentId, emails, phones, streets, cities, countries} = req.body

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

        let department = {
            departmentId,
            isQACoordinator: false
        }

        for(let i = 0; roles[i] != undefined; i++){
            const findRole = await Role.findOne({ _id: roles[i]})

            if(findRole.name == 'QA coordinator') {
                department.isQACoordinator = true
            }

        }

        let editUser = {
            username: user.username,
            password: user.password,
            fullName: fullName,
            roles: roleList,
            department,
            contact: contact
        }

        //Update user to database
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, editUser, {new: true})


        res.redirect('/admin/user')
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})



//delete user 
router.get('/delete/:id', async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndRemove(req.params.id)

		if (!deletedUser)
			return res.status(401).json({
				success: false,
				message: 'cant not delete user'
			})

		res.redirect('/admin/user')
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Error' })
	}
})
module.exports = router;