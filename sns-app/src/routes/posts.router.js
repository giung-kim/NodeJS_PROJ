const express=require('express');
const { checkAuthenticated } = require('../middleware/auth');
const router=express.Router();
const Post=require('../models/posts.model');
const Comment=require('../models/comments.model');

router.get('/', checkAuthenticated, (req, res) => {
    Post.find()
        .populate('comments')
        .sort({ createdAt: -1 })
        .exec((err, posts) => {
            if (err) {
                console.log(err);
            } else {
                res.render('posts', {
                    posts: posts,
                    currentUser: req.user
                });
            }
        })
})

module.exports = router;