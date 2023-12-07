import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
    {
        user: String,
        message: String
    },
    {
        timestamps: true
    }
)

messageSchema.pre("findOne", function(){
    this.lean()
})

messageSchema.pre("find", function(){
    this.lean()
})

export const messageModel = mongoose.model("messages", messageSchema)