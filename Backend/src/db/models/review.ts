import mongoose from "mongoose"


const ReviewSchema=new mongoose.Schema({
studentId:{
  type: mongoose.Types.ObjectId,
  ref:'User'
 
},
courseId:{
  type:mongoose.Types.ObjectId,
  ref:'Course'
},
comment:{
type:String,
},
reply:{
  type:String,
},
date:{
  type:Date,
default:Date.now()
} ,
rating: {
  type: Number,
 require:true,
}

})
 const Review = mongoose.model("Review", ReviewSchema);
 export default Review