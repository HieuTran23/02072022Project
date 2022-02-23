const express = require("express");
const router = express.Router();
const Role = require('../../models/role')
const ObjectId = require('mongodb').ObjectID

//view all role 
//--Method: Get 
router.get('/' , async (req ,res) => {
    try {
        const roles = await Role.find({})
        res.render('pages/admin/role' ,{
            title: 'Role List',
            page: 'Role',
            roles})
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
            title: 'Create',
            page: 'Role'
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
        res.redirect('/admin/role')
        //res.json({success:true , message:'create success' , role : newRole})
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

router.get('/edit/:id', async (req, res) => {
    try {
		const role = await Role.findOne({
            _id : req.params.id
        })
        res.render('pages/admin/role-details',{
            title: 'Edit',
            page: 'Role',
            role
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error', error})
    }
})

//update or edit role 
router.post('/edit/:id' , async(req,res)=>{
    const {name , description} = req.body
    //validation
    if(!name)
        return res.status(400).json({success:false , message:''})
        //edit or update account
    try {
        let editRole = {
            name : name || '' ,
            description : description || '' 
        }
        const editedRole = await Role.findOneAndUpdate(
            {_id: req.params.id} ,
            editRole,
            {new:true}
        )
        if (!editedRole){
            return res.status(401).json({success:false , message : 'cant not edit account'})
        }
        res.redirect('/admin/role')
        //res.json({success : true ,message:'edit successful' , role : editRole})
    
    } catch (error) {
        console.log(error)
            res.status(500) .json({success:false , message:'Error'}) 
    }
})



//delete account 
router.get('/delete/:id', async (req, res) => {
	try {
		const roleId = { _id: req.params.id }
		const deletedRole = await Role.findOneAndDelete(roleId._id)

		if (!deletedRole)
			return res.status(401).json({
				success: false,
				message: 'cant not delete account'
			})

		res.redirect('/admin/role')
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Error', error })
	}
})
module.exports = router;