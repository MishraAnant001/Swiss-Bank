import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  from_account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  to_account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum:{
        values:['debit','credit','transfer'],
        message:'{VALUE} is not a valid type!'
    }
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  sender_remaining_balance:{
    type:Number
  },
  reciever_remaining_balance:{
    type:Number
  }
},
{
    timestamps:true
});

export const Transaction = mongoose.model('Transaction', transactionSchema);