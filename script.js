let board = [[0], [0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
const board_copy = [[0], [0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
let currentplayer = 1;
let firstSelection = true;
// selections[first / second][y / x]
let selections = [
  [0, 0],
  [0, 0],
];
let selCoordinate = [0, 0];
const playerTranslation = ['Error', 'Blue', 'Red'];
const animCanvas = document.querySelector('#animationCanvas');
const main = document.querySelector('main');

const turn_text = document.querySelector('.turn-text');

const lines = document.querySelectorAll('.line');

const overlay = document.querySelector('.overlay');
const message = document.querySelector('.message');
const ok = document.querySelector('.ok');

let ctx = animCanvas.getContext('2d');

function numToCoordinate(n) {
  var x = 0,
    y = 0;
  if (n >= 2 && n <= 4) {
    y = 1;
    x = n - 2;
  }
  if (n >= 5 && n <= 9) {
    y = 2;
    x = n - 5;
  }
  if (n >= 10 && n <= 16) {
    y = 3;
    x = n - 10;
  }
  return [x, y];
}
function boardByNum(n, value) {
  var c = numToCoordinate(n);
  if (value != undefined) {
    board[c[1]][c[0]] = value;
  }
  return board[c[1]][c[0]];
}
function changePlayer(player) {
  if (player != undefined) {
    currentplayer = player;
  } else {
    if (currentplayer == 1) {
      currentplayer = 2;
    } else {
      currentplayer = 1;
    }
  }
}
function checkForWin() {
  var win = true;
  board.forEach((y) => {
    y.forEach((x) => {
      if (x == 0) {
        win = false;
      }
    });
  });
  if (win) {
    if (currentplayer == 1) {
      var winner = 2;
    } else {
      var winner = 1;
    }
    popup(playerTranslation[winner] + ' won!');
    // Reset Board
    board = JSON.parse(JSON.stringify(board_copy));
  }
}
function popup(messageText, remove) {
  if (!remove) {
    overlay.classList.add('active');
  } else {
    overlay.classList.remove('active');
  }
  message.innerText = messageText;
}
function updateUi() {
  lines.forEach((line) => {
    switch (boardByNum(parseInt(line.id.replace('line', '')))) {
      case 0:
        line.classList.remove('crossed1');
        line.classList.remove('crossed2');
        break;
      case 1:
        line.classList.add('crossed1');
        line.classList.remove('crossed2');
        break;
      case 2:
        line.classList.add('crossed2');
        line.classList.remove('crossed1');
        break;
    }
  });
  if (currentplayer == 2) {
    turn_text.innerText = 'Red';
    turn_text.classList.replace('blue', 'red');
  } else {
    turn_text.innerText = 'Blue';
    turn_text.classList.replace('red', 'blue');
  }
}

function animateSelection(e) {
  selCoordinate = [e.pageX, e.pageY];
  console.log(`1. Position: ${selCoordinate[0]}, ${selCoordinate[1]}`);
}

animCanvas.width = window.innerWidth;
animCanvas.height = window.innerHeight;

main.addEventListener('mousemove', (e) => {
  if (!firstSelection) {
    x = e.pageX;
    y = e.pageY;
    console.log(`2. Position: ${x}, ${y}`);
    ctx.clearRect(0, 0, animCanvas.width, animCanvas.height);
    ctx.beginPath();
    ctx.moveTo(selCoordinate[0], selCoordinate[1]);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
  }
});

lines.forEach((line) => {
  line.addEventListener('click', (e) => {
    n = parseInt(line.id.replace('line', ''));
    c = numToCoordinate(n);
    // Check if position unclaimed
    if (board[c[1]][c[0]] != 0) return;
    // Test which selection
    if (firstSelection) {
      animateSelection(e);
      selections[0] = c;
    } else {
      ctx.clearRect(0, 0, animCanvas.width, animCanvas.height);
      selections[1] = c;

      // Check if selection are in the same line
      if (selections[0][1] != selections[1][1]) {
        firstSelection = true;
        return;
      }

      // determine the length of selection
      diff = Math.abs(selections[0][0] - selections[1][0]) + 1;
      // test if valid selection
      y = selections[0][1];
      for (var i = 0; i < diff; i++) {
        x = Math.min(selections[0][0], selections[1][0]) + i;
        if (board[y][x] != 0) {
          firstSelection = true;
          return;
        }
      }
      // save current turn
      for (var i = 0; i < diff; i++) {
        x = Math.min(selections[0][0], selections[1][0]) + i;
        board[y][x] = currentplayer;
      }
      checkForWin();
      changePlayer();
      updateUi();
    }
    firstSelection = !firstSelection;
  });
});

ok.addEventListener('click', () => {
  popup('Error', true);
});
