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

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

// Initialize timeLeft
timeLeft = WORK_TIME;

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
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                alert(isWorkTime ? 'Work time is over! Take a break!' : 'Break is over! Back to work!');
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

// Task Management
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = {
            description: taskText,
            timestamp: new Date().toISOString(),
            mode: isWorkTime ? 'work' : 'break'
        };
        tasks.unshift(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskList();
        taskInput.value = '';
    }
}

function updateTaskList() {
    taskList.innerHTML = tasks.map(task => `
        <div class="task-item">
            <p>${task.description}</p>
            <small>${new Date(task.timestamp).toLocaleString()}</small>
        </div>
    `).join('');
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
workModeBtn.addEventListener('click', setWorkMode);
breakModeBtn.addEventListener('click', setBreakMode);
saveTaskBtn.addEventListener('click', saveTask);

// Initialize
setWorkMode();
updateTaskList(); 