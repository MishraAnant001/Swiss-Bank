import mongoose from "mongoose";


const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    account_number: {
        type: String,
        required: true,
        unique: true
    },
    account_type: {
        type: String,
        required: true,
        enum: {
            values: ["current", "savings"],
            message: '{VALUE} is not a valid account type'
        }
    },
    balance: {
        type: Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    }
}, {
    timestamps: true
});

export const Account = mongoose.model('Account', accountSchema);