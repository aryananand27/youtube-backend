const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Name is required"]
    },
    email:{
        type:String,
        require:[true,"Email is required"],
        unique:[true,"Email Already Exists"]
    },
    password:{
        type:String,
        require:[true,"password is required"],
        unique:[true,"password Already Exists"]
    },
    cpassword:{
        type:String,
        require:true,
        unique:true
    }
})
UserSchema.pre('save',async function(next){
    this.password=await bcrypt.hash(this.password,10);
    this.cpassword=this.password;
    next();
})

module.exports=mongoose.model('users',UserSchema);