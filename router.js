import express from 'express';
import path from "path";
import {fileURLToPath} from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
router.get("/qa", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
router.get("/on-off", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
router.get("/boulogne", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

export default router;
