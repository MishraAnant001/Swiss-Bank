import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    dob: {
      type: Date,
      required: true
    },
    address:{
      type:String,
      required:true
    },
    role: {
      type: String,
      enum:{
        values:['user','admin'],
        message:'{VALUE} is not a valid role!'
      },
      default:"user"
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
  },{
    timestamps:true
  });
  
  export const User = mongoose.model('User', userSchema);