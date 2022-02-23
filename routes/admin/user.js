const express = require("express");
const router = express.Router();
const argon2 = require("argon2")
const User = require('../../models/user')
const Role = require('../../models/role')


// view all user 
router.get('/' , async (req ,res) => {
    try {
        const users = await User.find({})
        res.json({success :true , users})
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//view account details
// router.get('/detail/:id' , async (req ,res) => {
//     try {
//         const accountDetails = await Account.find({
//             _id :req.params.id
//         })
//         res.json({success :true , accountDetails})
//     } catch (error) {
//         console.log(error)
//         res.status(500) .json({success:false , message:'Error'}) 
//     }
// })

// create new user
//-- MethodL Get 
router.get('/create', async (req, res) => {
    try {
        const roles = await Role.find();
        res.render('pages/admin/user-create', {
            title: 'Create',
            page: 'User',
            roles
        })
    }catch (err) {
        console.log(error)
        res.status(500).json({success:false , message:'Error'})
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
                roleList.push({roleId})
            })
        }
        
        //Handle contact request
        if(emails != undefined){
            emails.forEach(email => {
                contact.emails.push({email})
            });
        }
        if(phones != undefined){
            phones.forEach(phone => {
                contact.phones.push({phone})
            });
        }
        if(streets || cities || countries)
        for(let i = 0; streets[i] != undefined; i++){
            const addressHandle = { street: streets[i],
                                    city: cities[i],
                                    country: countries[i]
                                }
            contact.addresses.push(addressHandle)
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
        res.redirect('admin/user')
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})



//upate or edit account 
// router.put('/edit/:id' , async(req,res)=>{
//     const {username , password , email} = req.body
//     //validation
//     if(!username || !password || !email)
//         return res.status(400).json({success:false , message:'kekeke'})
//         const hashPassword = await argon2.hash(password)
//         //edit or upate account
//         try {
//             let editedAccount = {
//                 username : username || '' ,
//                 password : hashPassword || '' ,
//                 email : email || ''

//             }
//             const editcondition = {_id : req.params.id}
//             editedAccount = await Account.findOneAndUpdate(
//                 editcondition ,
//                 editedAccount,
//                 {new:true}
//             )
//             if (!editcondition){
//                 return res.status(401).json({success:false , message : 'cant not edit account'})
//             }
//             res.json({success : true ,message:'edit successful' , account : editedAccount})
        
//         } catch (error) {
//             console.log(error)
//                 res.status(500) .json({success:false , message:'Error'}) 
//         }
// })



//delete account 
// router.delete('/delete/:id', async (req, res) => {
// 	try {
// 		const accountdeletecondition = { _id: req.params.id }
// 		const deletedAccount = await Account.findOneAndDelete(accountdeletecondition)

// 		if (!deletedAccount)
// 			return res.status(401).json({
// 				success: false,
// 				message: 'cant not delete account'
// 			})

// 		res.json({ success: true, account: deletedAccount })
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).json({ success: false, message: 'Error' })
// 	}
// })
module.exports = router;