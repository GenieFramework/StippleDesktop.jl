const { app, BrowserWindow, shell } = require('electron');
const http = require('http');

const port = process.argv[2] || '8000';

let mainWindow;

function createWindow() {
    console.log(`Creating main window and loading from port ${port}...`);
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    const fullUrl = `http://127.0.0.1:${port}`;
    console.log(`Attempting to load: ${fullUrl}`);

    checkServerAndLoad(fullUrl);

    mainWindow.on('closed', function() {
        console.log('Main window closed');
        mainWindow = null;
    });
}

app.on('ready', () => {
    console.log(`Electron app is ready, connecting to port ${port}`);
    createWindow();
});

function checkServerAndLoad(url) {
    console.log(`Checking server availability at ${url}...`);
    http.get(url, (res) => {
        if (res.statusCode === 200) {
            console.log('Server is up, loading URL...');
            mainWindow.loadURL(url);
        } else {
            console.log('Server not ready, retrying...');
            setTimeout(() => checkServerAndLoad(url), 3000);
        }
    }).on('error', (e) => {
        console.error(`Error connecting to server at ${url}: ${e.message}`);
        console.log('Retry server connection...');
        setTimeout(() => checkServerAndLoad(url), 3000);
    });
}
