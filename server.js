const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); // Enables JSON parsing

const users = []; // In-memory user storage

// ✅ Root Route (Fixes "Cannot GET /" issue)
app.get("/", (req, res) => {
    res.send("SCIM API is running successfully");
});

// ✅ GET Users (SCIM Standard)
app.get("/scim/v2/Users", (req, res) => {
    res.json({
        "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
        "totalResults": users.length,
        "Resources": users
    });
});

// ✅ Create a User (SCIM POST)
app.post("/scim/v2/Users", (req, res) => {
    const newUser = {
        id: users.length + 1,
        ...req.body
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// ✅ Update a User (SCIM PUT)
app.put("/scim/v2/Users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], ...req.body };
    res.json(users[userIndex]);
});

// ✅ Delete a User (SCIM DELETE)
app.delete("/scim/v2/Users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users.splice(userIndex, 1);
    res.status(204).send();
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SCIM API running on port ${PORT}`));
