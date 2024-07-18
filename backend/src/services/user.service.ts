import { AUTH_MESSAGES, ERROR_CODES, SUCCESS_CODES, USER_MESSAGES } from "../constants";
import { ICredentials, IUser } from "../interfaces";
import { User } from "../models";
import bcrypt from "bcrypt"
import config from "config"
import jwt from "jsonwebtoken"
import { ApiError, ApiResponse } from "../utils";

export class UserService {
    async signupUser(userdata: IUser) {
        const round: number = config.get("ROUNDS")
        userdata.password = await bcrypt.hash(userdata.password, round);
        const user = await User.create(userdata);
        return new ApiResponse(SUCCESS_CODES.CREATED, user, USER_MESSAGES.CREATE_SUCCESS)
    }

    async loginUser(credential: ICredentials) {
        const user = await User.findOne({ email: credential.email });
        if (!user) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, USER_MESSAGES.NOT_FOUND)
        }
        const match = await bcrypt.compare(credential.password, user.password);
        if (!match) {
            throw new ApiError(ERROR_CODES.BAD_REQUEST, AUTH_MESSAGES.INVALID_PASSWORD);
        }
        const secretkey: string = config.get("SECRET_KEY");
        const token = jwt.sign({
            userid: user._id,
            role: user.role
        }, secretkey, {
            expiresIn: "24h"
        });
        return new ApiResponse(SUCCESS_CODES.OK, { token, user }, AUTH_MESSAGES.LOGIN_SUCCESS)
    }

    async getAllUsers(){
        const data = await User.find({role:'user',isDeleted:false});
        return new ApiResponse(SUCCESS_CODES.OK,data,USER_MESSAGES.FETCH_SUCCESS)
    }

    async getUserById(userid:string){
        const data =await User.findById(userid)
        if(!data){
            throw new ApiError(ERROR_CODES.NOT_FOUND,USER_MESSAGES.NOT_FOUND)
        }
        return new ApiResponse(SUCCESS_CODES.OK,data,USER_MESSAGES.FETCH_SUCCESS)
    }
    
    async deleteUser(id:string){
        const data = await User.findByIdAndUpdate(id,{
            isDeleted:true
        })
        return new ApiResponse(SUCCESS_CODES.OK,data,USER_MESSAGES.DELETE_SUCCESS)
    }
}