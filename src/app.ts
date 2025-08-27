import express from "express"
import connectDb from "./db"
import userRouter from "./routes/user"
import cookieParser from 'cookie-parser'
import dotenv from "dotenv";
dotenv.config();
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cookieParser())


app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))


app.use("/user", userRouter)



async function main(){
    await connectDb();
    console.log("connected to DB")
    app.listen(3001, ()=>{
        console.log("Successfully listening to port 3001")
    })
}
main();