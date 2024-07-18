import mongoose from "mongoose"
import { SUCCESS_CODES } from "../constants"
import { Account, Transaction, User } from "../models"
import { ApiResponse } from "../utils"

export class DashboardService {
    async getAdminDashboard() {
        const users = await User.find({})
        const accounts = await Account.find({})
        const transactions = await Transaction.find({})
        const data = {
            users: users.length,
            accounts: accounts.length,
            transactions: transactions.length
        }
        return new ApiResponse(SUCCESS_CODES.OK, data)
    }

    async getUserDashboard(userid: string) {
        const accounts = await Account.find({ user: new mongoose.Types.ObjectId(userid),isActive:true })
        let transactions = []
        for (const account of accounts) {
            const transaction = await Transaction.find({ $or: [{ from_account: account._id }, { to_account: account._id }] })
            transactions.push(transaction.length)
        }
        // console.log(transactions);
        const data = {
            accounts: accounts.length,
            transactions: transactions.reduce((acc,curr)=>acc+curr,0)
        }
        return new ApiResponse(SUCCESS_CODES.OK, data)
    }
}