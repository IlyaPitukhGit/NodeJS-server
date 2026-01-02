import http from "http";
import fs from "fs";
import { promises as fsPromises } from "fs";

const PORT = 8081;

const sendHTML = (res, status, html) => {
    res.writeHead(status, { "Content-Type": "text/html" });
    res.end(html);
};

const requestHendler = async (request, response) => {
    // response.writeHead(200, { "Content-type": "text/html" });
    response.setHeader("Content-Type", "text/html");
    console.log(request.url);
    switch (request.url) {
        case "/":
            sendHTML(response, 200, "<h1>NodeJS</h1>");
            break;
        case "/home":
            sendHTML(response, 200, "<h1>Home</h1>");
            break;
        case "/info":
            try {
                const manifest = await fsPromises.readFile(
                    "./package.json",
                    "utf8"
                );
                response.end(JSON.stringify(manifest));
            } catch (error) {
                sendHTML(response, 404, "<h1>File Not Found</h1>");
            }
            break;
        default:
            sendHTML(response, 404, "<h1>Page not Found</h1>");
    }

    // response.end("<h1>NodeJS</h1>");
};

const server = http.createServer(requestHendler);

server.listen(PORT, (err) => {
    if (err) console.error("Error at server ", err);

    console.log("Server working at port ", PORT);
});
