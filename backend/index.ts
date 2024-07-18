import express from "express"
import config from "config"
import { connectDB } from "./src/db";
import cors from "cors"
import { DB_MESSAGES, SERVER_MESSAGES } from "./src/constants";
import { mainRouter } from "./src/routes";
import { errorHandler } from "./src/middlewares";


const app = express()
app.use(express.json({limit:'500mb'}))
app.use(cors())
app.use(mainRouter)
app.use(errorHandler)
;
(async()=>{
    try {
        const port :number = config.get("PORT")
        const url :string = config.get("MONGO_URI")
        await connectDB(url)
        console.log(DB_MESSAGES.CONNECT_SUCCESS);
        app.listen(port,()=>{
            console.log(SERVER_MESSAGES.START_SUCCESS,port);
        })
    } catch (error:any) {
        console.log(DB_MESSAGES.CONNECT_ERROR,error.message);
    }
})();