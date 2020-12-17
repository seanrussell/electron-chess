const closeGame = (mainWindow) => {
    mainWindow.webContents.send("close:game");
};

module.exports = {
    closeGame
};