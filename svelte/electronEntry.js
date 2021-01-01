let { BrowserWindow, app, dialog, ipcMain } = require("electron");
let mainWindow;

function initWrapper() {
    initMainWindow();
    initIPCMainEvents();
}

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

function initIPCMainEvents() {
    ipcMain.on("select-directory", (event) => {
        let path = dialog.showOpenDialog(mainWindow, {
            properties: ["openDirectory"]
        });
        path.then((result) => {
            if (result.canceled) return;
            event.reply("directory-selected", result.filePaths[0]);
        })
    });
}

app.whenReady().then(initWrapper);
app.on("window-all-closed", (event)=>app.exit());