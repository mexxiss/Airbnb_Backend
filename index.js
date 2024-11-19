import 'dotenv/config';
import { app } from './app.js';
import { connectDB } from './config/db.js';

connectDB();
const { PORT } = process.env;

app.listen(PORT, ()=>console.log("Server Connected Successfully"));