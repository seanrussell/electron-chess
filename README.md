# electron-chess

Welcome to Electron Chess. Review previous games and play your own games as a way to complement your chess study.

### Dependencies

Electron Chess makes use of the following libraries:

- Chess.js - <https://github.com/jhlywa/chess.js>
- Chessboard.js - <https://github.com/oakmac/chessboardjs>

### Screenshots

<table border="0">
    <tr>
        <td align="center">
            <img alt="Landing screen" src="screenshots/landing.png" width="50%" />
        </td>
        <td valign="top">
            <ul>
                <li>
                    Load a game from an existing PGN file
                    <ul>
                        <li>Menu > Electron > Load Game</li>
                        <li>Shortcut: <em>Cmd/Ctrl+O</em></li>
                    </ul>
                </li>
                <li>
                    Start your own game 
                    <ul>
                        <li>Menu > Electron > New Game</li>
                        <li>Shortcut: <em>Cmd/Ctrl+N</em></li>
                    </ul>
                </li>
                <li>
                    Save a game that you have started and complete
                    <ul>
                        <li>Menu > Electron > Save Game</li>
                        <li>Shortcut: <em>Cmd/Ctrl+S</em></li>
                    </ul>
                </li>
                <li>
                    Close a game (Cmd/Ctrl+C)
                    <ul>
                        <li>Menu > Electron > Close Game</li>
                        <li>Shortcut: <em>Cmd/Ctrl+C</em></li>
                    </ul>
                </li>
                <li>
                    Quit the application
                    <ul>
                        <li>Menu > File > Close Window</li>
                        <li>Shortcut: <em>Cmd/Ctrl+W</em></li>
                    </ul>
                </li>
            </ul>
        </td>
    </tr>
    <tr>
        <td valign="top">
            <ul>
                <li>
                Step through existing games
                    <ul>
                        <li>To Beginning of Game (Shift+Left Arrow)</li>
                        <li>To Previous Move (Left Arrow)</li>
                        <li>To Next Move (Right Arrow)</li>
                        <li>To End of Game (Shift+Right Arrow)</li>
                    </ul>
                </li>
                <li>View annotations in the Comments box</li>
                <li>See the entire game move history in algebraic notation</li>
            </ul>
        </td>
        <td align="center">
            <img alt="Load existing games" src="screenshots/load-game.png" width="50%" />
        </td>
    </tr>
    <tr>
        <td align="center">
            <img alt="Play your own games" src="screenshots/new-game.png" width="50%" />
        </td>
        <td valign="top">
            <ul>
                <li>Start your own games to follow along with a game in an article or a book</li>
                <li>Add comments when you want to note something about the state of the games at that point</li>
                <li>See the move history in algebraic notation</li>
                <li>Save the game later once it's complete</li>
            </ul>
        </td>
    </tr>
</table>

### Installation

- `npm install`
- `npm run start`

### Sample Games

Load sample games from the <em>sample-games</em> folder.

### Building binaries

In order to build Electron Chess from source, follow the installation instructions above, then use one of the following commands to create binaries:

- `npm run package-mac`
- `npm run package-win`
- `npm run package-linux`
