# electron-chess

Welcome to Electron Chess. Review previous games and play your own games as a way to complement your chess study.

# Dependencies

Electron Chess makes use of the following libraries:

- Chess.js - <https://github.com/jhlywa/chess.js>
- Chessboard.js - <https://github.com/oakmac/chessboardjs>

# Screenshots

- Landing Page:
  ![alt landing screen](screenshots/landing.png)

- Load Previous games from PGN files:
  ![alt load previous games](screenshots/load-game.png)

Play your own games to follow along with an article or a book:
![alt start your own games](screenshots/new-game.png)

### Installation

- `npm install`
- `npm run start`

### Building binaries

In order to build Electron Chess from source, follow the installation instructions above, then use one of the following commands to create binaries:

- `npm run package-mac`
- `npm run package-win`
- `npm run package-linux`
