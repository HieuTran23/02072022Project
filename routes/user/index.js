const express = require("express");
const role = require("../../models/role");
const router = express.Router();
const User = require('../../models/user');
const Role = require('../../models/role');

//View list user
router.get('/' , async (req ,res) => {
    try {
        const list = await User.find({})
        res.json(list)
    } catch (error) {
        console.log(error)
        res.status(500) .json({success:false , message:'Error'}) 
    }
})

//Edit and update user
//-- get
router.get('/edit/:id', async (req, res) => {
    try {
		const getUser = await User.findOne({
            _id : req.params.id
        })
        res.json(getUser)
    }catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error', error})
    }
})

//-- Post 
router.post('/edit/:id' , async(req,res)=>{
    const {fullName, emails, phones, streets, cities, countries} = req.body
     //validation
    try {
        //Create contact field (object)
        let contact = {
            emails: [],
            phones: [],
            addresses:[]
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
            fullName: fullName,
            contact: contact,
        }
        res.json({success : true ,message:'edit successful' , edit : editUser})
        //Update user to database
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, editUser, {new: true})

        

        
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})


module.exports = router;