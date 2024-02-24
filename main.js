const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  protocol,
  screen,
  globalShortcut,
  ipcMain,
} = require("electron");
const path = require("path");
const Store = require("electron-store");
const contextMenu = require("electron-context-menu");

Store.initRenderer();

let mainWindow;
let tray;

function createTray() {
  // Agregar el ícono a la barra de notificaciones
  const iconPath = path.join(__dirname, "icon_bartool.png"); // Reemplaza 'path-to-your-icon.png' con la ruta a tu icono
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Mostrar Aplicación",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "Salir",
      click: () => {
        app.quitting = true;
        app.exit(); // Cambiado de app.quit() a app.exit()
      },
    },
  ]);

  // Manejar doble clic en el ícono para mostrar/ocultar la ventana
  tray.on("right-click", () => {
    contextMenu.popup(mainWindow);
  });

  // Manejar doble clic en el ícono para mostrar/ocultar la ventana
  tray.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 720,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.on("focus", () => {
    globalShortcut.register("CommandOrControl+Q", () => {
      mainWindow.hide();
      // Quitar la escucha del atajo de teclado
      // Aquí puedes realizar las acciones necesarias cuando se presiona el atajo de teclado
    });
  });
  mainWindow.on("blur", () => {
    globalShortcut.unregister("CommandOrControl+Q");
  });
  // mainWindow.loadURL("https://music.youtube.com");
  mainWindow.loadFile("index.html");

  mainWindow.setMenu(null);

  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const x = width - (mainWindow.getBounds().width - 20);
  const y = 0;
  mainWindow.setPosition(x, y);
  mainWindow.on("close", function (event) {
    if (app.quitting) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
  createTray();
}

app.on("ready", () => {
  createWindow();
  // Configuración para ocultar la aplicación en el dock en macOS
  if (process.platform === "darwin") {
    app.dock.hide();

    protocol.registerFileProtocol("app", (request, callback) => {
      const url = request.url.replace("app://", "");
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    });

    app.setAsDefaultProtocolClient("app");
  }
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.exit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

// Manejar el evento 'before-quit' para limpiar la bandeja
app.on("before-quit", () => {
  tray.destroy();
});

app.on("will-quit", () => {
  // Anula el registro de todos los atajos de teclado.
  globalShortcut.unregisterAll();
});

let win;
ipcMain.on("crear-nueva-ventana", (event, file, connection_name = "") => {
  win = new BrowserWindow({
    width: 600,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.loadFile(file);
  if (connection_name !== "") {
    // se envia parametro connection_name a la nueva ventana para usarse desde script.js
    win.webContents.on("did-finish-load", () => {
      win.webContents.send("connection_name", connection_name);
    });
  }
  win.show();
});

ipcMain.handle("close-window", (event) => {
  win.close();
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  browserWindow.close();
  mainWindow.reload();
});

const shell = require("electron").shell;

contextMenu({
  // Define los elementos del menú contextual
  prepend: (defaultActions, params, browserWindow) => [
    {
      label: "Buscar en Google “{selection}”",
      // Solo se muestra al hacer clic derecho en el texto
      visible: params.selectionText.trim().length > 0,
      click: () => {
        shell.openExternal(
          `https://google.com/search?q=${encodeURIComponent(
            params.selectionText
          )}`
        );
      },
    },
    {
      label: "Contraseñas guardadas",
      // Solo se muestra al hacer clic derecho en el input
      visible: params.inputFieldType === "password",
      click: () => {
        const isMac = process.platform === "darwin";
        const { exec } = require("child_process");
        if (isMac) {
          exec("open -b com.apple.keychainaccess", (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });
        } else {
          exec("control userpasswords2");
          shell.openExternal("chrome://settings/passwords");
        }
      },
    },
  ],
  // Mostrar el menú contextual predeterminado del sistema
  showInspectElement: false,
});
