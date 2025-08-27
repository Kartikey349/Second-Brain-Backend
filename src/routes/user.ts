import express, {Request, Response} from "express";
import User from "../models/user";
import jwt from 'jsonwebtoken'
import userAuth from "../middleware/userAuth";
import Content, { Link } from "../models/content";
const userRouter = express.Router()


function random(len : number){
    const option = "qwertyuiopasddghhzlxvbbnm12345678"
    let length = option.length;

    let ans = "";

    for(let i = 0; i < len; i++){
        ans = ans + option[Math.floor((Math.random() * length))]
    }

    return ans;
}

random(0)

userRouter.post("/signup", async (req, res) => {
    const {
        username,
        password
    } = req.body;

        try{
        let user = await User.findOne({
            username: username
        })

        if(user){
            res.status(403).send("user already exists with the username");
            return;
        }

        user = new User({
            username,
            password
        })

        await user.save();

        res.json({
            user
        })
    }catch(err: any){
        res.status(500).send("ERROR: " + err.message)
    }
})


userRouter.post("/login", async (req,res) => {
    const {
        username,
        password
    } = req.body;

    try{
        const user = await User.findOne({
            username: username,
            password
        })

        if(!user){
            res.status(401).send("No user found");
            return;
        }else{
            const token = jwt.sign({id: user._id}, "SecondBrain", {
                expiresIn: "1d"
            });
            res.cookie("token", token)
        }

        res.send(user)
    }catch(err){
        res.send("ERROR: "+ (err as Error).message)
    }
})


userRouter.post("/content", userAuth ,async(req: Request, res: Response)=> {
    const id = req.user;
    const {
        type,
        title,
        link,
        tag,
    } = req.body;
    try{ 
        const content = new Content({
            type,
            title,
            link,
            tag,
            userId: id
        })

        await content.save();
        res.send(content)

    }catch(err: any){
        res.status(411).send("ERROR: " + err.message)
    }
})


userRouter.get("/content", userAuth, async(req: Request, res: Response)=> {
    const id = req.user;
    
    try{
        const content = await Content.find({userId: id});
        
        //major fix -- if content is empty mongoose will return empty array
        res.send(content)
    }catch(err: any){
        res.status(500).send(err.message)
    }
})

userRouter.delete("/content",  userAuth, async(req: Request, res: Response) => {
    const userId = req.user;
    const id = req.body.id

    try{
        const deleted = await Content.findOneAndDelete({
            _id: id,
            userId
        })

        if(!deleted){
            return res.status(404).send({ message: "Content not found or not authorized" });
        }

        const content = await Content.find({
            userId
        })

        res.send(content)
    }catch(err: any){
        res.status(500).send("ERROR: "+ err.message)
    }
})



userRouter.post("/link", userAuth, async(req: Request, res: Response) => {
    const share = req.body.share;

    if(share){

        const existing = await Link.findOne({
            userId: req.user
        })
        if(existing){
            res.json({
                message: "sharing is already on",
                hash: existing.hash
            })
            return;
        }

        const hash = random(20);

        const link = new Link({
            hash: hash,
            userId: req.user
        })

        await link.save();
        res.send(link)
    }else{
        await Link.deleteOne({userId: req.user});
        res.send("sharable link off")
    }
})


userRouter.get("/link/:shareLink", async(req, res) => {
    const hash = req.params.shareLink;

    const link = await Link.findOne({
        hash: hash
    })

    if(link){
        const userId = link.userId;

        const content = await Content.find({
            userId
        }).populate("userId", "username")

        res.send(content)
    }else{
        res.send("link is expired")
    }
})


export default userRouter;