# electron-chess

Welcome to Electron Chess. Review previous games and play your own games as a way to complement your chess study.

### Dependencies

Electron Chess makes use of the following libraries:

- Chess.js - <https://github.com/jhlywa/chess.js>
- Chessboard.js - <https://github.com/oakmac/chessboardjs>

### Screenshots

<table border="0">
<tr>
<td>
<figcaption>Select to load a game from an existing PGN file, start your own game, save a game that you have started and completed, or close a game.</figcaption>
</td>
<td>
<img alt="Landing screen" src="screenshots/landing.png" />
</td>
</tr>
<tr>
<td>
<figcaption>Step through existing games with the previous/next and to beginning/to end arrows.</figcaption>
</td>
<td>
<img alt="Load existing games" src="screenshots/load-game.png" />
</td>
</tr>
<tr>
<td>
<figcaption>Start your own games to follow along with a game in an article or a book</figcaption>
</td>
<td>
<img alt="Play your own games" src="screenshots/new-game.png" />
</td>
</tr>
</table>

### Installation

- `npm install`
- `npm run start`

### Building binaries

In order to build Electron Chess from source, follow the installation instructions above, then use one of the following commands to create binaries:

- `npm run package-mac`
- `npm run package-win`
- `npm run package-linux`
