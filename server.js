const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const admin = require("./routes/admin");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

// connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB...");
}).catch((error) => {
    console.log("Error connecting to database: " + error);
    process.exit(1);
});

// models
const User = require("./models/User");
const Consumable = require("./models/Consumable");

// consumables routes
app.get("/consumables", async (req, res) => {
    try {
        const consumables = await Consumable.find({});
        res.status(200).json({ consumables });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
});

// admin routes
app.use("/admin", authenticateToken, admin(app));

// login user
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // validate
        if(!username || !password) return res.status(400).json({ error: "Invalid input" });

        // check credentials
        const user = await User.findOne({ username });
        if(!user) return res.status(401).json({ error: "Incorrect username/password" });

        // check password
        const isPasswordMatch = await user.comparePassword(password);
        
        if(!isPasswordMatch) {
            return res.status(401).json({ error: "Incorrect username/password" });
        } else {
            // create JWT
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
            const response = {
                message: "Login successful",
                token: token
            }
            res.status(200).json({ response });
        }

    } catch (error) {
        res.status(500).json({ error: "Server error."} );
    }
});

// register new user - only used to add an admin account
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // validate
        if(!username || !password) return res.status(400).json({ error: "Missing username or password" });

        // save user
        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: "User created!"} );

    } catch(error) {
        res.status(500).json({ error: "User already exists" });
    }
});

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

// start server
app.listen(port, () => {
    console.log("Server is running on port: " + port);
});

//
process.addListener("uncaughtException", (error) => {
    console.log("error: " + error);
});

process.addListener("unhandledRejection", (error) => {
    console.log("error: " + error);
});