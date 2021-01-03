let board = [[0], [0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
const board_copy = [[0], [0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
let currentplayer = 1;
let firstSelection = true;
// selection[first / second][x / y]
let selections = [
  [0, 0],
  [0, 0],
];
const playerTranslation = ['Error', 'Blue', 'Red'];
const lines = document.querySelectorAll('.line');

const overlay = document.querySelector('.overlay');
const message = document.querySelector('.message');
const ok = document.querySelector('.ok');

const turn_text = document.querySelector('.turn-text');

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
  if (value != undefined) {
    switch (n) {
      case 1:
        board[0][0] = value;
        break;
      case 2:
        board[1][0] = value;
        break;
      case 3:
        board[1][1] = value;
        break;
      case 4:
        board[1][2] = value;
        break;
      case 5:
        board[2][0] = value;
        break;
      case 6:
        board[2][1] = value;
        break;
      case 7:
        board[2][2] = value;
        break;
      case 8:
        board[2][3] = value;
        break;
      case 9:
        board[2][4] = value;
        break;
      case 10:
        board[3][0] = value;
        break;
      case 11:
        board[3][1] = value;
        break;
      case 12:
        board[3][2] = value;
        break;
      case 13:
        board[3][3] = value;
        break;
      case 14:
        board[3][4] = value;
        break;
      case 15:
        board[3][5] = value;
        break;
      case 16:
        board[3][6] = value;
        break;
    }
  }
  switch (n) {
    case 1:
      return board[0][0];
      break;
    case 2:
      return board[1][0];
      break;
    case 3:
      return board[1][1];
      break;
    case 4:
      return board[1][2];
      break;
    case 5:
      return board[2][0];
      break;
    case 6:
      return board[2][1];
      break;
    case 7:
      return board[2][2];
      break;
    case 8:
      return board[2][3];
      break;
    case 9:
      return board[2][4];
      break;
    case 10:
      return board[3][0];
      break;
    case 11:
      return board[3][1];
      break;
    case 12:
      return board[3][2];
      break;
    case 13:
      return board[3][3];
      break;
    case 14:
      return board[3][4];
      break;
    case 15:
      return board[3][5];
      break;
    case 16:
      return board[3][6];
      break;
  }
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

lines.forEach((line) => {
  line.addEventListener('click', () => {
    n = parseInt(line.id.replace('line', ''));
    c = numToCoordinate(n);
    // Check if position unclaimed
    if (board[c[1]][c[0]] != 0) return;
    if (firstSelection) {
      selections[0] = c;
    } else {
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
