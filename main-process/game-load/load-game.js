/* Package modules */
const { dialog } = require('electron');
const fs = require('fs');
const log = require('electron-log');
const { Chess } = require('chess.js');

const getGameInfo = (game) => {
  return game.header();
};

const getGameMoveHistory = (game) => {
  let history = game.history();

  let output = '';

  if (history && history.length > 0) {
      let step = 1;
      output = history.reduce((acc, move, i) => {
          return acc += (i % 2 === 0) ? `${step++}. ${move} `: `${move} `;
      }, '');
  }

  return output;
};

const getGameComments = (game) => {
  return game.get_comments();
};

const loadGame = (game, mainWindow) => {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ 
          name: 'PGN Files', 
          extensions: ['pgn'] 
        }]
      }).then(result => {
        fs.readFile(result.filePaths[0], (err, data) => {
            if (!err) {
                game = game || new Chess();
                let pgn = data.toString();
                let success = game.load_pgn(pgn);
                
                if (success) {
                  let header = getGameInfo(game);
                  let comments = getGameComments(game);
                  let history = getGameMoveHistory(game);
                  
                  mainWindow.webContents.send('load:game', {
                    pgn,
                    header,
                    comments,
                    history
                  });
                } else {
                  mainWindow.webContents.send('load:error');
                }
            } else {
                log.error(err);
            }
        });
      }).catch(err => {
        console.log(err);
      });

      return game;
};

module.exports = {
    getGameMoveHistory,
    loadGame
};