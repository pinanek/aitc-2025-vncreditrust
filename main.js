// Game State Management
class GameState {
    constructor() {
        this.currentScreen = 'menu';
        this.difficulty = 'easy';
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.questions = [];
        this.timer = 10;
        this.timerInterval = null;
        this.questionAnswered = false;
        this.settings = {
            sound: true,
            vibration: true,
            theme: 'light'
        };
    }

    reset() {
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.questions = [];
        this.timer = 10;
        this.questionAnswered = false;
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        switch(difficulty) {
            case 'easy':
                this.totalQuestions = 4;
                break;
            case 'medium':
                this.totalQuestions = 6; // 4 GB + 2 RF
                break;
            case 'hard':
                this.totalQuestions = 8; // 4 GB + 4 RF
                break;
        }
    }
}

// Initialize game state
const gameState = new GameState();

// Load questions from JSON files
let gbQuestions = {};
let rfQuestions = {};

// Load question data
async function loadQuestionData() {
    try {
        const gbResponse = await fetch('assets/question_gb.json');
        const rfResponse = await fetch('assets/question_rf.json');
        
        gbQuestions = await gbResponse.json();
        rfQuestions = await rfResponse.json();
        
        console.log('Question data loaded successfully');
    } catch (error) {
        console.error('Error loading question data:', error);
    }
}

// Question Data - Fixed image pairs for each question
const questionDatabase = {
    easy: [
        { id: 1, type: 'GB', questionId: '1', trueImage: 'assets/GB/GB_0_0.png', falseImage: 'assets/GB/GB_0_1.png' },
        { id: 2, type: 'GB', questionId: '2', trueImage: 'assets/GB/GB_1_0.png', falseImage: 'assets/GB/GB_1_1.png' },
        { id: 3, type: 'GB', questionId: '3', trueImage: 'assets/GB/GB_2_0.png', falseImage: 'assets/GB/GB_2_1.png' },
        { id: 4, type: 'GB', questionId: '4', trueImage: 'assets/GB/GB_3_0.png', falseImage: 'assets/GB/GB_3_1.png' }
    ],
    medium: [
        { id: 1, type: 'GB', questionId: '1', trueImage: 'assets/GB/GB_0_0.png', falseImage: 'assets/GB/GB_0_1.png' },
        { id: 2, type: 'GB', questionId: '2', trueImage: 'assets/GB/GB_1_0.png', falseImage: 'assets/GB/GB_1_1.png' },
        { id: 3, type: 'GB', questionId: '3', trueImage: 'assets/GB/GB_2_0.png', falseImage: 'assets/GB/GB_2_1.png' },
        { id: 4, type: 'GB', questionId: '4', trueImage: 'assets/GB/GB_3_0.png', falseImage: 'assets/GB/GB_3_1.png' },
        { id: 5, type: 'GB', questionId: '5', trueImage: 'assets/GB/GB_4_0.png', falseImage: 'assets/GB/GB_4_1.png' },
        { id: 6, type: 'RF', questionId: '1', trueImage: 'assets/RF/RF_0_0.png', falseImage: 'assets/RF/RF_0_1.png' }
    ],
    hard: [
        { id: 1, type: 'GB', questionId: '1', trueImage: 'assets/GB/GB_0_0.png', falseImage: 'assets/GB/GB_0_1.png' },
        { id: 2, type: 'GB', questionId: '2', trueImage: 'assets/GB/GB_1_0.png', falseImage: 'assets/GB/GB_1_1.png' },
        { id: 3, type: 'GB', questionId: '3', trueImage: 'assets/GB/GB_2_0.png', falseImage: 'assets/GB/GB_2_1.png' },
        { id: 4, type: 'GB', questionId: '4', trueImage: 'assets/GB/GB_3_0.png', falseImage: 'assets/GB/GB_3_1.png' },
        { id: 5, type: 'RF', questionId: '1', trueImage: 'assets/RF/RF_0_0.png', falseImage: 'assets/RF/RF_0_1.png' },
        { id: 6, type: 'RF', questionId: '2', trueImage: 'assets/RF/RF_1_0.png', falseImage: 'assets/RF/RF_1_1.png' },
        { id: 7, type: 'RF', questionId: '3', trueImage: 'assets/RF/RF_2_0.png', falseImage: 'assets/RF/RF_2_1.png' },
        { id: 8, type: 'RF', questionId: '4', trueImage: 'assets/RF/RF_3_0.png', falseImage: 'assets/RF/RF_3_1.png' }
    ]
};

// Screen Management
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
    }
}

// Navigation Functions
function showMenu() {
    showScreen('menu-screen');
}

function showDifficultySelection() {
    showScreen('difficulty-screen');
}

function showInstructions() {
    showScreen('instructions-screen');
}

function showSettings() {
    showScreen('settings-screen');
    loadSettings();
}

function showGame() {
    showScreen('game-screen');
}

function showResult() {
    showScreen('result-screen');
    displayResults();
    
    // Add celebration animation
    const resultIcon = document.getElementById('result-icon');
    if (resultIcon) {
        resultIcon.style.animation = 'celebrate 1s ease-in-out';
    }
}

// Game Functions
function startGame(difficulty = null) {
    if (difficulty) {
        gameState.setDifficulty(difficulty);
    }
    
    gameState.reset();
    gameState.questions = [...questionDatabase[gameState.difficulty]];
    
    // Questions are already configured in the database with fixed image pairs
    // No need to shuffle to maintain consistent image-question mapping
    
    // Show loading only briefly
    showLoading();
    
    // Start first question after a short delay
    setTimeout(() => {
        hideLoading();
        showGame();
        loadQuestion();
    }, 500);
}

function loadQuestion() {
    const question = gameState.questions[gameState.currentQuestion];
    
    // Reset question state
    gameState.questionAnswered = false;
    
    // Update progress bar
    const progress = ((gameState.currentQuestion + 1) / gameState.totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    
    // Update score
    document.getElementById('score-value').textContent = gameState.score;
    
    // Load fixed image pairs
    document.getElementById('option-true').src = question.trueImage;
    document.getElementById('option-false').src = question.falseImage;
    
    // Get question text from JSON
    let questionData = null;
    if (question.type === 'GB' && gbQuestions[question.questionId]) {
        questionData = gbQuestions[question.questionId];
    } else if (question.type === 'RF' && rfQuestions[question.questionId]) {
        questionData = rfQuestions[question.questionId];
    }
    
    // Update question title
    let questionText = 'Thực phẩm này có an toàn không?';
    if (questionData && questionData.question) {
        questionText = questionData.question;
    }
    
    document.getElementById('question-title').textContent = questionText;
    
    // Reset image option states
    const imageOptions = document.querySelectorAll('.image-option');
    imageOptions.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect', 'disabled');
        option.style.pointerEvents = 'auto';
    });
    
    // Start timer
    startTimer();
    
    // Ensure loading is hidden
    hideLoading();
    
    // Add fade-in animation to question container
    const questionContainer = document.querySelector('.question-container');
    if (questionContainer) {
        questionContainer.style.animation = 'fadeIn 0.5s ease-in-out';
    }
}

function selectImage(userAnswer) {
    // Prevent multiple answers
    if (gameState.questionAnswered) {
        return;
    }
    
    gameState.questionAnswered = true;
    
    // Stop timer immediately when answer is selected
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    const question = gameState.questions[gameState.currentQuestion];
    
    // Get question data to determine correct answer
    let questionData = null;
    if (question.type === 'GB' && gbQuestions[question.questionId]) {
        questionData = gbQuestions[question.questionId];
    } else if (question.type === 'RF' && rfQuestions[question.questionId]) {
        questionData = rfQuestions[question.questionId];
    }
    
    // Determine if answer is correct
    const correctImage = questionData ? questionData.correct_answer : '';
    const isCorrect = (userAnswer && correctImage === question.trueImage) || (!userAnswer && correctImage === question.falseImage);
    
    // Disable all image options
    const imageOptions = document.querySelectorAll('.image-option');
    imageOptions.forEach(option => {
        option.classList.add('disabled');
        option.style.pointerEvents = 'none';
    });
    
    // Calculate score based on time remaining
    let timeBonus = Math.max(0, gameState.timer);
    let points = isCorrect ? 10 + timeBonus : 0;
    
    // Update score
    if (isCorrect) {
        gameState.score += points;
        gameState.correctAnswers++;
        
        // Visual feedback for correct answer
        const selectedOption = userAnswer ? document.querySelector('.image-option:first-child') : document.querySelector('.image-option:last-child');
        selectedOption.classList.add('correct');
        
        // Play success sound if enabled
        if (gameState.settings.sound) {
            playSound('success');
        }
        
        // Vibration if enabled
        if (gameState.settings.vibration && navigator.vibrate) {
            navigator.vibrate(100);
        }
    } else {
        // Visual feedback for incorrect answer
        const selectedOption = userAnswer ? document.querySelector('.image-option:first-child') : document.querySelector('.image-option:last-child');
        selectedOption.classList.add('incorrect');
        
        // Show correct answer
        const correctOption = correctImage === question.trueImage ? document.querySelector('.image-option:first-child') : document.querySelector('.image-option:last-child');
        correctOption.classList.add('correct');
        
        // Play error sound if enabled
        if (gameState.settings.sound) {
            playSound('error');
        }
        
        // Vibration if enabled
        if (gameState.settings.vibration && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }
    
    // Update score display immediately
    document.getElementById('score-value').textContent = gameState.score;
    
    // Generate explanation based on question type and images
    let explanation = '';
    if (question.type === 'GB') {
        explanation = 'Hình ảnh bên trái có màu sắc tự nhiên, không có dấu hiệu hư hỏng và được chế biến hợp vệ sinh. Hình ảnh bên phải có màu sắc bất thường, có thể đã bị hỏng hoặc không an toàn.';
    } else if (question.type === 'RF') {
        explanation = 'Hình ảnh bên trái có nhãn mác rõ ràng, còn hạn sử dụng và là hàng chính hãng. Hình ảnh bên phải có dấu hiệu bất thường, có thể là hàng giả hoặc đã hết hạn.';
    }
    
    // Show explanation
    showExplanation(explanation);
    
    // Move to next question after delay
    setTimeout(() => {
        gameState.currentQuestion++;
        
        if (gameState.currentQuestion < gameState.totalQuestions) {
            // Load next question directly without loading animation
            loadQuestion();
        } else {
            showResult();
        }
    }, 2500);
}

function showExplanation(explanation) {
    // Create explanation popup
    const popup = document.createElement('div');
    popup.className = 'explanation-popup';
    popup.innerHTML = `
        <div class="explanation-content">
            <h4>Giải thích:</h4>
            <p>${explanation}</p>
        </div>
    `;
    
    // Add styles
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 300px;
        text-align: center;
        animation: fadeIn 0.3s ease-in-out;
    `;
    
    document.body.appendChild(popup);
    
    // Remove popup after delay
    setTimeout(() => {
        popup.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => {
            popup.remove();
        }, 300);
    }, 1500);
}

function displayResults() {
    const finalScore = document.getElementById('final-score');
    const correctAnswers = document.getElementById('correct-answers');
    const totalQuestions = document.getElementById('total-questions');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const resultIcon = document.getElementById('result-icon');
    
    // Update result values
    finalScore.textContent = gameState.score;
    correctAnswers.textContent = gameState.correctAnswers;
    totalQuestions.textContent = gameState.totalQuestions;
    
    // Determine result message
    const percentage = (gameState.correctAnswers / gameState.totalQuestions) * 100;
    
    if (percentage >= 80) {
        resultIcon.textContent = '🎉';
        resultTitle.textContent = 'Xuất sắc!';
        resultMessage.textContent = 'Bạn đã hiểu rất rõ về an toàn thực phẩm!';
        
        // Play success sound if enabled
        if (gameState.settings.sound) {
            playSound('success');
        }
        
        // Vibration if enabled
        if (gameState.settings.vibration && navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 100]);
        }
    } else if (percentage >= 60) {
        resultIcon.textContent = '👏';
        resultTitle.textContent = 'Tốt lắm!';
        resultMessage.textContent = 'Bạn đã có kiến thức tốt về an toàn thực phẩm!';
        
        // Play success sound if enabled
        if (gameState.settings.sound) {
            playSound('success');
        }
        
        // Vibration if enabled
        if (gameState.settings.vibration && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    } else {
        resultIcon.textContent = '💪';
        resultTitle.textContent = 'Cố gắng thêm!';
        resultMessage.textContent = 'Hãy chơi lại để cải thiện kiến thức!';
        
        // Play error sound if enabled
        if (gameState.settings.sound) {
            playSound('error');
        }
        
        // Vibration if enabled
        if (gameState.settings.vibration && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }
}

function playAgain() {
    startGame(gameState.difficulty);
}

// Timer Functions
function startTimer() {
    // Clear any existing timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // Reset timer to 10 seconds
    gameState.timer = 10;
    document.getElementById('timer-value').textContent = gameState.timer;
    document.getElementById('timer-value').className = 'timer-value';
    
    // Start new timer
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        document.getElementById('timer-value').textContent = gameState.timer;
        
        // Update timer color based on remaining time
        const timerElement = document.getElementById('timer-value');
        if (gameState.timer <= 3) {
            timerElement.className = 'timer-value danger';
        } else if (gameState.timer <= 5) {
            timerElement.className = 'timer-value warning';
        } else {
            timerElement.className = 'timer-value';
        }
        
        // Time's up
        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;
            
            // Auto-answer as incorrect if time runs out
            if (!gameState.questionAnswered) {
                selectImage(false); // Default to false (second image)
            }
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// Utility Functions
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

function playSound(type) {
    // Simple sound implementation using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'success') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    } else if (type === 'error') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Settings Management
function loadSettings() {
    const soundToggle = document.getElementById('sound-toggle');
    const vibrationToggle = document.getElementById('vibration-toggle');
    const themeSelect = document.getElementById('theme-select');
    
    if (soundToggle) soundToggle.checked = gameState.settings.sound;
    if (vibrationToggle) vibrationToggle.checked = gameState.settings.vibration;
    if (themeSelect) themeSelect.value = gameState.settings.theme;
}

function saveSettings() {
    const soundToggle = document.getElementById('sound-toggle');
    const vibrationToggle = document.getElementById('vibration-toggle');
    const themeSelect = document.getElementById('theme-select');
    
    if (soundToggle) gameState.settings.sound = soundToggle.checked;
    if (vibrationToggle) gameState.settings.vibration = vibrationToggle.checked;
    if (themeSelect) gameState.settings.theme = themeSelect.value;
    
    // Apply theme
    applyTheme(gameState.settings.theme);
    
    // Save to localStorage
    localStorage.setItem('gameSettings', JSON.stringify(gameState.settings));
}

function applyTheme(theme) {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async function() {
    // Load question data first
    await loadQuestionData();
    
    // Load saved settings
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
        gameState.settings = { ...gameState.settings, ...JSON.parse(savedSettings) };
    }
    
    // Apply saved theme
    applyTheme(gameState.settings.theme);
    
    // Settings event listeners
    const soundToggle = document.getElementById('sound-toggle');
    const vibrationToggle = document.getElementById('vibration-toggle');
    const themeSelect = document.getElementById('theme-select');
    
    if (soundToggle) {
        soundToggle.addEventListener('change', saveSettings);
    }
    
    if (vibrationToggle) {
        vibrationToggle.addEventListener('change', saveSettings);
    }
    
    if (themeSelect) {
        themeSelect.addEventListener('change', saveSettings);
    }
    
    // Initialize game
    showMenu();
    
    // Ensure loading is hidden on startup
    hideLoading();
});

// Handle back button
window.addEventListener('popstate', function(event) {
    if (gameState.currentScreen === 'game-screen') {
        showMenu();
    }
});

// Prevent context menu on long press
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Handle orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        // Refresh viewport height for mobile browsers
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100);
});

// Initialize viewport height
function initViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

initViewportHeight();
window.addEventListener('resize', initViewportHeight);

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
