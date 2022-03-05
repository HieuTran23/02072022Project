const express = require("express");
const router = express.Router();
const Department = require('../../models/department')
const ObjectId = require('mongodb').ObjectID

//view all department 
//--Method: Get 
router.get('/' , async (req ,res) => {
    try {
        const departments = await Department.find({})
        res.render('pages/admin/department' ,{
            title: 'List',
            page: 'Department',
            departments})
        //res.json(departments)
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})


//create new department
//--Method: Get 

router.get('/create', async (req, res) => {
    try {
        res.render('pages/admin/department-create', {
            title: 'Create',
            page: 'Department'
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
        return res.status(400).json({success:false , message:'Missing department name'})
    try {
        //Check existing department
        const department = await Department.findOne({name})
        if(department)
        return res.status(400).json({success:false , message:'existing department'})
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
    //create new department        
    try {
        const newDepartment = new Department ({
            name,
            description
        })
        await newDepartment.save()
        res.redirect('/admin/department')
        //res.json({success:true , message:'create success' , department : newDepartment})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    }
})



//update or edit department 
//--Method: Get 
router.get('/edit/:id', async (req, res) => {
    try {
		const department = await Department.findOne({
            _id : req.params.id
        })
        //res.json(department)
        res.render('pages/admin/department-edit',{
            title: 'Edit',
            page: 'Department',
            department
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error', error})
    }
})

//--Method: Post 
router.post('/edit/:id' , async(req,res)=>{
    const {name , description} = req.body
    //validation
    if(!name)
        return res.status(400).json({success:false , message:'Missing department name'})
        //edit or update department 
    try {
        let editDepartment = {
            name : name || '' ,
            description : description || '' 
        }
        const editedDepartment = await Department.findOneAndUpdate(
            {_id: req.params.id} ,
            editDepartment,
            {new:true}
        )
        if (!editedDepartment){
            return res.status(401).json({success:false , message : 'can not edit department'})
        }
        res.redirect('/admin/department')
        //res.json({success : true ,message:'edit successful' , department : editDepartment})
    
    } catch (error) {
        console.log(error)
            res.status(500) .json({success:false , message:'Error'}) 
    }
})



//delete department 
//--Method: Get
router.get('/delete/:id', async (req, res) => {
	try {
		const deletedDepartment = await Department.findByIdAndRemove(req.params.id)

		if (!deletedDepartment)
			return res.status(401).json({
				success: false,
				message: 'cant not delete department'
			})
            res.redirect('/admin/department')
        //res.json({success:true, message: 'deleted success'})
		
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Error', error })
	}
})
module.exports = router;