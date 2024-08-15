const mongoose=require('mongoose');
const SubscribersSchema=new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    subsdata:[
        {
            imgurl:{
                type:String,
                require:true
            },
            subcount:{
                type:String,
                require:true
            },
            channelTitle:{
                type:String,
                require:true
            },
            channelId:{
                type:String,
                require:true
            }
        }
    ]
});

module.exports=new mongoose.model('subscribers',SubscribersSchema);
