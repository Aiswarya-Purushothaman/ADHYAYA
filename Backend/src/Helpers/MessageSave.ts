import ChatSchema from "../db/models/ChatSchema"

export async function  MessageSaved(data:any){
const update=await ChatSchema.create(data)
return update
}