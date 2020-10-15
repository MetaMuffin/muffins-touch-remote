

var ws;
var lx = 0, ly = 0;
var selectMode = false;

var sel = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
}

function selMode(b) {
    selectMode = b
    document.body.style.backgroundColor = b ? "#000044" : "#000000"
    setTimeout(() => selMode(false),5000)
}
function updateArea() {
    var e = document.getElementById("area")
    e.style.left = `${sel.x1}px`
    e.style.top = `${sel.y1}px`
    e.style.width = `${sel.x2 - sel.x1}px`
    e.style.height = `${sel.y2 - sel.y1}px`
}

var [sw,sh] = [1920,1080]

function move(x,y){
    var [xx,yy] = [
        ((x - sel.x1) / (sel.x2 - sel.x1)) * sw,
        ((y - sel.y1) / (sel.y2 - sel.y1)) * sh
    ]
    ws.send(`${xx.toString()},${yy.toString()}`)
}

window.onload = function load() {
    ws = new WebSocket(`ws://${window.location.host}/ws`)
    var el = document.body
    ws.onopen = () => {
        console.log("WS Open");

        el.addEventListener("touchstart", function (ev) {
            if (selectMode) {
                sel.x1 = ev.touches[0].screenX
                sel.y1 = ev.touches[0].screenY
                updateArea()
            } else {
                move(ev.touches[0].screenX,ev.touches[0].screenY)
            }
        })
        el.addEventListener("touchmove", function (ev) {
            if (selectMode) {
                sel.x2 = ev.touches[0].screenX
                sel.y2 = ev.touches[0].screenY
                updateArea()
            } else {
                move(ev.touches[0].screenX,ev.touches[0].screenY)
            }
        })
        /*function touchend(ev) {
            if (selectMode) {
                sel.x2 = ev.touches[0].screenX
                sel.y2 = ev.touches[0].screenY
                updateArea()
                selMode(false)
            }
        }
        el.addEventListener("touchcancel", touchend)
        el.addEventListener("touchend", touchend)*/
    }
    ws.onclose = () => {
        console.log("WS Close");
        el.onmousemove = undefined
        el.onmousedown = undefined
        el.classList.add("error")
        el.textContent = "Connection Closed"
    }
}