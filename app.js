const {app, BrowserWindow, ipcMain} = require('electron');
const url = require("url");
const path = require('path');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `./dist/test-electron/index.html`),
            protocol: 'file:',
            slashes: true
        })
    );

    mainWindow.webContents.openDevTools();
}

app.whenReady().then( () => {
    createWindow()
})

ipcMain.on('prova', () => {
    console.log('prova ricevuta da app.js');
    mainWindow.webContents.send('risposta');
})