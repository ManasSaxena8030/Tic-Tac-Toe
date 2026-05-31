// DOM Selectors
const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset");
const clearScoresBtn = document.querySelector("#clear-scores");
const playAgainBtn = document.querySelector("#NEWGAME");
const msgContainer = document.querySelector("#msg-container");
const message = document.querySelector("#message");

// Game State
let isOTurn = false; // Player X starts first
let isGameActive = true;

// Scoreboard State
let scores = {
    x: parseInt(localStorage.getItem("tictactoe-score-x")) || 0,
    o: parseInt(localStorage.getItem("tictactoe-score-o")) || 0,
    ties: parseInt(localStorage.getItem("tictactoe-score-ties")) || 0
};

// Win Patterns
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

// Initialize Scoreboard UI
const updateScoreboardUI = () => {
    document.getElementById("score-x").innerText = scores.x;
    document.getElementById("score-o").innerText = scores.o;
    document.getElementById("score-ties").innerText = scores.ties;
};

// Reset Game Board
const resetBoard = () => {
    isOTurn = false;
    isGameActive = true;
    
    // Reset indicator styling
    updateTurnIndicator();
    
    // Reset all cells
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
        box.classList.remove("x-value", "o-value", "win-highlight");
    });
    
    // Hide modal overlay
    msgContainer.classList.add("hide");
};

// Reset Scores
const clearScores = () => {
    scores = { x: 0, o: 0, ties: 0 };
    localStorage.setItem("tictactoe-score-x", 0);
    localStorage.setItem("tictactoe-score-o", 0);
    localStorage.setItem("tictactoe-score-ties", 0);
    updateScoreboardUI();
};

// Update Turn Indicator Slider
const updateTurnIndicator = () => {
    const turnIndicator = document.getElementById("turn-indicator");
    const turnXSlot = document.getElementById("turn-x-slot");
    const turnOSlot = document.getElementById("turn-o-slot");
    
    if (isOTurn) {
        turnIndicator.classList.add("turn-o-active");
        turnOSlot.classList.add("active");
        turnXSlot.classList.remove("active");
    } else {
        turnIndicator.classList.remove("turn-o-active");
        turnXSlot.classList.add("active");
        turnOSlot.classList.remove("active");
    }
};

// Show Winner/Draw Overlay
const showResultModal = (result) => {
    const modalBadge = document.getElementById("modal-badge");
    const messageTitle = document.getElementById("message-title");
    
    // Remove old state classes
    msgContainer.classList.remove("win-x", "win-o", "win-tie");
    
    if (result === "Tie") {
        msgContainer.classList.add("win-tie");
        modalBadge.innerText = "🤝";
        messageTitle.innerText = "It's a Draw!";
        message.innerText = "Well played by both sides. No winner this time!";
    } else {
        msgContainer.classList.add(result === "X" ? "win-x" : "win-o");
        modalBadge.innerText = "🏆";
        messageTitle.innerText = "Victory!";
        message.innerText = `Player ${result} has conquered the arena!`;
    }
    
    msgContainer.classList.remove("hide");
};

// Check Game Status
const checkWin = () => {
    let roundWon = false;
    let winningPattern = null;

    for (let pattern of winPatterns) {
        const cellA = boxes[pattern[0]].innerText;
        const cellB = boxes[pattern[1]].innerText;
        const cellC = boxes[pattern[2]].innerText;

        if (cellA !== "" && cellB !== "" && cellC !== "") {
            if (cellA === cellB && cellB === cellC) {
                roundWon = true;
                winningPattern = pattern;
                break;
            }
        }
    }

    if (roundWon) {
        isGameActive = false;
        
        // Disable remaining cells immediately
        boxes.forEach(box => box.disabled = true);
        
        // Highlight winning cells
        winningPattern.forEach(index => {
            boxes[index].classList.add("win-highlight");
        });
        
        // Get winner mark (✕ or ◯)
        const winnerMark = boxes[winningPattern[0]].innerText;
        const winner = winnerMark === "✕" ? "X" : "O";
        
        // Update Score state
        if (winner === "X") {
            scores.x++;
            localStorage.setItem("tictactoe-score-x", scores.x);
        } else {
            scores.o++;
            localStorage.setItem("tictactoe-score-o", scores.o);
        }
        updateScoreboardUI();
        
        // Reveal result modal with minor delay
        setTimeout(() => {
            showResultModal(winner);
        }, 700);
        return;
    }

    // Check for Tie (All cells filled)
    let isDraw = true;
    for (let box of boxes) {
        if (box.innerText === "") {
            isDraw = false;
            break;
        }
    }

    if (isDraw) {
        isGameActive = false;
        scores.ties++;
        localStorage.setItem("tictactoe-score-ties", scores.ties);
        updateScoreboardUI();
        
        setTimeout(() => {
            showResultModal("Tie");
        }, 700);
    }
};

// Cell Click Handler
boxes.forEach(box => {
    box.addEventListener("click", () => {
        if (!isGameActive || box.innerText !== "") return;
        
        if (isOTurn) {
            box.innerText = "◯";
            box.classList.add("o-value");
            isOTurn = false;
        } else {
            box.innerText = "✕";
            box.classList.add("x-value");
            isOTurn = true;
        }
        
        box.disabled = true;
        updateTurnIndicator();
        checkWin();
    });
});

// Event Listeners
resetBtn.addEventListener("click", resetBoard);
clearScoresBtn.addEventListener("click", clearScores);
playAgainBtn.addEventListener("click", resetBoard);

// Initial Load Setup
updateScoreboardUI();
updateTurnIndicator();
