class HangmanGame {
    constructor() {
        this.words = ['NEURON', 'WEIGHT', 'RELU', 'LAYER', 'BIAS', 'BATCH', 'STREAM', 'KAFKA', 'FLINK', 'SPARK'];
        this.word = '';
        this.guessedLetters = new Set();
        this.wrongLetters = new Set();
        this.maxWrong = 6;
        this.gameOver = false;
        
        // Audio elements
        this.backgroundMusic = document.getElementById('background-music');
        this.winSound = document.getElementById('win-sound');
        this.loseSound = document.getElementById('lose-sound');
        
        // DOM elements
        this.wordDisplay = document.getElementById('word-display');
        this.wrongLettersDisplay = document.getElementById('wrong-letters');
        this.hangmanImage = document.getElementById('hangman-img');
        this.gameStatus = document.getElementById('game-status');
        this.keyboard = document.getElementById('keyboard');
        this.resetBtn = document.getElementById('reset-btn');
        
        this.init();
    }
    
    init() {
        this.startBackgroundMusic();
        this.createKeyboard();
        this.startNewGame();
        
        this.resetBtn.addEventListener('click', () => {
            this.startNewGame();
        });
    }
    
    startBackgroundMusic() {
        this.backgroundMusic.volume = 40;
        this.backgroundMusic.play().catch(e => {
            console.log('Audio play failed:', e);
        });
    }
    
    createKeyboard() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.keyboard.innerHTML = '';
        
        for (let letter of letters) {
            const button = document.createElement('button');
            button.textContent = letter;
            button.className = 'letter-btn';
            button.addEventListener('click', () => this.guessLetter(letter));
            this.keyboard.appendChild(button);
        }
    }
    
    startNewGame() {
        this.word = this.words[Math.floor(Math.random() * this.words.length)];
        this.guessedLetters.clear();
        this.wrongLetters.clear();
        this.gameOver = false;
        
        this.updateDisplay();
        this.gameStatus.textContent = '';
        this.gameStatus.className = 'game-status';
        
        // Enable all keyboard buttons
        document.querySelectorAll('.letter-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong');
        });
    }
    
    guessLetter(letter) {
        if (this.gameOver || this.guessedLetters.has(letter)) return;
        
        this.guessedLetters.add(letter);
        const button = Array.from(document.querySelectorAll('.letter-btn'))
            .find(btn => btn.textContent === letter);
        
        if (this.word.includes(letter)) {
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
            this.wrongLetters.add(letter);
        }
        
        button.disabled = true;
        this.updateDisplay();
        this.checkGameStatus();
    }
    
    updateDisplay() {
        // Update word display
        let display = '';
        for (let letter of this.word) {
            if (this.guessedLetters.has(letter)) {
                display += letter + ' ';
            } else {
                display += '_ ';
            }
        }
        this.wordDisplay.textContent = display.trim();
        
        // Update wrong letters
        this.wrongLettersDisplay.textContent = Array.from(this.wrongLetters).join(' ');
        
        // Update hangman image
        const wrongCount = this.wrongLetters.size;
        this.hangmanImage.src = `assets/images/hangman/hangman${wrongCount}.png`;
    }
    
    checkGameStatus() {
        const wordGuessed = this.word.split('').every(letter => 
            this.guessedLetters.has(letter)
        );
        
        if (wordGuessed) {
            this.gameOver = true;
            this.gameStatus.textContent = 'Congratulations! You won! 🎉';
            this.gameStatus.className = 'game-status win';
            this.winSound.play();
            this.disableKeyboard();
        } else if (this.wrongLetters.size >= this.maxWrong) {
            this.gameOver = true;
            this.gameStatus.textContent = `Game Over! The word was: ${this.word}`;
            this.gameStatus.className = 'game-status lose';
            this.loseSound.play();
            this.disableKeyboard();
        }
    }
    
    disableKeyboard() {
        document.querySelectorAll('.letter-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HangmanGame();
});
