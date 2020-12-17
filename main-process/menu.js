/* User defined modules */
const { newGame, saveGame } = require('./game-new/new-game.js');
const { loadGame } = require('./game-load/load-game.js');
const { closeGame } = require('./game-close/close-game.js');

const createMenu = (game, mainWindow, isMac, isDev, myEmitter) => {
    const menu = [
        ...(isMac
        ? [{
                label: "Electron Chess",
                submenu: [{
                    label: "Open Game",
                    accelerator: 'CmdOrCtrl+O',
                    click: function() { loadGame(game, mainWindow); }
                }, {
                    label: "New Game",
                    accelerator: 'CmdOrCtrl+N',
                    click: function() { newGame(game, mainWindow, myEmitter); }
                }, {
                    label: "Save Game",
                    id: 'save-game-menu-item',
                    enabled: false,
                    accelerator: 'CmdOrCtrl+S',
                    click: function() { saveGame(game, mainWindow); }
                }, {
                    label: "Close Game",
                    id: 'close-game-menu-item',
                    enabled: false,
                    accelerator: 'CmdOrCtrl+C',
                    click: () => { closeGame(mainWindow); }
                }]
            }]
        : []),
        {
        role: "fileMenu"
        },
    ...(isDev
        ? [{
            label: "Developer",
            submenu: [{
                role: "reload"
                }, {
                role: "forcereload"
                }, {
                type: "separator"
                }, {
                role: "toggledevtools"
                }]
            }]
        : [])
    ];

    return menu;
};

module.exports = {
    createMenu
};