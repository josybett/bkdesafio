import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products'
                    },
                    quantity: Number
                }
            ]
        }
    },
    {
        timestamps: true
    }
)

cartSchema.pre("findOne", function(){
    this.lean()
})

cartSchema.pre("find", function(){
    this.lean()
})

export const cartsModel=mongoose.model("carts", cartSchema)