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

//#region 친구추가
router.put('/:id/add-friend',checkAuthenticated, (req, res) => {
    User.findById(req.params.id,(err,user)=>{
        if(err||!user){
            req.flash('error','유저가 없거나 유저를 찾는데 에러가 발생했습니다.')
            res.redirect('back');
        }else{
            //상대 유저의 friends Request에 나의 유저 아이디를 추가
            User.findByIdAndUpdate(user._id,{
                friendsRequests:user.friendsRequests.concat([req.user._id])
            },(err,_)=>{
                if(err){
                    req.flash('error','친구 추가하는데 에러가 발생했습니다.')
                    res.redirect('back');
                }else{
                    req.flash('success','친구 추가  성공했습니다.')
                    res.redirect('back');
                }
            })
        }
    })
})
//#endregion

//#region 친구요청 제거
router.put('/:firstId/remove-friend-request/:secondId', checkAuthenticated,
    (req, res) => {
        User.findById(req.params.firstId, (err, user) => {
            if (err || !user) {
                req.flash("error", '유저를 찾지 못했습니다.');
                res.redirect('back');
            } else {
                const filteredFriendsRequests = user.friendsRequests.filter(friendId =>
                    friendId !== req.params.secondId);
                User.findByIdAndUpdate(user._id, {
                    friendsRequests: filteredFriendsRequests
                }, (err, _) => {
                    if (err) {
                        req.flash('error', '친구 요청 취소를 하는데 에러가 났습니다.');
                    } else {
                        req.flash('success', '친구 요청 취소를 성공했습니다.');
                    }
                    res.redirect('back');
                })
            }
        })
    })
//#endregion

//#region 친구 요청 수락
router.put('/:id/accept-friend-request', checkAuthenticated,(req, res) => {
    User.findById(req.params.id,(err,senderUser)=>{
        if(err||!senderUser){
            req.flash('error','유저가 없거나 유저를 찾는데 에러가 발생했습니다.')
            res.redirect('back');
        }
        else{
            User.findByIdAndUpdate(senderUser.id,{
                friends:senderUser.friends.concat([req.user._id])
            },(err,_)=>{
                if(err){
                    req.flash('error','친구 추가하는데 실패했습니다.')
                    res.redirect('back');
                }else{
                    User.findByIdAndUpdate(req.user._id,{
                        friends:req.user.friends.concat([senderUser._id]),
                        friendsRequests:req.user.friendsRequests.filter(friendId=>friendId!==senderUser._id.toString())
                    },(err,_)=>{
                        if(err){
                            req.flash('error','친구 추가하는데 실패했습니다.')
                            res.redirect('back');
                        }else{
                            req.flash('success','친구 추가를 성공했습니다.')
                            res.redirect('back');
                        }
                    })
                }
            })
        }
    })
})
//#endregion


router.put('/:id/remove-friend',checkAuthenticated,(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err||!user){
            req.flash('error','유저가 없거나 유저를 찾는데 에러가 발생했습니다.')
            res.redirect('back');
        }else{
            User.findByIdAndUpdate(user._id,{
                friends:user.friends.filter(friendId=>friendId!==req.user._id.toString())
            },(err,_)=>{
                if(err){
                    req.flash('error','친구 삭제하는데 에러가 발생했습니다.')
                    res.redirect('back');
                }else{
                    User.findByIdAndUpdate(req.user._id,{
                        friends:req.user.friends.filter(friendId=>friendId!==req.params.id.toString())
                    },(err,_)=>{
                        if(err){
                            req.flash('error','친구 삭제하는데 에러가 발생했습니다.')
                            res.redirect('back');
                        }else{
                            req.flash('success','친구 삭제를 성공했습니다.')
                            res.redirect('back');
                        }
                    })
                }
            })
        }
    })
})



module.exports =router;