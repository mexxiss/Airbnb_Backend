import jsonwebtoken from "jsonwebtoken";
import {apiError} from '../utils/apiError.js';
import { BlacklistModel } from "../models/Blacklist.js";

const Auth = async(req, res, next) => {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid" });
    }
    const token = authorizationHeader.split(" ")[1];
    const {JWT_SECRET} = process.env;

    if(!token) {
        return res.status(401).json(new apiError(401, "", "Not Authorized"));
    }

    try {
        const decoded = jsonwebtoken.verify(token, JWT_SECRET);
        req._id = decoded._id;
        req.role = decoded.role;
        req.token = token
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json(new apiError(401, "", "User Not Found"));
    }
}

export { Auth };