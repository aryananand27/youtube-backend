const mongoose=require('mongoose');
const WatchLaterSchema=new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    watchdata:[
        {
            videoId:{
                type:String,
                require:true
            },
            imgurl:{
                type:String,
                require:true
            },
            title:{
                type:String,
                require:true
            },
            channelTitle:{
                type:String,
                require:true
            }
        }
    ]
})

module.exports=mongoose.model('watchlaters',WatchLaterSchema);