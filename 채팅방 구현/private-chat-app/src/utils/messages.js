const messageModel = require("../models/messages.mode");

const getToken=(sender,receiver)=> {
    const key =[sender,receiver].sort().join("_");
    return key;
}


const saveMessages =async({from,to,message,time})=>{
    const token=getToken(from,to);
    const data={
        from,message,time
    }
    try {
        const result = await messageModel.updateOne({ userToken: token }, {
            $push: { messages: data }
        });
        console.log("message created", result);
    } catch (err) {
        // 에러 처리
        console.error(err);
    }
}

//     messageModel.updateOne({userToken:token},{
//         $push:{messages:[data]}
//     },(err,res)=>{
//         if(err) console.error(err);
//         console.log("message created")
//     })
// }

module.exports = {
    saveMessages
};