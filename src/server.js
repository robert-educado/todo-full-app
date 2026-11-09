import express from "express";
import tasksRouter from "./routes/taskRoutes.js";

const port = process.env.PORT || 8000;

const app = express();

app.use(express.static("public"));

// Middleware som konverterar inkommande JSON till ett
// JS-objekt som blir req.body
app.use(express.json());

// Delegerar inkommande anrop till tasksRouter
app.use(tasksRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});