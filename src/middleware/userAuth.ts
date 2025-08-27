import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken'


// interface TokenPayload extends JwtPayload {
//   username: string;
// }

declare module "express-serve-static-core" {
  interface Request {
    user?: string;
  }
}

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    try{
        if(!token){
            res.status(401).send("Please login")
            return;
        }
        const decoded = jwt.verify(token, "SecondBrain");
        
        req.user = (decoded as JwtPayload).id;
        next();
    }catch(err: any){
        res.status(500).send("ERROR: " + err.message)
    }
}

export default userAuth