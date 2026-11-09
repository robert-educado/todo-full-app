import express from "express";
import db from "../db/database.js";

const router = express.Router();

router.get("/api/tasks", (req, res) => {

    // Här förbereder vi vår SQL fråga samt kör den (all()).
    const tasks = db
        .prepare("SELECT * FROM tasks")
        .all();

    // Serialisera array till JSON (array)
    res.json(tasks);
});

router.get("/api/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);
 
    if (!task) {
        res.sendStatus(404);
    }

    // Serialisera array till JSON (array)
    res.json(task);
});

// POST /api/tasks
// {
//    "name": "Städa"
// }
router.post("/api/tasks", (req, res) => {

    // Plocka ut name från request body (req.body)
    // Nedan är hur req.body ser ut
    // {
    //    name: "Städa"
    // }    
    const name = req.body.name;

    // Vi kör en INSERT INTO och lägger till uppgiften till databasen
    const result = db
        .prepare("INSERT INTO tasks (name) VALUES (?)")
        .run(name);

    // Vi hämtar nu den skapade uppgiften från databasen, för att 
    // sen returnera den till klienten, där lastInsertRowId håller
    // ID för den skapade raden
    const createdTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(result.lastInsertRowid);

    res.status(201).json(createdTask);
});

// DELETE /api/tasks/1
router.delete("/api/tasks/:id", (req, res) => {

    // Plockar ut ID från sökvägen / path
    const id = Number(req.params.id);

    // Kör SQL DELETE-kommando för att radera uppgiften
    var result = db
        .prepare("DELETE FROM tasks WHERE id = ?")
        .run(id);

    // changes = antalet rader som påverkats
    // results.change > 0
    const deleted = result.changes > 0;  // true/false

    if (!deleted) {
        res.sendStatus(404);
        return;
    }

    // Returnera 204 No Content för att indikera att 
    // uppgiften har raderats
    res.sendStatus(204);
});

export default router;