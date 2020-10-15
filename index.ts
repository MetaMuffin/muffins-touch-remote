import Express from "express";
import { join } from "path";
import { static as estatic } from "express";
import expressWs from "express-ws";

var robot = require("robotjs");
export function setMousePos(x: number, y: number) {
    robot.moveMouse(x, y);
}
export function getMousePos(): { x: number; y: number } {
    return robot.getMousePos();
}
var mouseAcc: { x: number; y: number } = getMousePos();
var connected = false;

var app_n = Express();
var app = expressWs(app_n).app;

app.get("/", (req, res) => {
    if (!connected) res.sendFile(join(__dirname, "./public/index.html"));
    else res.send("Sorry, somebody is already connected");
});
app.use("/static", estatic(join(__dirname, "./public")));

app.ws("/ws", (ws, req) => {
    console.log("Connection incomming");
    if (connected) {
        console.log("  -> Refused");
        ws.close()
    };
    connected = true
    console.log(" -> Accepted");
    ws.on("close",() => {
        connected = false
        console.log("Connection closed");
    });
    ws.on("message", (m) => {
        try {
            var [x, y] = m
                .toString()
                .split(",")
                .map((e) => parseFloat(e));
                setMousePos(x,y)


        } catch (e) {
            console.log(`Error: ${m.toString()}`);
        }
    });
});

app.listen(8080, () => {
    console.log("Listening");
});
