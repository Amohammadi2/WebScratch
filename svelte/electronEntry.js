let { BrowserWindow, app} = require("electron");
let mainWindow;

function initMainWindow() {
    let windowOptions = {
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
        }
    };
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadFile("./public/index.html");
}

app.whenReady().then(initMainWindow);
app.on("window-all-closed", (event)=>app.exit());