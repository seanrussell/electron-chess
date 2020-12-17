const { ipcRenderer } = require('electron');

let board;
let history;
let comments = {};
let index = 0;

const extractSummary = (header) => {
    let summary = {};
    let key;
    let keys = Object.keys(header);
    let n = keys.length;
    while (n--) {
        key = keys[n];
        summary[key.toLowerCase()] = header[key];
    }
    return summary;
};

const setupGameInfo = (summary) => {
    if (summary.event) {
        let e = document.querySelector('#event-info');
        e.innerHTML = summary.event;
    }

    if (summary.site) {
        let site = document.querySelector('#site-info');
        site.innerHTML = `<span class="new badge" data-badge-caption="${summary.site}"><i class="fas fa-map-marker-alt"></i></span>`;
    }

    if (summary.date) {
        let dateInfo = document.querySelector('#date-info');
        dateInfo.innerHTML = `<span class="new badge" data-badge-caption="${summary.date}"><i class="fas fa-calendar-alt"></i></span>`;
    }

    if (summary.result) {
        let resultInfo = document.querySelector('#result-info');
        resultInfo.innerHTML = `<span class="new badge" data-badge-caption="${summary.result}"><i class="fas fa-poll"></i></span>`;
    }

    if (summary.black) {
        let black = document.querySelector('#player-black');
        black.innerHTML = `<strong>Black</strong> <em>${summary.black}</em>`;
    }

    if (summary.white) {
        let white = document.querySelector('#player-white');
        white.innerHTML = `<strong>White</strong> <em>${summary.white}</em>`;
    }
};

const onDragStart = (source, piece, position, orientation) => {
    let gameOver = ipcRenderer.sendSync('game:over');
    if (gameOver) {
        return false;
    }
  
    let turn = ipcRenderer.sendSync('game:turn');

    if ((turn === 'w' && piece.search(/^b/) !== -1) ||
        (turn === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
};
  
const onDrop = (source, target) => {
    let move = ipcRenderer.sendSync('game:move', { source, target });

    if (move === null) {
        return 'snapback';
    }
  
    updateStatus(target);
};
  
const onSnapEnd = () => {
    board.position(ipcRenderer.sendSync('game:position'));
};
  
const updateStatus = (move) => {
    let historyBlock = document.querySelector('#history-block .card-content p');
    historyBlock.innerHTML = ipcRenderer.sendSync('game:history');
    
    let moveColor = 'White';
    let turn = ipcRenderer.sendSync('game:turn');
    if (turn === 'b') {
        moveColor = 'Black';
    }
    
    let status = '';
    let statusBlock = document.querySelector('#status');

    if (ipcRenderer.sendSync('game:checkmate')) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
        result = (moveColor === 'White') ? '1-0': '0-1';
        ipcRenderer.send('enable:save');
    } else if (ipcRenderer.sendSync('game:draw')) {
        status = 'Game over, drawn position';
        result = '1/2-1/2';
        ipcRenderer.send('enable:save');
    } else {
        status = moveColor + ' to move';
  
        if (ipcRenderer.sendSync('game:check')) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    statusBlock.innerHTML = status;
};

const moveFirst = () => {
    ipcRenderer.send('move:first');
    board.start();
    index = 0;
    let annotations = document.querySelector('#annotations-block textarea');
    annotations.value = '';
    if (comments.length > 0 && comments[index - 1] !== null) { 
        annotations.innerHTML = comments[index - 1].comment;
    }
};

const movePrevious = () => {
    if (board) {
        let res = ipcRenderer.sendSync('move:previous');
        board.position(res);
        index -= 1;
        if (index < 0) {
        index = 0;
        }
        let annotations = document.querySelector('#annotations-block textarea');
        annotations.value = '';
        if (comments.length > 0 && comments[index - 1] !== null) { 
            annotations.innerHTML = comments[index - 1].comment;
        }
    }
};

const moveNext = () => {
    if (board) {
        let res = ipcRenderer.sendSync('move:next', index);
        board.position(res);
        index += 1;
        let fen = ipcRenderer.sendSync('get:currpos');
        if (comments[fen]) {
            let annotations = document.querySelector('#annotations-block textarea');
            annotations.value = comments[fen];
        }
    }
};

const moveLast = () => {
    let res = ipcRenderer.sendSync('move:last');
    board.position(res);
    index = history.length;
    let annotations = document.querySelector('#annotations-block textarea');
    annotations.value = '';
    if (comments.length > 0 && comments[index - 1] !== null) { 
        annotations.innerHTML = comments[index - 1].comment;
    }
};

/* IPC communication from main process */
ipcRenderer.on('load:game', (e, gameInfo) => {
    history = gameInfo.history;
    comments = gameInfo.comments.reduce((acc, comment) => {
        return {
            ...acc,
            [comment.fen]: comment.comment
        };
    }, {});

    document.querySelector('#status').style.display = 'none';
    let annotations = document.querySelector('#annotations-block textarea');
    annotations.value = '';

    if (gameInfo.header) {
        setupGameInfo(extractSummary(gameInfo.header));
    }

    document.querySelector('#annotations-block textarea').readOnly = true;
    document.querySelector('#add-comment').style.display = 'none';

    let historyBlock = document.querySelector('#history-block .card-content p');
    historyBlock.innerHTML = history;

    var cfg = {
        pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
        position: 'start'
    };

    document.querySelector('.home').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    document.querySelector('.buttons').style.display = 'block';

    board = new Chessboard('game-board', cfg);

    ipcRenderer.send('init:game', { pgn: gameInfo.pgn });
    ipcRenderer.send('enable:close');
});

ipcRenderer.on('load:error', (e) => {
    M.toast({
        html: 'Your game could not be loaded due to a problem reading the file.',
        classes: 'red'
    });
});

ipcRenderer.on('save:error', (e) => {
    M.toast({
        html: 'Your game could not be saved due to a problem creating the file.',
        classes: 'red'
    });
});

ipcRenderer.on('new:game', (e, header) => {
    index = 0;
    console.info(onDragStart);
    let config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };

    document.querySelector('.home').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    document.querySelector('#status').style.display = 'block';

    if (header) {
        setupGameInfo(extractSummary(header));
    }

    let statusBlock = document.querySelector('#status');
    statusBlock.innerHTML = 'White to move';

    document.querySelector('.buttons').style.display = 'none';

    let historyBlock = document.querySelector('#history-block .card-content p');
    historyBlock.innerHTML = '';

    document.querySelector('#annotations-block textarea').readOnly = false;
    document.querySelector('#add-comment').style.display = 'block';

    board = Chessboard('game-board', config);

    ipcRenderer.send('enable:close');
});

ipcRenderer.on('close:game', (e) => {
    document.querySelector('.game').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    document.querySelector('.home').style.display = 'block';

    ipcRenderer.send('disable:close');
    ipcRenderer.send('disable:save');

    board.destroy();
});

ipcRenderer.on('save:game', (e) => {
    // Maybe prompt for info like event/site/date/result/black player/white player

});

ipcRenderer.on('save:success', (e) => {
    M.toast({
        html: 'Your game was saved!',
        classes: 'green'
    });
});

/* DOM event handlers */
const firstBtn = document.getElementById('first-btn');
firstBtn.addEventListener('click', e => {
    e.preventDefault();
    moveFirst();
});

const prevBtn = document.getElementById('prev-btn');
prevBtn.addEventListener('click', e => {
    e.preventDefault();
    movePrevious();
});

const nextBtn = document.getElementById('next-btn');
nextBtn.addEventListener('click', e => {
    e.preventDefault();
    moveNext();
});

const lastBtn = document.getElementById('last-btn');
lastBtn.addEventListener('click', e => {
    e.preventDefault();
    moveLast();
});

const addCommentBtn = document.getElementById('add-comment');
addCommentBtn.addEventListener('click', e => {
    e.preventDefault();
    let commentBlock = document.querySelector('#annotations-block textarea');
    let comment = commentBlock.value;
    if (comment && comment.trim() !== '') {
        let success = ipcRenderer.sendSync('add:comment', comment.trim());
        if (success) {
            M.toast({
                html: 'Comment was added!',
                classes: 'green'
            });
            commentBlock.value = '';
        }
    }
});

document.addEventListener('keydown', (e) => {
    let isShift = e.shiftKey;
    let event = window.event ? window.event : e;
    if (event.keyCode === 37 && !isShift) {
        movePrevious();
    } else if (event.keyCode === 39 && !isShift) {
        moveNext();
    } else if (event.keyCode === 37 && isShift) {
        moveFirst();
    } else if (event.keyCode === 39 && isShift) {
        moveLast();
    }
});
