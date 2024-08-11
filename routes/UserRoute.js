import express from 'express';
import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import userController from '../controllers/UserController.js'; // Ensure the correct path

const user = express();

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
user.use(bodyParser.urlencoded({ extended: true }));
user.use(express.static(path.resolve(__dirname, 'public')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route setup
user.post('/importUser', upload.single('file'), userController.importUser);

export default user;
