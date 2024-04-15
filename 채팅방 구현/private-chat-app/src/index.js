const express=require('express');
const path=require('path');
const app= express();
const crypto= require('crypto');

const http= require('http');
const {Server}=require('socket.io');
const { default: mongoose } = require('mongoose');
const { saveMessages } = require('./utils/messages');
const server=http.createServer(app);
const io=new Server(server);

//정적파일 등록
const publicDirectory=path.join(__dirname, '../public');
app.use(express.static(publicDirectory));
app.use(express.json());        // client에서 보내주는 body 분석

//DB
mongoose.connect('mongodb+srv://gw9977:Rldnd0112!@private-chat.9ifyrd3.mongodb.net/?retryWrites=true&w=majority&appName=private-chat')
    .then(()=>console.log('DB Connected'))
    .catch(err => console.log(err))

const randomID=()=> crypto.randomBytes(8).toString('hex');

app.post('/session',(req,res)=>{
    const data={
        username:req.body.username,
        userID:randomID()
    }
    res.send(data);
})

io.use((socket, next)=>{
    const username=socket.handshake.auth.username;
    const userID=socket.handshake.auth.userID;
    if(!username){
        return next(new Error("Invalid username"))
    }

    socket.username=username;
    socket.id=userID;

    next();
})

    
let users=[];   // 유저 정보
io.on('connection', async socket=>{

    let userData={
        username: socket.username,
        userId:socket.id
    };
    users.push(userData);
    io.emit('users-data',{users}) 

    //client에서 온 메세지  , A=>서버=>B
    socket.on('message-to-server',(payload)=>{
        io.to(payload.to).emit('message-to-client',payload);
        saveMessages(payload);
    })

    //DB에서 메세지 가져오기
    socket.on('fetch-messages',()=>{})

    //유저가 방에서 나갔을 때
    socket.on('disconnect',()=>{
        users=users.filter(user=>user.userID!==socket.id); //같지않은사람만 필터
        //사이드 바 리스트에서 없애기
        io.emit('users-data',{users})
        //대화 중지->대화창 없애기
        io.emit('user-away',socket.id);
    })
})


const port=9000;
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})