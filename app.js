import express from 'express';
import cors from 'cors';
import userRoute from "./routes/Users.js"
import { apiError } from './utils/apiError.js';
import otpRoute from './routes/Otp.js';
import passResetRoute from './routes/PassReset.js';
import servicesRoute from './routes/Services.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({origin: '*'}));

app.use("/api/auth", userRoute );
app.use("/api/otp", otpRoute);
app.use("/api/reset-password", passResetRoute);
app.use("/api/services", servicesRoute)

app.use((err, req, res, next) => {
    if (err instanceof apiError) {
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            errors: err.errors
        });
    } else {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export { app }