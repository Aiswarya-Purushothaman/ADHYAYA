import mongoose from "mongoose"


const ChatSchema=new mongoose.Schema({
sender:{
  type:Object,
  required:true
},
receiver:{
  type:Object,
  required:true
},
message:{
type:String,
require:true
},
Time:{
  type:String,
  require:true
} ,
type: {
  type: String,
 require:true,
}

})
 const Chat = mongoose.model("chat", ChatSchema);
 export default Chat