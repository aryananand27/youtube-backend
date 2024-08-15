const express=require('express');
const app=express();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const cors=require('cors')
require('./DB/config');
const UserModel=require('./DB/Users');
const favouritesModel=require('./DB/Myfavourites');
const watchlatersModel=require('./DB/Mywatchlater');
const {ObjectId}=require('mongodb')
const SubscribersModel=require('./DB/Mysubscribers');
const transporter=require('./email');


app.use(cors());
app.use(express.json());


app.post('/register',async(req,resp)=>{
   try{
        if(req.body.password===req.body.cpassword){
            const result=new UserModel(req.body);
            const token= await jwt.sign({_id:result._id},"Meliodasthedragonsinofwrath",{expiresIn:"1h"});
            const data=await result.save();
       
            resp.send({result:data,token});
        }
        else{
            resp.send({reslt:"Confirm password is not same as password.."})
        }
   }
   catch(error){
    if(error.keyPattern){
        resp.send({reslt:"User Already Exists"});
    }
    else{
        resp.send(error);
    }
    
   }
})

app.post('/login',async(req,resp)=>{
    if(req.body.email && req.body.password){
        const result= await UserModel.findOne({email:req.body.email});
        
        if(result){
            const ismatch=await bcrypt.compare(req.body.password,result.password);
            const token=jwt.sign({_id:result._id},"Meliodasthedragonsinofwrath",{expiresIn:"1h"});
            if(ismatch){
                delete result.password;
                resp.send({result,token});
            }
            else{
                resp.send({err:"User Credential is wrong."})
            }
        }
        else{
            resp.send({err:"Provided Email is wrong ."})
        }
        
    }
    else{
        resp.send({err:"All Field is required."})
    }

})


app.post('/favourites/:id',async(req,resp)=>{
    
     let data=await favouritesModel.findOne({userId:req.params.id});
     
    if(data){

       let remarray=[];
      data.favdata.forEach(element => {
            let obj={videoId:element.videoId,imgurl:element.imgurl,title:element.title,channelTitle:element.channelTitle}
            remarray.push(obj);
      });
        
        let arrnew=req.body.favdata;
        arrnew=arrnew.concat(remarray);
        let sndarray=arrnew.filter(function(key,index){
                return index===arrnew.findIndex(function(obj){
                    return JSON.stringify(key)===JSON.stringify(obj);
                })
            })
           
        req.body.favdata=sndarray;
      
         const result=await favouritesModel.updateOne({userId:req.params.id},{$set:req.body});
        resp.send(result);
    }
    else{
        let result=new favouritesModel(req.body);
        let data=await result.save();
        resp.send(data);
    }
})

app.get('/getfavourites/:id',async(req,resp)=>{
    if(req.params.id){
        const result=await favouritesModel.findOne({userId:req.params.id});
        if(result){
            resp.send({favdata:result.favdata});
        }
        else{
            resp.send({reslt:"Not added any video to your favourites.."})
        }
        
    }
    else{
        resp.send({reslt:"You are not an authorized user.."})
    }  
})
app.put('/favdelete/:id' ,async(req,resp)=>{
    if(req.params.id){
        const result=await favouritesModel.updateOne({userId:req.body.userId},{$pull:{favdata:{_id:new ObjectId(req.params.id)}}});
        resp.send(result);
    }
    else{
        resp.send({reslt:"You are not an authorized user."})
    }
})


app.post('/watchlaters/:id',async(req,resp)=>{
    let data=await watchlatersModel.findOne({userId:req.params.id});
    if(data){

        let remarray=[];
       data.watchdata.forEach(element => {
             let obj={videoId:element.videoId,imgurl:element.imgurl,title:element.title,channelTitle:element.channelTitle}
             remarray.push(obj);
       });
         
         let arrnew=req.body.watchdata;
         arrnew=arrnew.concat(remarray);
         let sndarray=arrnew.filter(function(key,index){
                 return index===arrnew.findIndex(function(obj){
                     return JSON.stringify(key)===JSON.stringify(obj);
                 })
             })
            
         req.body.watchdata=sndarray;
       
          const result=await watchlatersModel.updateOne({userId:req.params.id},{$set:req.body});
         resp.send(result);
     }
     else{
         let result=new watchlatersModel(req.body);
         let data=await result.save();
         resp.send(data);
     }
})


app.get('/getwatchlaters/:id',async(req,resp)=>{
    if(req.params.id){
        const result=await watchlatersModel.findOne({userId:req.params.id});
        if(result){
            resp.send(result.watchdata);
        }
        else{
            resp.send({reslt:"Not added any video to your favourites.."})
        }
    }
    else{
        resp.send({reslt:"You are not an authorized user.."})
    }
})

app.put('/watchdelete/:id' ,async(req,resp)=>{
    if(req.params.id){
        const result=await watchlatersModel.updateOne({userId:req.body.userId},{$pull:{watchdata:{_id:new ObjectId(req.params.id)}}});
        resp.send(result);
    }
    else{
        resp.send({reslt:"You are not an authorized user."})
    }
})
app.post('/subscribers/:id',async(req,resp)=>{
    const data=await SubscribersModel.findOne({userId:req.params.id});
    if(data){

        let remarray=[];
       data.subsdata.forEach(element => {
             let obj={imgurl:element.imgurl,subcount:element.subcount,channelTitle:element.channelTitle,channelId:element.channelId}
             remarray.push(obj);
       });
         
         let arrnew=req.body.subsdata;
         arrnew=arrnew.concat(remarray);
         let sndarray=arrnew.filter(function(key,index){
                 return index===arrnew.findIndex(function(obj){
                     return JSON.stringify(key)===JSON.stringify(obj);
                 })
             })
            
         req.body.subsdata=sndarray;
       
          const result=await SubscribersModel.updateOne({userId:req.params.id},{$set:req.body});
         resp.send(result);
     }
     else{
         let result=new SubscribersModel(req.body);
         let data=await result.save();
         resp.send(data);
     }
})
app.get('/getsubscribers/:id',async(req,resp)=>{
    try{
        if(req.params.id){
            const result=await SubscribersModel.findOne({userId:req.params.id});
            if(result){
                resp.send(result.subsdata);
            }
            else{
                resp.send({reslt:"No Subscribed channels"})
            }
        }
        else{
            resp.send({reslt:"You are not an authorized user."})
        }
    }
    catch(err){
        resp.send({err:err});
    }
    
})

app.put('/deletesubscribers/:id',async(req,resp)=>{
    if(req.params.id){
        const result=await SubscribersModel.updateOne({userId:req.body.userId},{$pull:{subsdata:{channelId:req.params.id}}});
        resp.send(result);
    }
    else{
        resp.send({reslt:"You are not an authorized user."})
    }
})

app.post('/email',async(req,resp)=>{
    try{
        const info = await transporter.sendMail({
            from:`"Aryan Bharadwaaj" ${process.env.USER}`,
            to: req.body.email, 
           
            subject: "Registration Successfully Done.", 
            text: `Welcome ${req.body.name}, \n`+"Thank you for registering to the greatest Entertainment app of India. Feeling Bored today.... Explore Now 🤩 \n"+"\n Regards\nYourTube Team.",
          
          });
          resp.send({info:info});

    }catch(err){
        resp.send({err:err});
    }
})

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})
app.listen(8000);
