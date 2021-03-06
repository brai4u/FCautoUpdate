// Modules to control application life and create native browser window
const {app, BrowserWindow, powerSaveBlocker, dialog} = require('electron');
const {autoUpdater} = require('electron-updater');

app.setAppUserModelId('Brianardiles.FlowCast');
app.setAsDefaultProtocolClient('ba-flowcast');

// prevent computer sleep
const id = powerSaveBlocker.start('prevent-app-suspension');
console.log('Power saver blocked id: ', powerSaveBlocker.isStarted(id));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 725,
    height: 628,
    titleBarStyle: 'hidden', // for macOs frameless
    minWidth: 725,
    minHeight: 628,
    icon: './src/imgs/flowcast.ico'
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // call autoupdater
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;

  setTimeout(function() {
    autoUpdater.checkForUpdates();
  }, 6000);

  autoUpdater.on('update-available', () => {
    console.log('update is available');
  });

  autoUpdater.on('update-downloaded', () => {
    const options = {
      type: 'question',
      buttons: ['No, Later', 'Yes, Install'],
      defaultId: 2,
      title: 'Question',
      message: 'Do you want install the FlowCast update?',
      detail: 'A new version wos be updated if you accept'
    };

    dialog.showMessageBox(null, options, (response) => {
      if (response == 1) {
        console.log('install accepted');
        app.removeAllListeners('window-all-closed');
        autoUpdater.quitAndInstall();
      }
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

global.appData = {
  dir: app.getPath('userData')
};
