class HangmanGame {
    constructor() {
        this.words = ['JAVASCRIPT', 'PROGRAMMING', 'DEVELOPER', 'COMPUTER', 'ALGORITHM'];
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
        this.forceAudioPlay();
        this.createKeyboard();
        this.startNewGame();
        
        this.resetBtn.addEventListener('click', () => {
            this.startNewGame();
        });
    }
    
    forceAudioPlay() {
        // Set audio properties to maximize autoplay success
        this.backgroundMusic.volume = 0.3;
        this.winSound.volume = 0.7;
        this.loseSound.volume = 0.7;
        
        // Try multiple methods to play audio
        const playAudio = () => {
            this.backgroundMusic.play().then(() => {
                console.log('Background music started automatically');
            }).catch(error => {
                console.log('Autoplay blocked, trying alternative method...');
                this.alternativeAudioStart();
            });
        };
        
        // Wait for page to fully load
        if (document.readyState === 'complete') {
            playAudio();
        } else {
            window.addEventListener('load', playAudio);
        }
    }
    
    alternativeAudioStart() {
        // Create a silent audio context to trick browsers
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            oscillator.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.001);
            
            // Now try playing the actual audio
            setTimeout(() => {
                this.backgroundMusic.play().catch(e => {
                    console.log('All audio methods failed - user interaction required');
                });
            }, 100);
        } catch (e) {
            console.log('Alternative audio method failed');
        }
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
        
        // Ensure background music is playing
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(e => console.log('Music resume failed'));
        }
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
            this.winSound.currentTime = 0;
            this.winSound.play().catch(e => console.log('Win sound failed'));
            this.disableKeyboard();
        } else if (this.wrongLetters.size >= this.maxWrong) {
            this.gameOver = true;
            this.gameStatus.textContent = `Game Over! The word was: ${this.word}`;
            this.gameStatus.className = 'game-status lose';
            this.loseSound.currentTime = 0;
            this.loseSound.play().catch(e => console.log('Lose sound failed'));
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

// Last resort: try to play audio on any user interaction
document.addEventListener('click', function enableAudio() {
    const bgMusic = document.getElementById('background-music');
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Final audio attempt failed'));
    }
    document.removeEventListener('click', enableAudio);
});
