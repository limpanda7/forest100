import express from 'express';
import path from "path";
import {fileURLToPath} from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiRegex = /^\/api/;

router.use((req, res, next) => {
    if (apiRegex.test(req.path)) {
        next();
    } else {
        res.sendFile(path.join(__dirname, "client/build", "index.html"));
    }
});

export default router;
