import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();


export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


export const config = {
PORT: process.env.PORT || 5000,
DATABASE_URL: process.env.DATABASE_URL,
UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
BASE_URL: process.env.BASE_URL || 'http://localhost:5000'
};