const express=require('express');
const { checkAuthenticated, checkPostOwnerShip } = require('../middleware/auth');
const router=express.Router();
const Post=require('../models/posts.model');
const Comment=require('../models/comments.model');
const path=require('path');
const multer = require('multer');



//#region image Upload
const storageEngine=multer.diskStorage({
    destination:(req,file,callback) =>{
        callback(null,path.join(__dirname,'../public/assets/images'))
    },
    filename:(req,file,callback) =>{
        callback(null,file.originalname);
    }
});

const upload=multer({storage:storageEngine}).single('image');


router.post('/',checkAuthenticated,upload,(req,res,next) =>{
    let desc=req.body.desc;
    let image=req.file ? req.file.filename :""  // 조건 ? 값1:값2

    //MongoDB에 저장
    Post.create({
        image: image,
        description: desc,
        author:{
            id:req.user._id,
            username:req.user.username
        }
    },(err,_)=>{
        if(err){
            req.flash('error','포스트 생성 실패');
            res.redirect('back');

            //next(err);
        }else{
            req.flash('success','포스트 생성 성공');
            res.redirect('back');
        }
    })
}) 
//#endregion


router.get('/', checkAuthenticated, (req, res) => {
    Post.find()
        .populate('comments')
        .sort({ createdAt: -1 })    //-1 : 내림차순 (최신순), 1: 오름차순
        .exec((err, posts) => {
            if (err) {
                console.log(err);
            } else {
                res.render('posts', {
                    posts: posts,
                });
            }
        })
})


router.get('/:id/edit', checkPostOwnerShip,(req,res) => {
    res.render('posts/edit', {  
        post:req.post
    });
})

router.put('/:id', checkPostOwnerShip,(req,res) => {
    Post.findByIdAndUpdate(req.params.id, req.body,(err,_)=>{
        if(err){
            req.flash('error','포스트 수정 실패');
            res.redirect('/posts');
        }else{
            req.flash('success','포스트 수정 성공');
            res.redirect('/posts');
        }
    })
})


router.delete('/:id',checkPostOwnerShip,(req,res)=>{
    Post.findByIdAndRemove(req.params.id,(err,_)=>{
        if(err){
            req.flash('error','포스트 삭제 실패');
            res.redirect('/posts');
        }else{
            req.flash('success','포스트 삭제 성공');
            res.redirect('/posts');
        }
    })
})

module.exports = router;