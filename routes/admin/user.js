const express = require("express");
const router = express.Router();
const argon2 = require("argon2")
const User = require('../../models/user')


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
router.post('/create' , async (req ,res) => {
    const {username , password, fullName, email, phone, street, city, country} = req.body
     //validation
    if(!username || !password || !email)
        return res .status(400) .json({success:false , message:'Missing username and/or password and/or email '})
    try {
        //Check existing username password or email
        const user = await User.findOne({username , password})
        if(user)
        return res.status(400) .json({success:false , message:'existing username password or email'})
    } catch (error) { 
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    } 
    const hashPassword = await argon2.hash(password)

    
    const phoneHandle = { mobile: phone}
    const addressHandle = { street: street,
                            city: city,
                            country: country}

    //create contact field
    let contactHandle = {
        email: [],
        phone: [],
        address:[]
    }
    // for(let i = 0; req.body.email[i] != undefined; i++){
    //     const emailHandle = { username: req.body.email[i]}
    //     contactHandle.email.push(emailHandle)
    // }
    req.body.email.forEach(username => {
        const emailHandle = {username}
        contactHandle.email.push(emailHandle)
    });

    contactHandle.phone.push(phoneHandle)
    contactHandle.address.push(addressHandle)

    //create new User        
    try {
        const newUser = new User ({
            username: username,
            password: hashPassword,
            fullName: fullName,
            contact: contactHandle
        })
        await newUser.save()
        res.json({success:true , message:'create success' , user : newUser})
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
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