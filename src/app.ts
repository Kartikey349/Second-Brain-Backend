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


const allowedOrigins = [
  "http://localhost:5173",
  "https://second-brain-eta-five.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    // Postman ya curl jaise tools me origin undefined hota hai
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



app.use("/user", userRouter)



async function main(){
    await connectDb();
    console.log("connected to DB")
    app.listen(3001, ()=>{
        console.log("Successfully listening to port 3001")
    })
}
main();