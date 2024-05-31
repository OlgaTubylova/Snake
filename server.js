const { startGameLoop, getCurrentState, changeDirection, joinTheGame } = require('./game.js');
const fs = require('node:fs');

const { createServer } = require('node:http');

const hostname = '0.0.0.0';
const port = 3000;

const server = createServer((req, res) => {
    const { url, method } = req;
    if (url === "/state" && method === "GET") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(getCurrentState()));
        return;
    }

    if (url.startsWith("/changeDirection/") && method === "POST") {
        const parsed = url.split("/")
        const direction = parsed[2]
        const userId = parsed[3]

        changeDirection(direction, userId)

        res.statusCode = 200
        res.end()
        return
    }

    if (url.startsWith("/join/") && method === "POST") {
        const params = url.split("/")
        const userId = params[2]

        joinTheGame(userId)
        console.log("join/userId:", userId)

        res.statusCode = 200
        res.end(JSON.stringify(getCurrentState()));
        return
    }

    res.statusCode = 200;

    const data = fs.readFileSync("front/index.html", "utf8");

    res.setHeader("Content-Type", "text/html");
    res.end(data);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


startGameLoop();