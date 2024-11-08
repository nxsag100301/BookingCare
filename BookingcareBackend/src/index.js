import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connectDB from "./config/connectDB"
import cors from "cors";
require('dotenv').config();


let app = express();

app.use(cors({ credentials: true, origin: true }));
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

connectDB();

viewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 1111;
app.listen(port, () => {
    console.log("Project running on port:", port);
    console.log("This is a link: localhost:8080");
})