import express from "express";

const router = express.Router();

let nextId = 4;

const tasks = [
    { id: 1, name: "Stända", completed: false },
    { id: 2, name: "Plugga", completed: false },
    { id: 3, name: "Träna", completed: true }
];

router.get("/api/tasks", (req, res) => {

    // Serialisera array till JSON (array)
    res.json(tasks);
});

router.get("/api/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(x => x.id === id);
 
    if (!task) {
        res.sendStatus(404);
    }

    // Serialisera array till JSON (array)
    res.json(task);
});

router.post("/api/tasks", (req, res) => {

    const name = req.body.name;

    const newTask = {
        id: nextId++,
        name
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

router.delete("/api/tasks/:id", (req, res) => {

    // Plockar ut ID från sökvägen / path
    const id = Number(req.params.id);

    // Ta reda på index-plats för uppgift baserat på id
    const index = tasks.findIndex(task => task.id === id);

    // Om uppgiften inte finns kommer index vara -1, i så fall
    // returnera 404 Not Found
    if (index === -1) {
        res.sendStatus(404);
        return;
    }

    // Uppgiften fanns, radera den från arrayn
    tasks.splice(index, 1);

    // Retunrera 204 No Content för att indikera att allt gick bra
    res.sendStatus(204);
});

export default router;