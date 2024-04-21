const express=require('express');
const { checkAuthenticated } = require('../middleware/auth');
const User=require('../models/users.model');
const router=express.Router();


router.get('/', checkAuthenticated, (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            req.flash('error', '유저를 가져오는데 에러가 발생했습니다.');
            res.redirect('/posts');
        } else {
            res.render('friends', {
                users: users
            })
        }
    })
})

module.exports =router;