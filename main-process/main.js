/* Package modules */
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
var events = require('events');

/* User defined modules */
const { createMenu } = require('./menu.js');
const { initNewGame } = require('./game-new/new-game.js');
const { getGameMoveHistory } = require('./game-load/load-game.js');

process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainMenu;
let mainWindow;
var game;
let history;
let pgn;

const myEmitter = new events.EventEmitter();

const clearBoard = () => {
    game.reset();
};

myEmitter.on('clear-board', clearBoard);

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
  app.quit();
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 440,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        },
        icon: 'icon.png'
    });

    mainWindow.loadFile('app/index.html');

    if (isDev) {
        mainWindow.openDevTools();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
        game = null;
    });

    return mainWindow;
}

app.on("ready", () => {
    if (!mainWindow) {
        mainWindow = createWindow();
        game = initNewGame(game);
        
        const menu = createMenu(game, mainWindow, isMac, isDev, myEmitter);

        mainMenu = Menu.buildFromTemplate(menu);
        Menu.setApplicationMenu(mainMenu);
    }
    
    mainWindow.on("closed", () => (mainWindow = null));
});

app.on('window-all-closed', function () {
    if (isMac) {
        app.quit();
    }
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows.length === 0) {
        createWindow();
    }
});

/* IPC communication from renderer */
ipcMain.on('game:over', (event) => {
    event.returnValue = game.game_over();
});

ipcMain.on('game:turn', (event) => {
    event.returnValue = game.turn();
});

ipcMain.on('game:move', (event, arg) => {
    let move = game.move({
        from: arg.source,
        to: arg.target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    event.returnValue = move;
});

ipcMain.on('game:position', (event) => {
    event.returnValue = game.fen();
});

ipcMain.on('game:checkmate', (event) => {
    event.returnValue = game.in_checkmate();
});

ipcMain.on('game:draw', (event) => {
    event.returnValue = game.in_draw();
});

ipcMain.on('game:check', (event) => {
    event.returnValue = game.in_check();
});

ipcMain.on('game:history', (event) => {
    event.returnValue = getGameMoveHistory(game);
});

ipcMain.on('add:comment', (event, comment) => {
    if (comment && comment.trim() !== '') {
        game.set_comment(comment);
        event.returnValue = true;
    }
});

ipcMain.on('init:game', (event, arg) => {
    pgn = arg.pgn;
    history = [...game.history()];
    game.reset();
});

ipcMain.on('move:first', (event) => {
    game.reset();
});

ipcMain.on('move:previous', (event) => {
    game.undo();
    event.returnValue = game.fen();
});

ipcMain.on('move:next', (event, i) => {
    game.move(history[i]);
    event.returnValue = game.fen();
});

ipcMain.on('move:last', (event) => {
    game.load_pgn(pgn);
    event.returnValue = game.fen();
});

ipcMain.on('enable:close', (event) => {
    let closeItem = mainMenu.getMenuItemById('close-game-menu-item');
    closeItem.enabled = true;
});

ipcMain.on('enable:save', (event) => {
    let saveItem = mainMenu.getMenuItemById('save-game-menu-item');
    saveItem.enabled = true;
});

ipcMain.on('disable:close', (event) => {
    let closeItem = mainMenu.getMenuItemById('close-game-menu-item');
    closeItem.enabled = false;
});

ipcMain.on('disable:save', (event) => {
    let closeItem = mainMenu.getMenuItemById('save-game-menu-item');
    closeItem.enabled = false;
});

ipcMain.on('get:currpos', (event) => {
    event.returnValue = game.fen();
});

ipcMain.on('undo:move', (event) => {
    game.undo();
    event.returnValue = game.fen();
});

ipcMain.on('start:over', (event) => {
    clearBoard();
});