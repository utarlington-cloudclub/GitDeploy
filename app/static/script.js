const cells = document.querySelectorAll(".cell");

let currentBoard = ["","","","","","","","",""];
let scores = { X: 0, O: 0 };
let gameOver = false;

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
];

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (gameOver) return;

        const index = parseInt(cell.getAttribute("data-index"));

        fetch("/move", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ index: index })
        })
        .then(res => res.json())
        .then(data => {
            currentBoard = data.board;
            updateBoard(currentBoard);
            checkWinner();
        });
    });
});

function updateBoard(board) {
    cells.forEach((cell, i) => {
        cell.textContent = board[i];
    });
}

function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        if (
            currentBoard[a] &&
            currentBoard[a] === currentBoard[b] &&
            currentBoard[a] === currentBoard[c]
        ) {
            gameOver = true;
            const winner = currentBoard[a];
            scores[winner]++;

            updateScoreboard();
            document.getElementById("status").textContent = `${winner} wins!`;

            return;
        }
    }

    // Draw
    if (!currentBoard.includes("")) {
        gameOver = true;
        document.getElementById("status").textContent = "It's a draw!";
        return;
    }

    // Show current player
    const nextPlayer = currentBoard.filter(x => x === "X").length >
                       currentBoard.filter(x => x === "O").length
                       ? "O" : "X";

    document.getElementById("status").textContent =
        `Current Player: ${nextPlayer}`;
}

function updateScoreboard() {
    document.getElementById("score").textContent =
        `X: ${scores.X} | O: ${scores.O}`;
}

function resetGame() {
    fetch("/reset")
        .then(res => res.json())
        .then(data => {
            currentBoard = data.board;
            gameOver = false;
            updateBoard(currentBoard);
            document.getElementById("status").textContent = "Current Player: X";
        });
}