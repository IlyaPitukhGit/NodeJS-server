import express from "express";
import axios from "axios";
import router from "./booksRouter.js";
import dotenv from "dotenv";
import cors from "cors";

//Сторонній moddleware для логування
import morgan from "morgan";

//nodemon — це інструмент, який автоматично перезапускає Node.js-сервер, коли ти змінюєш файли.
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8081;

// const city = "Kyiv";
//Ключ потрібно зберігати в змінних оточення (process.ENV)
const APIKEY = process.env.APIKEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const sendHTML = (res, status, html) => {
    res.status(status).type("html").send(html);
};

//Оброка послідовна
// app.use((req, res) => {
//     // sendHTML(res, 404, "<h1>Page Not Found</h1>");
//     res.status(200).json({ name: "ilya" });
// });

//вбудований middleware для парсингу json
app.use(express.json());
//для роботи з HTML формами
app.use(express.urlencoded({ extended: true }));
//Дозволяє зробити дерикторію на сервері публічною для того щоб дани до неї доступ
app.use(express.static("public"));

//дозволяємо cross origin request на сервері

app.use(cors());

//middleware для логування кастомний
app.use((req, res, next) => {
    console.log(
        `New request\nMethod: ${req.method}\nURL: ${
            req.originalUrl
        }\nTime: ${new Date().toISOString()}\n`
    );
    next();
});

//middleware для логування сторонній
app.use(morgan("tiny"));

//Для масшбабування можна першим пареметром передати початковий шлях
app.use("/api", router);

app.get("/api/weather", async (req, res) => {
    //Нагадати про req.query.param
    // req.params
    // req.body
    // req.headers
    const { city, units = "metric" } = req.query;

    if (!city) {
        return res.status(400).json({ message: "city parametr is required" });
    }
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: APIKEY,
                units: units,
            },
        });
        const {
            name,
            main: { temp },
            weather: [{ description }],
        } = response.data;
        res.json({ name, temp, description });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//use для будь якого url
app.use((req, res) => {
    res.status(404).type("html").send("<h1>Page Not Found</h1>");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
