/* Package modules */
const { dialog } = require('electron');
const fs = require('fs');
const { Chess } = require('chess.js');

const initNewGame = (game) => {
    game = new Chess();
    game.reset();
    game.header('White','Unknown Player','Black','Unknown Player','Event','Unknown Event','Site','Unknown Site','Date',new Date().toISOString().split('T')[0]);
    return game;
};

const newGame = (game, mainWindow, myEmitter) => {
    game = initNewGame(game);
    
    myEmitter.emit('clear-board');
    mainWindow.webContents.send("new:game", game.header());
};

const saveGame = (game, mainWindow) => {
    dialog.showSaveDialog(mainWindow, {
        title: 'Save Game',
        defaultPath: 'My Game',
        filters: [ { 
                name: 'PGN Files', 
                extensions: ['pgn'] 
        }]
    }).then(result => {
        if (!result.canceled) {
            fs.writeFile(result.filePath.toString(), game.pgn(), (err) => {
                if (err) {
                    throw err;
                }
                mainWindow.webContents.send('save:success');
            });
        }
    }).catch((err) => {
        mainWindow.webContents.send('save:error');
    });
};

module.exports = {
    initNewGame,
    newGame,
    saveGame
};