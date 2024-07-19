document.addEventListener('DOMContentLoaded', () => {
    const shootYourselfButton = document.getElementById('shoot-yourself');
    const shootOtherButton = document.getElementById('shoot-other');
    const resultText = document.getElementById('result');
    const bulletsStatus = document.getElementById('bullets-status');
    const roundsStatus = document.getElementById('rounds-status');
    const gameStatus = document.getElementById('game-status');
    const replayButton = document.getElementById('replay');
    const skullImage = document.getElementById('skull');

    let bullets;
    let currentRound;
    let playerTurn;

    function initGame() {
        const liveBulletsCount = Math.max(1, Math.floor(Math.random() * 5) + 1);
        const blankBulletsCount = 6 - liveBulletsCount;
        bullets = new Array(liveBulletsCount).fill(1).concat(new Array(blankBulletsCount).fill(0));
        shuffle(bullets);
        currentRound = 1;
        playerTurn = true;
        updateStatus();
        gameStatus.textContent = "Your Turn";
        resultText.textContent = "";
        shootYourselfButton.disabled = false;
        shootOtherButton.disabled = false;
        replayButton.style.display = "none";
        skullImage.style.display = "none";
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function updateStatus() {
        const liveBullets = bullets.filter(bullet => bullet === 1).length;
        const blankBullets = bullets.length - liveBullets;
        bulletsStatus.textContent = `Live Bullets: ${liveBullets}, Blank Bullets: ${blankBullets}`;
        roundsStatus.textContent = `Round: ${currentRound}`;
    }

    function getResult() {
        const bullet = bullets.pop();
        currentRound++;
        return bullet === 1;
    }

    function maybeMiss() {
        return Math.random() < 0.2;
    }

    function computerTurn() {
        setTimeout(() => {
            const decision = Math.random() < 0.5;
            if (maybeMiss()) {
                resultText.textContent = `Computer's turn: The robot missed the shot.`;
                updateStatus();
                if (bullets.length === 0) {
                    resultText.textContent = "The game is over, all bullets have been used.";
                    gameStatus.textContent = "Reloading bullets...";
                    initGame();
                } else {
                    playerTurn = true;
                    gameStatus.textContent = "Your Turn";
                }
            } else {
                if (decision) {
                    const result = getResult();
                    if (result) {
                        resultText.textContent = `Computer's turn: The robot shot himself.`;
                        gameStatus.textContent = "Game Over. You win!";
                        shootYourselfButton.disabled = true;
                        shootOtherButton.disabled = true;
                        replayButton.style.display = "block";
                    } else {
                        resultText.textContent = `Computer's turn: Click! The robot survived.`;
                        updateStatus();
                        if (bullets.length === 0) {
                            resultText.textContent = "The game is over, all bullets have been used.";
                            gameStatus.textContent = "Reloading bullets...";
                            initGame();
                        } else {
                            playerTurn = true;
                            gameStatus.textContent = "Your Turn";
                        }
                    }
                } else {
                    const result = getResult();
                    if (result) {
                        resultText.textContent = `Computer's turn: The robot shot you.`;
                        gameStatus.textContent = "Game Over. You lost.";
                        shootYourselfButton.disabled = true;
                        shootOtherButton.disabled = true;
                        replayButton.style.display = "block";
                        skullImage.style.display = "block";
                    } else {
                        resultText.textContent = `Computer's turn: Click! The robot missed you.`;
                        updateStatus();
                        if (bullets.length === 0) {
                            resultText.textContent = "The game is over, all bullets have been used.";
                            gameStatus.textContent = "Reloading bullets...";
                            initGame();
                        } else {
                            playerTurn = true;
                            gameStatus.textContent = "Your Turn";
                        }
                    }
                }
            }
        }, 1000);
    }

    shootYourselfButton.addEventListener('click', () => {
        if (playerTurn) {
            const result = getResult();
            if (result) {
                resultText.textContent = `You shot yourself.`;
                gameStatus.textContent = "Game Over. You lost.";
                shootYourselfButton.disabled = true;
                shootOtherButton.disabled = true;
                replayButton.style.display = "block";
                skullImage.style.display = "block";
            } else {
                resultText.textContent = `Click! You survived.`;
                updateStatus();
                if (bullets.length === 0) {
                    resultText.textContent = "The game is over, all bullets have been used.";
                    gameStatus.textContent = "Reloading bullets...";
                    initGame();
                } else {
                    playerTurn = false;
                    gameStatus.textContent = "Computer's Turn";
                    computerTurn();
                }
            }
        }
    });

    shootOtherButton.addEventListener('click', () => {
        if (playerTurn) {
            const result = getResult();
            if (result) {
                resultText.textContent = `You shot the other person.`;
                gameStatus.textContent = "You win!";
                shootYourselfButton.disabled = true;
                shootOtherButton.disabled = true;
                replayButton.style.display = "block";
            } else {
                resultText.textContent = `Click! The other person survived.`;
                updateStatus();
                if (bullets.length === 0) {
                    resultText.textContent = "The game is over, all bullets have been used.";
                    gameStatus.textContent = "Reloading bullets...";
                    initGame();
                } else {
                    playerTurn = false;
                    gameStatus.textContent = "Computer's Turn";
                    computerTurn();
                }
            }
        }
    });

    replayButton.addEventListener('click', () => {
        initGame();
    });

    initGame();
});
