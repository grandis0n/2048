let board;
let score = 0;
const rows = 4;
const columns = 4;

let highScore = localStorage.getItem("2048HighScore") || 0;

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("2048HighScore", highScore);
    }
    document.getElementById("high-score").innerText = highScore;
}

function isGameOver() {
    if (hasEmptyTile()) {
        return false;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && (board[r][c] === board[r][c + 1])) {
                return false;
            }
            if (r < rows - 1 && (board[r][c] === board[r + 1][c])) {
                return false;
            }
        }
    }
    return true;
}

window.onload = function () {
    setGame();
}

function setGame() {
    clearBoard();
    score = 0;
    document.getElementById("score").innerText = score;
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    updateHighScore();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setNum();
    setNum();

}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener('keyup', (e) => {
    let moved = false;

    if (e.code === "ArrowLeft") {
        slideLeft();
        moved = true;
    } else if (e.code === "ArrowRight") {
        slideRight();
        moved = true;
    } else if (e.code === "ArrowUp") {
        slideUp();
        moved = true;
    } else if (e.code === "ArrowDown") {
        slideDown();
        moved = true;
    }

    if (moved) {
        setNum()
        document.getElementById("score").innerText = score;

        if (isGameOver()) {
            setTimeout(() => {
                alert("Игра завершена! Ваш счет: " + score);
                setGame();
            }, 100);
        }
    }
});

function clearBoard() {
    var boardContainer = document.getElementById("board");
    while (boardContainer.firstChild) {
        boardContainer.removeChild(boardContainer.firstChild);
    }
}

function filterZero(row) {
    return row.filter(num => num !== 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row)
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setNum() {
    if (!hasEmptyTile()) {
        return;
    }

    let value = Math.random() < 0.9 ? 2 : 4;

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = value;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = value.toString();
            tile.classList.add("x" + value.toString());
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return true;
            }
        }
    }
    return false;
}

