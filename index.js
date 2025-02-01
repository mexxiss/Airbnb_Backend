import 'dotenv/config';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { app } from './app.js';
import { connectDB } from './config/db.js';

connectDB();
const { PORT, MODE, SSL_KEY, SSL_CERT } = process.env;

if (MODE === "PROD") {
    const options = {
        key: fs.readFileSync(SSL_KEY),
        cert: fs.readFileSync(SSL_CERT),
    };

    https.createServer(options, app).listen(PORT, () => {
        console.log(`Server running securely on https://localhost:${PORT}`);
    });
} else {
    http.createServer(app).listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}