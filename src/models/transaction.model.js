import {Schema,model} from "mongoose";

const transactionSchema=new Schema(
    {
        receiver:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        date:{
            type:Date,
            required:true
        }
    },
    {timestamps:true}
)

export const Transaction=model("Transaction",transactionSchema)