const db = require('../db')
const express = require('express');
const Comments = require('../models/comments');

/*const commentsSchema = require("../models/comments");*/

const router = express.Router();

/* Create Comment */
router.get("/comments", async (req, res) => {
    const comments = await Comments.find()
    res.json(data)
    res.send(Comments)
})



module.exports = router;