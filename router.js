import express from 'express';
import path from "path";
import {fileURLToPath} from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
router.get("/forest", (req, res) => {
    console.log('forest')
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
router.get("/on-off", (req, res) => {
    console.log('on-off')
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

export default router;