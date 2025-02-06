let timeLeft;
let timerId = null;
let isWorkTime = true;

// DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const workModeBtn = document.getElementById('work-mode');
const breakModeBtn = document.getElementById('break-mode');
const increaseTimeBtn = document.getElementById('increase-time');
const decreaseTimeBtn = document.getElementById('decrease-time');
const taskInput = document.getElementById('task-description');
const saveTaskBtn = document.getElementById('save-task');
const taskList = document.getElementById('task-list');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Remove task-related DOM elements and keep only focus-related ones
const focusModal = document.getElementById('focus-modal');
const focusInput = document.getElementById('focus-input');
const startFocusBtn = document.getElementById('start-focus');
const currentFocus = document.getElementById('current-focus');
const focusText = document.getElementById('focus-text');

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

// Initialize timeLeft
timeLeft = WORK_TIME;

// Store focus history in localStorage
let focusHistory = JSON.parse(localStorage.getItem('focusHistory') || '[]');

// Timer Functions
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Pomodoro Timer`;
}

function startTimer() {
    if (timerId === null) {
        if (isWorkTime) {
            focusModal.style.display = 'flex';
        } else {
            // Start break timer directly without focus prompt
            timerId = setInterval(() => {
                timeLeft--;
                updateDisplay();
                
                if (timeLeft === 0) {
                    alert('Break is over! Back to work!');
                    setWorkMode();
                }
            }, 1000);
            startButton.disabled = true;
            pauseButton.disabled = false;
        }
    }
}

function startFocusSession() {
    const focusDescription = focusInput.value.trim();
    if (focusDescription) {
        // Save to focus history
        const focus = {
            description: focusDescription,
            timestamp: new Date().toISOString(),
            mode: isWorkTime ? 'work' : 'break'
        };
        focusHistory.unshift(focus);
        localStorage.setItem('focusHistory', JSON.stringify(focusHistory));
        
        // Display current focus
        focusText.textContent = focusDescription;
        currentFocus.classList.remove('hidden');
        
        // Start the timer
        focusModal.style.display = 'none';
        focusInput.value = '';
        
        // Start the actual timer
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                alert(isWorkTime ? 'Work time is over! Take a break!' : 'Break is over! Back to work!');
                currentFocus.classList.add('hidden');
                if (isWorkTime) {
                    setBreakMode();
                } else {
                    setWorkMode();
                }
            }
        }, 1000);
        startButton.disabled = true;
        pauseButton.disabled = false;
    }
}

function pauseTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.disabled = false;
        pauseButton.disabled = false;
    }
}

// Mode Toggle
function setWorkMode() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    workModeBtn.classList.add('active');
    breakModeBtn.classList.remove('active');
    startButton.disabled = false;
    currentFocus.classList.add('hidden');
    updateDisplay();
}

function setBreakMode() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = false;
    timeLeft = BREAK_TIME;
    breakModeBtn.classList.add('active');
    workModeBtn.classList.remove('active');
    startButton.disabled = false;
    currentFocus.classList.add('hidden');
    updateDisplay();
}

// Time Adjustment
increaseTimeBtn.addEventListener('click', () => {
    if (!timerId) {
        timeLeft += 5 * 60;
        updateDisplay();
    }
});

decreaseTimeBtn.addEventListener('click', () => {
    if (!timerId && timeLeft > 5 * 60) {
        timeLeft -= 5 * 60;
        updateDisplay();
    }
});

// Theme Toggle
themeToggleBtn.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
});

// Add event listeners
startFocusBtn.addEventListener('click', startFocusSession);

// Allow closing modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && focusModal.style.display === 'flex') {
        focusModal.style.display = 'none';
        focusInput.value = '';
    }
});

// Allow starting focus with Enter key
focusInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        startFocusSession();
    }
});

// Add these event listeners at the bottom of your script
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
workModeBtn.addEventListener('click', setWorkMode);
breakModeBtn.addEventListener('click', setBreakMode);
startFocusBtn.addEventListener('click', startFocusSession);

// Initialize
setWorkMode();
updateDisplay(); 