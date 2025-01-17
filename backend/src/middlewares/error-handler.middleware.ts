import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils";
import { ERROR_CODES } from "../constants";

export const errorHandler =(error:any,req:Request,res:Response,next:NextFunction)=>{
    // console.log(error.message );
    if(error instanceof ApiError){  
        return res.status(error.statusCode).json({
            success:false,
            message:error.message
        })
    }
    if(error.code ==11000){
        return res.status(ERROR_CODES.BAD_REQUEST).json({
            success:false,
            message:"User with email or phone number already exists!"
        })
    }
    console.log(error);
    return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:error.message
    })
    // next(error)
}