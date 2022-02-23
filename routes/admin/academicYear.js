const express = require("express")
const router = express.Router();
const Post = require('../../models/academicYear');




//get list article

//get list post

router.get("/", async (req, res) => {
    try{
        const posts = await Post.find()
        res.json(posts)
    }
    catch(err) {
        res.json({message: err})
    }
})


//add new  article

//add new  post

router.post("/add", async (req, res) => {
    const post = new Post({
        academicTitle: req.body.academicTitle,
        academicDescription: req.body.academicDescription,
        
    });
    try{
        const save = await post.save();
        res.json(save)
    }
    catch(err) {
        res.json({message: err})
    }

    
})






//details post
//-GET
router.get("/details/:id", async (req,res) =>{
    try{
        const detailsPost = await Post.findById({_id: req.params.id})
        res.json(detailsPost)
    }
    catch(err){
        res.json({message: err})
    }
})




//delete post
//-GET
router.get("/delete/:id", async (req, res) => {
    try{
        const deletePost = { _id: req.params.id }
		const deletedPost = await Post.findOneAndDelete(deletePost)
        res.json('deleted post have id')
    }
    catch(err) {
        res.json({message: err})
    }  
})


//eidt and update   
router.get('/edit/:id' , async(req,res)=>{
    const {academicTitle , academicDescription} = req.body
    //validation
    if(!academicTitle || !academicDescription )
        return res.json({success:false , message:'kekeke'})
    //edit or upate post
    try {
        let editedPost = {
            academicTitle : academicTitle || '' ,
            academicDescription : academicDescription || ''       
        }
        const editconditionPost = {_id : req.params.id}
        editedPost = await Post.findOneAndUpdate(
            editconditionPost ,
            editedPost,
            {new:true}
        )
        if (!editconditionPost){
            return res.json({success:false , message : 'cant not edit post'})
        }
        res.json({success : true ,message:'edit successful' , post : editedPost})
    
    } catch (error) {
        console.log(error)
            res.json({success:false , message:'Error'}) 
    }
})  


module.exports = router;