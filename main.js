/**
 * @license
 * Copyright 2021 Kukk Péter
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const remoteMain = require('@electron/remote/main');
const path = require('path');
const url = require('url');

// Express
const express = require('express');
const express_app = express();
const express_port = 8053;

express_app.use(express.static(path.join(__dirname, 'app')))
const server = express_app.listen(express_port, () => console.log(`[EXPRESS] Running on: localhost:${express_port}`));

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections = [];

server.on('connection', connection => {
  connections.push(connection);
  connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
      console.log('Closed out remaining connections');
      process.exit(0);
  });

  setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
  }, 10000);

  connections.forEach(curr => curr.end());
  setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}

// AutoUpdater
const { autoUpdater } = require('electron-updater');

// Electron
remoteMain.initialize();
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    minWidth: 800,
    height: 650,
    minHeight: 650,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  remoteMain.enable(mainWindow.webContents);

  // and load the index.html of the app.
  // mainWindow.loadFile('app/index.html');

  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, "/app/index.html"),
  //   protocol: "file:",
  //   slashes: true
  // }));
  mainWindow.loadURL("http://localhost:8053/");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('RestartAPP', () => {
  app.relaunch();
});

// AutoUpdater
ipcMain.on('RestartAndInstall', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('QuitAndInstall', () => {
  autoUpdater.quitAndInstall(true, false);
});

ipcMain.on('downloadUpdate', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on('CheckForUpdate', () => {
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('update_available', info);
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow.webContents.send('UpdateProgress', progressObj);
})

autoUpdater.on('update-not-available', (info) => {
  mainWindow.webContents.send('NoUpdateAvailable');
})