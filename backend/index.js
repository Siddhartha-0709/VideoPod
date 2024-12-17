import app from "./app.js";
import fs from 'fs';

app.listen(4000, () => {
    if (!fs.existsSync('public/temp')) {
        fs.mkdirSync('public/temp');
    }
    console.log("Server is running on port 4000");
});

