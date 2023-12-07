import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        code: { type: String, unique:true, required: true },
        price: { type: Number, required: true },
        status: { type: Boolean, default: true },
        stock: { type: Number, required: true },
        category: { type: String, required: true },
        thumbnails: {
            type: [{ path: String }] 
        },
        delete: {
            type: Boolean, default: false 
        }
    },
    {
        timestamps: true
    }
)

productSchema.pre("findOne", {delete:false}, function(){
    this.lean()
})

productSchema.pre("find", {delete:false}, function(){
    this.lean()
})

export const productModel = mongoose.model("products", productSchema)