import express from "express";
import videoRoute from "./routes/video.route.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/temp', express.static(path.join(__dirname, 'public/temp')));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/v1/video", videoRoute);

export default app;
