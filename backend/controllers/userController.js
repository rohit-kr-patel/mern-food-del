import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bycrypt, { hash } from 'bcrypt'
import validator from 'validator'



//login user

const loginUser=async(req,res)=>{
     const {email,password}=req.body;
     try {
        const loguser = await userModel.findOne({email})
        if(!loguser){
            res.json({success:false,message:"User does not exist"})
        }

        const isMatch=await bycrypt.compare(password,loguser.password)
         if(!isMatch){
          return  res.json({success:false,message:"Invalid credentials"})
         }

         const token=createToken(loguser._id);
         res.json({success:true,token})

     } catch (error) {
        res.json({success:false,message:"Error"})
     }
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const regUser=async(req,res)=>{
const {name,email,password}=req.body;
try {
    //checking if already user exist
    const user=await userModel.findOne({email:email});
    if(user){
        return res.json({success:false,message:"User Already Exist"})
    }

    //validating email format and  strong password

    if(!validator.isEmail(email)){
     return   res.json({success:false,message:"Please Enter Valid Email"})
    }

if(password.length<8){
    return res.json({success:false,message:"Please Enter Strong Password"})
}    

//hashing user password
const salt=await bycrypt.genSalt(10)
const hash=await bycrypt.hash(password,salt)

//create new user
const newUser=new userModel({
    name:name,
    email:email,
    password:hash,
    })
const reguser =await newUser.save();
const token=createToken(reguser._id)
res.json({success:true,token})



} catch (error) {
    res.json({success:false,message:"Error"})
}
}

export {loginUser,regUser}