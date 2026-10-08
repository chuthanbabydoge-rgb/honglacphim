const { app, BrowserWindow, dialog, shell, session } = require('electron');
const path = require('node:path');
const { pathToFileURL, fileURLToPath } = require('node:url');

const appHtml = path.resolve(__dirname, '..', 'index.html');
let mainWindow;

function isAppUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'file:' && path.resolve(fileURLToPath(url)) === appHtml;
  } catch {
    return false;
  }
}

function openExternal(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      void shell.openExternal(url.href);
    }
  } catch {
    // Ignore malformed or unsupported destinations.
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 860,
    minHeight: 620,
    show: false,
    backgroundColor: '#101010',
    autoHideMenuBar: true,
    title: 'HongLac',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isAppUrl(url)) {
      event.preventDefault();
      openExternal(url);
    }
  });
  mainWindow.on('closed', () => { mainWindow = null; });
  void mainWindow.loadURL(pathToFileURL(appHtml).href);
}

app.whenReady().then(() => {
  app.setAppUserModelId('vn.honglac.desktop');

  // Ask where to save downloads produced by the existing HTML app (for example, exports).
  session.defaultSession.on('will-download', (event, item) => {
    item.pause();
    const suggestedName = item.getFilename() || 'honglac-download';
    void dialog.showSaveDialog(mainWindow, {
      title: 'Lưu tệp từ HongLac',
      defaultPath: path.join(app.getPath('downloads'), suggestedName),
      buttonLabel: 'Lưu'
    }).then(({ canceled, filePath }) => {
      if (canceled || !filePath) {
        item.cancel();
        return;
      }
      item.setSavePath(filePath);
      item.resume();
    }).catch(() => item.cancel());
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
