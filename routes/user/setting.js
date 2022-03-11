const express = require("express");

const router = express.Router();

const User = require('../../models/user')
const Role = require('../../models/role');
const Department = require('../../models/department')

//Edit and update user
//-- get
router.get('/:id', async (req, res) => {
    try {
		const user = await User.findById({ _id: req.params.id})
        const roles = await Role.find()
        const departments = await Department.find()
        res.render('pages/user/setting', {
            title: "Edit",
            page: "User",
            user,
            roles,
            departments
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({success:false , message:'Error', error})
    }
})

//-- Post 
router.post('/:id' , async(req,res)=>{
    const {fullName, departmentId,emails, phones, streets, cities, countries} = req.body
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
            departmentId
        }
        
        //Update user to database
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, editUser, {new: true})
        var id= req.params.id;
        res.redirect('/setting/'+ id)

        
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
})


module.exports = router;