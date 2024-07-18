import mongoose from "mongoose";
import { ACCOUNT_MESSAGES, ERROR_CODES, SUCCESS_CODES, TRANSACTION_MESSAGES } from "../constants";
import { ITransaction } from "../interfaces";
import { Account, Transaction } from "../models";
import { ApiError, ApiResponse } from "../utils";

export class TransactionService {
    async generateTxn(txnData: ITransaction) {
        let session;
        try {
            session = await Transaction.startSession()
            session.startTransaction()
            const fromAccount = await Account.findOne({ account_number: txnData.from_account })
            if (!fromAccount) {
                throw new ApiError(ERROR_CODES.BAD_REQUEST, ACCOUNT_MESSAGES.NOT_FOUND)
            }
            if (txnData.type == "debit") {
                if (fromAccount.balance < txnData.amount) {
                    throw new ApiError(ERROR_CODES.BAD_REQUEST, TRANSACTION_MESSAGES.INSUFFICIENT_BALANCE)
                }
                const updated_balance = fromAccount.balance - txnData.amount
                fromAccount.balance = updated_balance
                const data = await Transaction.create({
                    from_account: fromAccount!._id,
                    to_account: fromAccount!._id,
                    amount: txnData.amount,
                    type: txnData.type,
                    description: txnData.description,
                    sender_remaining_balance: updated_balance
                })
                await fromAccount.save()
                await session.commitTransaction();
                session.endSession();
                return new ApiResponse(SUCCESS_CODES.OK, data, TRANSACTION_MESSAGES.COMPLETE)

            } else if (txnData.type == "credit") {
                const updated_balance = fromAccount.balance + txnData.amount
                fromAccount.balance = updated_balance
                const data = await Transaction.create({
                    from_account: fromAccount!._id,
                    to_account: fromAccount!._id,
                    amount: txnData.amount,
                    type: txnData.type,
                    description: txnData.description,
                    sender_remaining_balance: updated_balance
                })
                await fromAccount.save()
                await session.commitTransaction();
                session.endSession();
                return new ApiResponse(SUCCESS_CODES.OK, data, TRANSACTION_MESSAGES.COMPLETE)
            } else {
                const toAccount = await Account.findOne({ account_number: txnData.to_account })
                if (!toAccount) {
                    throw new ApiError(ERROR_CODES.BAD_REQUEST, ACCOUNT_MESSAGES.NOT_FOUND)
                }
                if (fromAccount.balance < txnData.amount) {
                    throw new ApiError(ERROR_CODES.BAD_REQUEST, TRANSACTION_MESSAGES.INSUFFICIENT_BALANCE)
                } else {
                    const updated_balance = fromAccount.balance - txnData.amount
                    const reciever_updated_balance = toAccount.balance + txnData.amount
                    toAccount.balance= reciever_updated_balance
                    fromAccount.balance = updated_balance
                    const data = await Transaction.create({
                        from_account: fromAccount!._id,
                        to_account: toAccount!._id,
                        amount: txnData.amount,
                        type: txnData.type,
                        description: txnData.description,
                        sender_remaining_balance: updated_balance,
                        reciever_remaining_balance:reciever_updated_balance
                    })
                    await fromAccount.save()
                    await toAccount.save()
                    await session.commitTransaction();
                    session.endSession();
                    return new ApiResponse(SUCCESS_CODES.OK, data, TRANSACTION_MESSAGES.COMPLETE)
                }
            }
        } catch (error) {
            if (session) {
                await session.abortTransaction();
                session.endSession();
            }
            throw error
        }
    }

    async getAllTransactions(startdate:Date,endDate:Date) {
        const data = await Transaction.aggregate([
            {
                $match:{
                    $gte:{
                        createdAt:new Date(startdate)
                    },
                    $lte:{
                        createdAt:new Date(endDate)
                    }
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "from_account",
                    foreignField: "_id",
                    as: "from_account_details"
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "to_account",
                    foreignField: "_id",
                    as: "to_account_details"
                }
            },
            {
                $addFields: {
                    from_account_user_id: {
                        $first: ["$from_account_details.user"]
                    },
                    to_account_user_id: {
                        $first: ["$to_account_details.user"]
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "from_account_user_id",
                    foreignField: "_id",
                    as: "from_user_info"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "to_account_user_id",
                    foreignField: "_id",
                    as: "to_user_info"
                }
            },
            {
                $project: {
                    sender_account: {
                        $first: [
                            "$from_account_details.account_number"
                        ]
                    },
                    reciever_account: {
                        $cond: {
                            if: {
                                $eq: [
                                    "$from_account_user_id",
                                    "$to_account_user_id"
                                ]
                            },
                            then: "to self",
                            else: {
                                $first: [
                                    "$to_account_details.account_number"
                                ]
                            }
                        }
                    },
                    sender_name: {
                        $first: ["$from_user_info.name"]
                    },
                    receiver_name: {
                        $cond: {
                            if: {
                                $eq: [
                                    "$from_account_user_id",
                                    "$to_account_user_id"
                                ]
                            },
                            then: "to self",
                            else: {
                                $first: ["$to_user_info.name"]
                            }
                        }
                    },
                    amount: 1,
                    createdAt: 1,
                    description: 1,
                    sender_remaining_balance: 1,
                    reciever_remaining_balance:1,
                    type: 1
                }
            }
        ])
        if (data.length == 0) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, TRANSACTION_MESSAGES.NOT_FOUND)
        }
        return new ApiResponse(SUCCESS_CODES.OK, data, TRANSACTION_MESSAGES.FETCH_SUCCESS)
    }

    async getTxnByAccount(id: string) {
        const data = await Transaction.aggregate([
            {
                $match: {
                    $or:[{from_account: new mongoose.Types.ObjectId(id)},
                        {to_account:new mongoose.Types.ObjectId(id)}]
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "from_account",
                    foreignField: "_id",
                    as: "from_account_details"
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "to_account",
                    foreignField: "_id",
                    as: "to_account_details"
                }
            },
            {
                $addFields: {
                    from_account_user_id: {
                        $first: ["$from_account_details.user"]
                    },
                    to_account_user_id: {
                        $first: ["$to_account_details.user"]
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "from_account_user_id",
                    foreignField: "_id",
                    as: "from_user_info"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "to_account_user_id",
                    foreignField: "_id",
                    as: "to_user_info"
                }
            },
            {
                $project: {
                    sender_account: {
                        $first: [
                            "$from_account_details.account_number"
                        ]
                    },
                    reciever_account: {
                        $cond: {
                            if: {
                                $eq: [
                                    "$from_account_user_id",
                                    "$to_account_user_id"
                                ]
                            },
                            then: "to self",
                            else: {
                                $first: [
                                    "$to_account_details.account_number"
                                ]
                            }
                        }
                    },
                    sender_name: {
                        $first: ["$from_user_info.name"]
                    },
                    receiver_name: {
                        $cond: {
                            if: {
                                $eq: [
                                    "$from_account_user_id",
                                    "$to_account_user_id"
                                ]
                            },
                            then: "to self",
                            else: {
                                $first: ["$to_user_info.name"]
                            }
                        }
                    },
                    amount: 1,
                    createdAt: 1,
                    description: 1,
                    sender_remaining_balance: 1,
                    reciever_remaining_balance:1,
                    type: 1
                }
            }
        ])
        if (data.length == 0) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, TRANSACTION_MESSAGES.NOT_FOUND)
        }
        return new ApiResponse(SUCCESS_CODES.OK, data, TRANSACTION_MESSAGES.FETCH_SUCCESS)
    }
}