import otpGenerator from 'otp-generator';
import { OtpModel } from "../models/Otp.js";
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';

export const SendOtp = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new apiError(400, "Email is required"));
    }

    let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    
    const otpDoc = {email, otp};

    try {
        const doc = await OtpModel.create(otpDoc);
        return res.status(200).json(new apiResponse(200, doc, "OTP sent Successfully"));
    } catch (error) {
        return next(new apiError(500, "Something went Wrong while sending OTP."));
    }
}

export const VerifyOtp = async (req, res, next) => {
    const {email, otp} = req.body;

    if(!email) {
        return next(new apiError(400, "Email is required"));
    }

    try {
        const doc = await OtpModel.find({email}).sort({createdAt: -1}).limit(1);
        if(doc.length === 0 || doc[0].otp !== otp ) {
            return next(new apiError(400, "OTP is not valid"));
        }
        return res.status(200).json(new apiResponse(200, doc, "OTP Verified Successfully"))
    } catch (error) {
        return next(new apiError(500, "Something went Wrong while Verifying OTP"));
    }
}

export const getOtps = async (req, res, next) => {
    try {
        const result = await OtpModel.find();
        return res.status(200).json(new apiResponse(200, result, "Retrieved OTP Collection Successfully"));
    } catch (error) {
        return next(new apiError(500, "Something went Wrong"));
    }
}

export const deleteOtps = async (req, res, next) => {
    try {
        const result = await OtpModel.deleteMany();
        return res.status(200).json(new apiResponse(200, result, "Retrieved OTP Collection Successfully"));
    } catch (error) {
        return next(new apiError(500, "Something went Wrong"));
    }
}