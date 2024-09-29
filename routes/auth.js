const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'jaisinghrajput';


// Create a User using: POST "/api/auth/createauser". No Login required
router.post('/createauser', [
    body('name', 'Name must be atleast 3 character').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password must contain 5 characters    ').isLength({ min: 5 }),
], async (req, res) => {
    // If there are no error return Bad Request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Check whether user with this email exist already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry, user with email already exists." })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
        const data = {
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        // res.json(user)
        res.json({authToken})
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error Occured");
    }
})

// Authentication a User using: POST "/api/auth/login". No Login required
router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    // If there are no error return Bad Request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
        let user = User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Sorry User does not exist"})
        }
    } catch (error) {
        
    }
})

module.exports = router 