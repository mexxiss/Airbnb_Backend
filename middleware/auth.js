import jsonwebtoken from "jsonwebtoken";
import {apiError} from '../utils/apiError.js';

const Auth = async(req, res, next) => {
    const token = req.header("x-auth-header");
    const {JWT_SECRET} = process.env;

    if(!token) {
        return res.status(401).json(new apiError(401, "", "Not Authorized"));
    }

    try {
        const decoded = jsonwebtoken.verify(token, JWT_SECRET);
        req._id = decoded._id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json(new apiError(401, "", "User Not Found"));
    }
}

export { Auth };