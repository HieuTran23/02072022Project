const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const User = require('../../models/user')
const {verifyToken, isAdmin} = require('../../middleware/verifyAuth')


router.get("/",  verifyToken, isAdmin, async (req, res) => {
    try{
        const user = await User.findOne({username: req.user.name}, '-password')

        const categorys = await Category.find({})
        res.render('pages/admin/category', {
            title: 'Category List',
            page: 'Category',
            categorys,
            user
        })
    }
    catch(err) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//create


router.get("/create",  verifyToken, isAdmin, async (req, res) => {
    try{
        const user = await User.findOne({username: req.user.name}, '-password')

        const categorys = await Category.find({})
        res.render('pages/admin/category-create', {
            title: 'Category ',
            page: 'Category',
            categorys,
            user
        })
    }
    catch(err) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})
router.post('/create',  verifyToken, isAdmin, async(req , res ) => {
    const {name , description } = req.body

    //validation
    if(!name)
    return res.status(400).json({success:false , message:'Missing category name'})
    // existing category name   check
    try {
        const existingName = await Category.findOne({name})
        if(existingName)
        return res.status(400).json({success:false , message:'Existing category name'})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'error'}) 
    }
    try {
        const newcategory = new Category({
            name , 
            description
        })
        await newcategory.save()
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    }
})

// edit


router.get("/edit/:id", verifyToken, isAdmin, async (req, res) => {
    try{
        const user = await User.findOne({username: req.user.name}, '-password')

        const category = await Category.findOne({
            _id : req.params.id
        })
        res.render('pages/admin/category-edit', {
            title: 'Edit Category',
            page: 'Category',
            category,
            user
        })
    }
    catch(err) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

router.post("/edit/:id", verifyToken, isAdmin, async(req , res)=>{
    const {name , description}  = req.body
    // validation
    if (!name)
        return res.status(400).json({success:false , message:'Missing category name'})
    try {
        let editCategory = {
            name : name || '' ,
            description : description || ''
        }
        const editedCategory = await Category.findByIdAndUpdate(
            {_id : req.params.id},
            editCategory ,
            {new : true}
        )
        if(!editedCategory)
            return res.status(400).json({success:false , message:'cant edit category'}) 
    res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
            res.status(500) .json({success:false , message:'Error'}) 
    }
})

//delete
router.get('/delete/:id',  verifyToken, isAdmin, async(req,res)=>{
    try {
        const category = {_id: req.params.id}
        const deleteCate = await Category.findByIdAndRemove(category._id)
        if(!deleteCate)
            return res.status(401).json({success: false , message : 'cant not delete categoey'})
    res.redirect('/admin/category')
    } catch (error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Error', error })
    }
})
     

module.exports = router;