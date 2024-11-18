import {config} from 'dotenv';
config({path: "./.env"});
import { app } from './app.js';
import { connectDB } from './config/db.js';

connectDB();
const { PORT } = process.env;

app.listen(PORT, ()=>console.log("Server Connected Successfully"));