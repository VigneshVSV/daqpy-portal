// https://stackoverflow.com/questions/57531216/can-i-create-a-windows-exe-from-a-react-project

const electron = require('electron')
const path = require("path");
const url = require('url');


// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800, 
        height: 600,
    })
    // and load the index.html of the app.
    // 'public' is the path where webpack bundles my app
    // mainWindow.loadURL(`file://${__dirname}/public/index.html`);
    // or the port 
    // mainWindow.loadURL('http://localhost:3000')
    const appURL = app.isPackaged? url.format({
            pathname: `${__dirname}/../build/index.html`,
            protocol: "file:",
            slashes: true,
        })
        : "http://localhost:3000";
    mainWindow.loadURL(appURL)
    
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
})