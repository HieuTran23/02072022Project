const express = require("express")
const router = express.Router();
const Post = require('../../models/academicYear');



//get list article
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


module.exports = router;