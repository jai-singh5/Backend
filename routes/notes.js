const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');




// ROUTE 1: Get all the Notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {

        const notes = await Notes.find({ user: req.user.id });

        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Occured");

    }
})

// ROUTE 2: Add a New Note using: Post "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Title must be atleast 3 character').isLength({ min: 3 }),
    body('description', 'Description must contain 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        // If there are no error return Bad Request and error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Occured");

    }
})

module.exports = router 