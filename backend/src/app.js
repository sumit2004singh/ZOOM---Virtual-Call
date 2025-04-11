import express from "express" ;
import mongoose from "mongoose" ;
import cors from "cors" ;
import dotenv from "dotenv";

import { createServer } from "node:http" ;
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/user.routes.js"

// Load environment variables from .env file
dotenv.config();

const app = express() ;
const server = createServer(app) ;
const io = connectToSocket(server) ;

app.set("port" , (process.env.PORT || 8000)) ;
app.use(cors()) ;
app.use(express.json({limit:"40kb"})) ;
app.use(express.urlencoded({limit:"40kb" , extended: true})) ;

app.use("/api/v1/users" , userRoutes) ;

const start = async() => {
    app.set("mongo_user");
    const connectionDb = await mongoose.connect(process.env.MONGODB_URI) 
    
    console.log(`MONGO connection DB host: ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log("listening on port 8000")
    });
}

start() ;
