import { NextFunction, Request, Response } from "express";
import { IRequest } from "../interfaces";
import { DashboardService } from "../services";

const service = new DashboardService()

export class DashboardController{
    async getAdminDashboard(req:Request,res:Response,next:NextFunction){
        try {
            const response = await service.getAdminDashboard();
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
    async getUserDashboard(req:IRequest,res:Response,next:NextFunction){
        try {
            const response = await service.getUserDashboard(req.userid!)
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
    

}