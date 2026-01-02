import express from "express";
const router = express.Router();

router
    .get("/books", (req, res) => {
        res.json({ books: [{ title: "How many", author: "Frankin" }] });
    })

    .post("/books", (req, res) => {
        res.json({ books: [{ title: "How many post", author: "Frankin" }] });
    });

export default router;
