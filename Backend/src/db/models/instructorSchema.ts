import mongoose from "mongoose"
import bcrypt from 'bcryptjs'

const courseSubSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Types.ObjectId,
  },
}, { _id: false });




const instructorSchema=new mongoose.Schema({
  name:{
    type:String,
   
},
email:{
    type:String,
   
},
description:{
  type:String
},
contact:{
  type:Number,
 
},
password:{
    type:String,
    
},
profileImage:{
    type:String,
    default:null
},
isBlocked:{
    type:Boolean,
    default:false
},
googleUserId:{
      type:String,
      default:null
},
courses: [courseSubSchema],

},{
  timestamps:true

})

instructorSchema.pre('save',async function (next){
  if(!this.isModified('password')){
      next();
  }

  if(!this.password){
    return 
  }
  const salt=await bcrypt.genSalt(10)
  this.password=await bcrypt.hash(this.password,salt)
})

instructorSchema.methods.matchPassword=async function (enteredPassword:any){
  return await bcrypt.compare(enteredPassword,this.password)
}
const Instructor = mongoose.model('Instructor',instructorSchema)

export default Instructor