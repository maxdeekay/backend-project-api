const express = require("express");
const jwt = require("jsonwebtoken");
const Consumable = require("../models/Consumable");

module.exports = (app) => {
    const router = express.Router();

    // admin view
    app.get("/admin/view", authenticateToken, (req, res) => {
        res.json({ message: "Protected route" });
    });

    // add dish
    app.post("/admin/add", authenticateToken, async (req, res) => {
        const { title, ingredients, price } = req.body;
        
        if (!title || !ingredients || !price) return res.status(400).json({ error: "Saknar titel, ingredienser eller pris." });

        // save consumable
        const consumable = new Consumable({ title, ingredients, price });
        await consumable.save();

        res.status(201).json({ message: "Rätt tillagd" });
    });

    // delete dish
    app.post("/admin/delete/:id", authenticateToken, async (req, res) => {
        try {
            const id = req.params.id;
            const result = await Consumable.findOneAndDelete({_id: id});
            if (!result) return res.status(404).json({ message: "Hittar inte maträtt." });
            return res.status(200).json({ message: "Maträtt har tagits bort." });
        } catch (error) {
            res.status(500).json({ error: "Server error." });
        }
    });

    // update dish
    app.post("/admin/update/:id", async (req, res) => {
        const id = req.params.id;
        const newConsumable = req.body;

        try {
            const result = await Consumable.findOneAndUpdate(
                { _id: id }, // find document by id
                newConsumable, // new consumable to save
                { new: true, runValidators: true }
            );

            if (!result) return res.status(404).json({ message: "Hittar inte maträtt." });
            res.status(200).json({ message: "Rätt uppdaterad", updatedConsumable: result });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    });

    return router;
}

// validate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) res.status(401).json({ message: "Not authorized for this route - token missing" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) return res.status(403).json({ message: "Invalid JWT" });

        req.username = username;
        next();
    });
}