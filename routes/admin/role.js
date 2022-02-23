const express = require("express");
const router = express.Router();
const Role = require('../../models/role')

//view all role 
router.get('/' , async (req ,res) => {
    try {
        const roles = await Role.find({})
        res.render('pages/admin/role' ,{success :true , roles})
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//view role details
router.get('/detail/:id' , async (req ,res) => {
    try {
        const roleDetails = await Role.find({
            _id :req.params.id
        })
        res.json({success :true , roleDetails})
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//create new role
//--Method: Get 
router.get('/create', async (req, res) => {
    try {
        res.render('pages/admin/role-create', {
            title: 'Create'
        })
    }catch (err) {
        console.log(error)
        res.status(500).json({success:false , message:'Error'})
    }
})

//--Method: Post 
router.post('/create' , async (req ,res) => {
    const {name, description} = req.body
     //validation
    if(!name)
        return res.status(400).json({success:false , message:'Missing role name'})
    try {
        //Check existing role
        const role = await Role.findOne({name})
        if(role)
        return res.status(400).json({success:false , message:'existing role'})
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
    //create new role        
    try {
        const newRole = new Role ({
            name,
            description
        })
        await newRole.save()
        res.json({success:true , message:'create success' , role : newRole})
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})



//update or edit role 
router.put('/edit/:id' , async(req,res)=>{
    const {username , password , email} = req.body
    //validation
    if(!username || !password || !email)
        return res.status(400).json({success:false , message:'kekeke'})
        const hashPassword = await argon2.hash(password)
        //edit or upate account
        try {
            let editedAccount = {
                username : username || '' ,
                password : hashPassword || '' ,
                email : email || ''

            }
            const editcondition = {_id : req.params.id}
            editedAccount = await Account.findOneAndUpdate(
                editcondition ,
                editedAccount,
                {new:true}
            )
            if (!editcondition){
                return res.status(401).json({success:false , message : 'cant not edit account'})
            }
            res.json({success : true ,message:'edit successful' , account : editedAccount})
        
        } catch (error) {
            console.log(error)
                res.status(500) .json({success:false , message:'Error'}) 
        }
})



//delete account 
router.delete('/delete/:id', async (req, res) => {
	try {
		const accountdeletecondition = { _id: req.params.id }
		const deletedAccount = await Account.findOneAndDelete(accountdeletecondition)

		if (!deletedAccount)
			return res.status(401).json({
				success: false,
				message: 'cant not delete account'
			})

		res.json({ success: true, account: deletedAccount })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Error' })
	}
})
module.exports = router;