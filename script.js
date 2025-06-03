// Global variables
let currentLevel = 0;
let attempts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let isFillingUsername = true;
let usernameLetter = '';
let passwordLetter = '';
let tncAudio = null;
let emergencySkipUsed = false;
let storedPassword = '';
let handPosition = { x: 50, y: 50 };

// Emergency skip functionality
function setupEmergencySkip() {
    const emergencySkipBtn = document.getElementById('emergencySkipBtn');
    const emergencySkipContainer = document.getElementById('emergencySkip');
    
    if (emergencySkipBtn) {
        emergencySkipBtn.addEventListener('click', function() {
            handleEmergencySkip();
        });
    }
}

function handleEmergencySkip() {
    if (currentLevel === 0) return; // Don't skip from homepage
    
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to skip this level? This will move you to the next challenge!\n\nNote: Using emergency skip will make you ineligible for the reward.');
    
    if (confirmed) {
        emergencySkipUsed = true; // Mark that emergency skip was used
        
        // Add visual feedback
        const emergencySkipBtn = document.getElementById('emergencySkipBtn');
        emergencySkipBtn.style.background = '#00ff00';
        emergencySkipBtn.textContent = '✓ SKIPPED!';
        
        setTimeout(() => {
            if (currentLevel < 10) {
                showSuccessAndAdvance(currentLevel + 1);
            } else {
                // If on level 10, complete the experience
                showSuccessAndAdvance('success');
            }
        }, 500);
    }
}

function updateEmergencySkipVisibility() {
    const emergencySkipContainer = document.getElementById('emergencySkip');
    
    if (currentLevel >= 1 && currentLevel <= 10) {
        const currentAttempts = attempts[currentLevel - 1];
        let attemptsThreshold = 5; // Default threshold
          // Level 2, Level 5, Level 7, and Level 9 have a special threshold of 10 attempts
        if (currentLevel === 2 || currentLevel === 5 || currentLevel === 7 || currentLevel === 9) {
            attemptsThreshold = 10;
        }
        
        if (currentAttempts >= attemptsThreshold) {
            emergencySkipContainer.classList.add('show');
        } else {
            emergencySkipContainer.classList.remove('show');
        }
        
        // Reset button appearance
        const emergencySkipBtn = document.getElementById('emergencySkipBtn');
        emergencySkipBtn.style.background = '';
        emergencySkipBtn.textContent = '🚨 EMERGENCY SKIP 🚨';
    } else {
        // Hide emergency skip for homepage, T&C, quiz, and success screens
        emergencySkipContainer.classList.remove('show');
    }
}

// Helper function to show success message and advance level
function showSuccessAndAdvance(nextLevel) {
    const message = document.createElement('div');
    message.textContent = '✓ SECRET UNLOCKED! Moving to next level...';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #00ff00;
        color: #000;
        padding: 20px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 9999;
        animation: pulse 0.5s ease-in-out;
        box-shadow: 0 0 30px #00ff00;
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
        if (nextLevel === 'success') {
            showLevel('success');
        } else {
            showLevel(nextLevel);
        }
    }, 1500);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up homepage
    document.getElementById('enterBtn').addEventListener('click', startLevels);
    
    // Initialize all levels
    setupLevel1();
    setupLevel2();
    setupLevel3();
    setupLevel4();
    setupLevel5();
    setupLevel6();
    setupLevel7();
    setupLevel8();
    setupLevel9();
    setupLevel10();
    setupTncReading();
    setupQuiz();
    setupSuccess();
    setupEmergencySkip();
}

function startLevels() {
    showLevel(1);
}

function showLevel(level) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show specific level
    if (level === 'homepage') {
        document.getElementById('homepage').classList.add('active');
        currentLevel = 0;
    } else if (level === 'tncReading') {
        document.getElementById('tncReading').classList.add('active');
        currentLevel = 'tncReading';
    } else if (level === 'quiz') {
        document.getElementById('quiz').classList.add('active');
        currentLevel = 'quiz';
    } else if (level === 'success') {
        document.getElementById('success').classList.add('active');
        currentLevel = 'success';
    } else {
        document.getElementById(`level${level}`).classList.add('active');
        currentLevel = level;
    }
    
    updateEmergencySkipVisibility();
}

function checkSkip(level, username, password) {
    attempts[level - 1]++;
    document.getElementById(`attempts${level}`).textContent = attempts[level - 1];
    
    if (username === 'skip' && password === 'skip') {
        if (level < 10) {
            showLevel(level + 1);
        } else {
            // Level 10 completed, show success
            showLevel('success');
        }
        return true;
    }
      // Level 7 special case: random acceptance of any non-empty input
    if (level === 7) {
        if (username.length >= 4 && password.length >= 4) {
            // 30% chance to randomly accept any valid input (4+ characters each)
            if (Math.random() < 0.3) {
                showLevel(8);
                return true;
            }
        }
    }
    
    // Level 9 special case: random acceptance of any non-empty input
    if (level === 9) {
        if (username.trim() && password.trim()) {
            // 25% chance to randomly accept any non-empty input
            if (Math.random() < 0.25) {
                showLevel(10);
                return true;
            }
        }
    }
    
    if (attempts[level - 1] >= 5) {
        document.getElementById(`hint${level}`).classList.remove('hidden');
    }
    
    return false;
}

// Level 1: Rotating Login
function setupLevel1() {
    const usernameInput = document.getElementById('username1');
    const passwordInput = document.getElementById('password1');
    const nextButton = document.getElementById('next1');
    
    if (!usernameInput || !passwordInput || !nextButton) {
        console.error('Missing Level 1 elements');
        return;
    }
    
    // Visual feedback for typing "skip" (easter egg)
    function addSkipFeedback(input) {
        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            const target = 'skip';
            
            if (target.startsWith(value) && value.length > 0) {
                this.style.borderColor = '#00ff00';
                this.style.boxShadow = '0 0 10px #00ff00';
            } else {
                this.style.borderColor = '#666';
                this.style.boxShadow = 'none';
            }
        });
    }
    
    addSkipFeedback(usernameInput);
    addSkipFeedback(passwordInput);
    
    // Auto-check for skip when typing (hidden easter egg)
    function checkAutoSkip() {
        if (usernameInput.value.toLowerCase() === 'skip' && passwordInput.value.toLowerCase() === 'skip') {
            // Show success feedback
            usernameInput.style.borderColor = '#00ff00';
            passwordInput.style.borderColor = '#00ff00';
            usernameInput.style.boxShadow = '0 0 20px #00ff00';
            passwordInput.style.boxShadow = '0 0 20px #00ff00';
            
            showSuccessAndAdvance(2);
        }
    }
    
    usernameInput.addEventListener('input', checkAutoSkip);
    passwordInput.addEventListener('input', checkAutoSkip);
    
    // Main click handler
    function handleLevel1Click(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const username = usernameInput.value;
        const password = passwordInput.value;
        
        // Accept any username and password
        if (username.trim() && password.trim()) {
            showSuccessAndAdvance(2);
        } else {
            // Count failed attempts for emergency skip trigger
            attempts[0]++;
            document.getElementById('attempts1').textContent = attempts[0];
            updateEmergencySkipVisibility();
            alert('Please enter both username and password!');
        }
    }
    
    // Add Enter key support
    function handleEnterKey(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLevel1Click(e);
        }
    }
    
    usernameInput.addEventListener('keydown', handleEnterKey);
    passwordInput.addEventListener('keydown', handleEnterKey);
    
    // Add click event - simple and clean since button is outside rotating container
    nextButton.addEventListener('click', handleLevel1Click);
}

// Level 2: Hand Matching Challenge (Continuous Movement)
function setupLevel2() {
    const targetRotatingHand = document.getElementById('targetRotatingHand');
    const userRotatingHand = document.getElementById('userRotatingHand');
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const nextBtn = document.getElementById('next2');
    const hintBtn = document.getElementById('hint2');
    const rotationDiffDisplay = document.getElementById('rotationDifference');
    let attempts2 = 0;
    let userRotation = 0;
    let targetRotation = 0;
    let rotationSpeed = 90; // degrees per second for continuous rotation
    let lastTime = performance.now();
    let animationFrame;
    let running = true;

    // Update target rotation continuously
    function updateTargetRotation() {
        if (!running) return;
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        lastTime = currentTime;
        
        targetRotation = (targetRotation + rotationSpeed * deltaTime) % 360;
        targetRotatingHand.style.transform = `rotate(${targetRotation}deg)`;
        
        // Update rotation difference display
        let diff = Math.abs(targetRotation - userRotation);
        diff = Math.min(diff, 360 - diff); // Use smallest angle difference
        rotationDiffDisplay.textContent = Math.round(diff);
        
        animationFrame = requestAnimationFrame(updateTargetRotation);
    }
    
    // Start the continuous rotation
    updateTargetRotation();

    // User rotation controls
    function rotateUser(degrees) {
        userRotation = (userRotation + degrees) % 360;
        if (userRotation < 0) userRotation += 360;
        userRotatingHand.style.transform = `rotate(${userRotation}deg)`;
        
        // Update rotation difference display
        let diff = Math.abs(targetRotation - userRotation);
        diff = Math.min(diff, 360 - diff);
        rotationDiffDisplay.textContent = Math.round(diff);
    }

    // Button event listeners
    rotateLeftBtn.addEventListener('click', () => rotateUser(-15));
    rotateRightBtn.addEventListener('click', () => rotateUser(15));

    // Keyboard controls for better user experience
    document.addEventListener('keydown', function(e) {
        if (document.querySelector('#level2.active')) {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                rotateUser(-15);
                e.preventDefault();
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                rotateUser(15);
                e.preventDefault();
            }
        }
    });

    // Check for match
    function checkRotationMatch() {
        let diff = Math.abs(targetRotation - userRotation);
        diff = Math.min(diff, 360 - diff);
        
        if (diff <= 10) { // Allow 10 degree tolerance
            // Success
            running = false;
            cancelAnimationFrame(animationFrame);
            userRotatingHand.style.filter = 'drop-shadow(0 0 15px #00ff00)';
            targetRotatingHand.style.filter = 'drop-shadow(0 0 15px #00ff00)';
            setTimeout(() => {
                userRotatingHand.style.filter = '';
                targetRotatingHand.style.filter = '';
                showSuccessAndAdvance(3);
            }, 1000);
        } else {
            attempts2++;
            document.getElementById('attempts2').textContent = attempts2;
            userRotatingHand.style.filter = 'drop-shadow(0 0 15px #ff0000)';
            setTimeout(() => { userRotatingHand.style.filter = ''; }, 500);
            
            // Show emergency skip after 10 attempts
            if (attempts2 >= 10) {
                updateEmergencySkipVisibility();
            }
        }
    }

    // Next button logic
    nextBtn.classList.remove('hidden');
    nextBtn.onclick = function() {
        checkRotationMatch();
    };

    // No skip easter egg for this level - hint button shows no skip available
    hintBtn.classList.remove('hidden');

    // Emergency skip logic (only after 10 attempts)
    document.getElementById('emergencySkipBtn').onclick = function() {
        running = false;
        cancelAnimationFrame(animationFrame);
        window.userSkippedALevel = true;
        showSuccessAndAdvance(3);
    };

    // Clean up on level exit
    if (window.level2Cleanup) window.level2Cleanup();
    window.level2Cleanup = function() {
        running = false;
        cancelAnimationFrame(animationFrame);
        nextBtn.onclick = null;
        rotateLeftBtn.removeEventListener('click', () => rotateUser(-15));
        rotateRightBtn.removeEventListener('click', () => rotateUser(15));
        document.getElementById('emergencySkipBtn').onclick = null;
    };
}

// Level 3: Random Generator
function setupLevel3() {
    const targetUser = 'admin123';
    const targetPass = 'pass456';
    
    document.getElementById('generateBtn').addEventListener('click', function() {
        generateRandomCredentials();
        attempts[2]++;
        document.getElementById('attempts3').textContent = attempts[2];
        
        // After 5 attempts, show emergency skip option
        if (attempts[2] >= 5) {
            updateEmergencySkipVisibility();
        }
    });
    
    // Auto-skip detection when the magic combination appears (easter egg)
    function checkForMagicCombo() {
        const currentUser = document.getElementById('randomUser').textContent;
        const currentPass = document.getElementById('randomPass').textContent;
        
        if (currentUser === 'skip' && currentPass === 'skip') {
            setTimeout(() => {
                showLevel(4);
            }, 1000);
        }
    }
    
    document.getElementById('next3').addEventListener('click', function() {
        const currentUser = document.getElementById('randomUser').textContent;
        const currentPass = document.getElementById('randomPass').textContent;
        
        if (currentUser === targetUser && currentPass === targetPass) {
            showLevel(4);
        } else {
            attempts[2]++;
            document.getElementById('attempts3').textContent = attempts[2];
            alert('Wrong combination! Keep generating until you find the target.');
            
            // After 5 attempts, show emergency skip option
            if (attempts[2] >= 5) {
                updateEmergencySkipVisibility();
            }
        }
    });
    
    generateRandomCredentials();
}

function generateRandomCredentials() {
    const users = ['user123', 'admin456', 'test789', 'demo321', 'guest111', 'player999', 'admin123', 'skip'];
    const passes = ['pass123', 'secret456', 'password789', 'login321', 'access111', 'qwerty123', 'pass456', 'skip'];
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPass = passes[Math.floor(Math.random() * passes.length)];
    
    document.getElementById('randomUser').textContent = randomUser;
    document.getElementById('randomPass').textContent = randomPass;
    
    // Auto-advance if both are 'skip' (hidden easter egg)
    if (randomUser === 'skip' && randomPass === 'skip') {
        setTimeout(() => {
            showLevel(4);
        }, 1500); // Give user time to see the result
        return;
    }
    
    // Show Next button if correct combination is found
    if (randomUser === 'admin123' && randomPass === 'pass456') {
        document.getElementById('next3').classList.remove('hidden');
    } else {
        document.getElementById('next3').classList.add('hidden');
    }
}

// Level 4: Floating Letters (Enhanced & Smooth)
function setupLevel4() {
    const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    const container = document.getElementById('letterContainer');
    
    // Reset letter strings when level starts
    usernameLetter = '';
    passwordLetter = '';
    isFillingUsername = true;
    
    // Make container bigger and more responsive
    container.style.cssText = `
        width: 90%;
        max-width: 900px;
        height: 450px;
        margin: 20px auto;
        border: 3px solid #00ff00;
        position: relative;
        background: #111;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    `;
    
    let letterCount = 0;
    let letterInterval;
    let activeLetters = new Set();
    
    // Auto-check for skip when letters are clicked
    function checkAutoSkip() {
        if (usernameLetter.toLowerCase() === 'skip' && passwordLetter.toLowerCase() === 'skip') {
            setTimeout(() => {
                clearInterval(letterInterval);
                showLevel(5);
            }, 500);
        }
    }
    
    // Create floating letters with better clickability
    function createFloatingLetter() {
        const letter = document.createElement('div');
        const letterChar = letters[Math.floor(Math.random() * letters.length)];
        letter.className = 'floating-letter';
        letter.textContent = letterChar;
        
        // Better positioning and sizing for clickability
        const fontSize = Math.random() * 15 + 30; // 30-45px for better visibility
        const leftPos = Math.random() * (container.offsetWidth - 80) + 20; // More margin
        
        letter.style.cssText = `
            position: absolute;
            left: ${leftPos}px;
            top: -60px;
            font-size: ${fontSize}px;
            font-weight: bold;
            color: hsl(${Math.random() * 360}, 80%, 75%);
            cursor: pointer;
            z-index: 100;
            padding: 8px 12px;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid transparent;
            transition: all 0.2s ease;
            animation: floatDown ${Math.random() * 2 + 4}s linear forwards;
            user-select: none;
            -webkit-user-select: none;
            text-align: center;
            min-width: 40px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        `;
        
        // Hover effect for better UX
        letter.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.borderColor = '#00ff00';
            this.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.6)';
        });
        
        letter.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.borderColor = 'transparent';
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        });
        
        // Click handler with visual feedback
        letter.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Visual feedback
            this.style.transform = 'scale(0.8)';
            this.style.background = '#00ff00';
            this.style.color = '#000';
            
            if (isFillingUsername) {
                usernameLetter += letterChar;
                document.getElementById('floatingUsername').textContent = usernameLetter;
                updateFieldDisplay('floatingUsername');
            } else {
                passwordLetter += letterChar;
                document.getElementById('floatingPassword').textContent = passwordLetter;
                updateFieldDisplay('floatingPassword');
            }
            
            activeLetters.delete(this);
            this.remove();
            checkAutoSkip();
        });
        
        container.appendChild(letter);
        activeLetters.add(letter);
        letterCount++;
        
        // Remove letter after animation completes
        setTimeout(() => {
            if (letter.parentNode && activeLetters.has(letter)) {
                activeLetters.delete(letter);
                letter.remove();
            }
        }, 6000);
    }
    
    // Update field display with smooth effects
    function updateFieldDisplay(fieldId) {
        const field = document.getElementById(fieldId);
        field.style.transform = 'scale(1.05)';
        field.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.6)';
        setTimeout(() => {
            field.style.transform = 'scale(1)';
            field.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
        }, 200);
    }
    
    // Start letter generation with moderate speed
    let currentSpeed = 800;
    function startLetterGeneration() {
        letterInterval = setInterval(() => {
            if (activeLetters.size < 8) { // Limit active letters for better performance
                createFloatingLetter();
            }
            
            // Gradually increase frequency but not too much
            if (letterCount % 15 === 0 && currentSpeed > 400) {
                currentSpeed -= 50;
                clearInterval(letterInterval);
                startLetterGeneration();
            }
        }, currentSpeed);
    }
    
    startLetterGeneration();
    
    // Enhanced input displays with better styling and interaction
    const usernameDisplay = document.getElementById('floatingUsername');
    const passwordDisplay = document.getElementById('floatingPassword');
    
    if (usernameDisplay && passwordDisplay) {
        // Style username field
        usernameDisplay.style.cssText = `
            min-height: 80px;
            font-size: 28px;
            padding: 20px;
            background: rgba(68, 68, 68, 0.9);
            border: 3px solid #666;
            border-radius: 10px;
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px 0;
            word-wrap: break-word;
            display: flex;
            align-items: center;
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
        `;
        
        // Style password field
        passwordDisplay.style.cssText = `
            min-height: 80px;
            font-size: 28px;
            padding: 20px;
            background: rgba(68, 68, 68, 0.9);
            border: 3px solid #666;
            border-radius: 10px;
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px 0;
            word-wrap: break-word;
            display: flex;
            align-items: center;
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);        `;
        
        // Set initial state - username field is active by default
        usernameDisplay.classList.add('active');
    }
      // Enhanced field selection with clear visual feedback
    usernameDisplay.addEventListener('click', function() {
        isFillingUsername = true;
        
        // Use CSS classes for better styling control
        this.classList.add('active');
        passwordDisplay.classList.remove('active');
    });
    
    passwordDisplay.addEventListener('click', function() {
        isFillingUsername = false;
        
        // Use CSS classes for better styling control
        this.classList.add('active');
        usernameDisplay.classList.remove('active');
    });
      // Enhanced clear functionality
    document.getElementById('clearFields').addEventListener('click', function() {
        usernameLetter = '';
        passwordLetter = '';
        usernameDisplay.textContent = '';
        passwordDisplay.textContent = '';
        
        // Reset to username selection
        isFillingUsername = true;
        usernameDisplay.classList.add('active');
        passwordDisplay.classList.remove('active');
        
        // Visual feedback for clear action
        this.style.background = '#ff4444';
        setTimeout(() => {
            this.style.background = '';
        }, 200);
    });
    
    // Enhanced next button functionality
    document.getElementById('next4').addEventListener('click', function() {
        if (usernameLetter.trim() && passwordLetter.trim()) {
            clearInterval(letterInterval);
            // Clear remaining letters
            activeLetters.forEach(letter => letter.remove());
            activeLetters.clear();
            showSuccessAndAdvance(5);
        } else {
            attempts[3]++;
            document.getElementById('attempts4').textContent = attempts[3];
            updateEmergencySkipVisibility();
              // Visual feedback for missing fields using CSS classes
            if (!usernameLetter.trim()) {
                usernameDisplay.classList.add('error');
                setTimeout(() => usernameDisplay.classList.remove('error'), 2000);
            }
            if (!passwordLetter.trim()) {
                passwordDisplay.classList.add('error');
                setTimeout(() => passwordDisplay.classList.remove('error'), 2000);
            }
            
            alert('Please fill both username and password using the floating letters!');
            
            // Reset active states after alert
            setTimeout(() => {
                if (isFillingUsername) {
                    usernameDisplay.classList.add('active');
                    passwordDisplay.classList.remove('active');
                } else {
                    passwordDisplay.classList.add('active');
                    usernameDisplay.classList.remove('active');
                }
            }, 2000);
        }
    });
}

// Level 5: Falling Fragile Fields
function setupLevel5() {
    const usernameInput = document.getElementById('fragileUsername');
    const passwordInput = document.getElementById('fragilePassword');
    let fallenFields = [];
    
    // Remove easter egg - no auto-skip functionality
    
    function setupFragileInput(inputId, containerId, type) {
        const input = document.getElementById(inputId);
        const container = document.getElementById(containerId);
        let lastKeyTime = 0;
        let typingSpeed = 0;
        
        input.addEventListener('keydown', function(e) {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastKeyTime;
            lastKeyTime = currentTime;
            
            typingSpeed = timeDiff;
            
            if (timeDiff < 150 && this.value.length > 2) { // Typing too fast
                makeFieldFall(this, container, type);
            }
        });
    }
    
    function makeFieldFall(input, container, type) {
        // Create falling field
        const fallingField = document.createElement('div');
        fallingField.className = 'falling-field';
        fallingField.textContent = `${type} field (drag back to fix)`;
        fallingField.style.cssText = `
            position: absolute;
            background: #ff4444;
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: move;
            z-index: 1000;
            left: ${container.offsetLeft}px;
            top: ${container.offsetTop + 100}px;
            animation: fall 1s ease-in forwards;
        `;
        
        // Add fall animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                from { transform: translateY(0) rotate(0deg); }
                to { transform: translateY(200px) rotate(15deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Make draggable
        let isDragging = false;
        let startX, startY;
        
        fallingField.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX - this.offsetLeft;
            startY = e.clientY - this.offsetTop;
            this.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                fallingField.style.left = (e.clientX - startX) + 'px';
                fallingField.style.top = (e.clientY - startY) + 'px';
                
                // Check if dragged back to original position
                const rect = container.getBoundingClientRect();
                const fieldRect = fallingField.getBoundingClientRect();
                
                if (Math.abs(fieldRect.left - rect.left) < 50 && 
                    Math.abs(fieldRect.top - rect.top) < 50) {
                    // Field fixed!
                    input.style.display = 'block';
                    input.value = '';
                    fallingField.remove();
                    fallenFields = fallenFields.filter(f => f !== fallingField);
                }
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                fallingField.style.cursor = 'move';
            }
        });
        
        document.body.appendChild(fallingField);
        fallenFields.push(fallingField);
        
        // Hide original input
        input.style.display = 'none';
    }
    
    setupFragileInput('fragileUsername', 'usernameContainer', 'Username');
    setupFragileInput('fragilePassword', 'passwordContainer', 'Password');
      document.getElementById('next5').addEventListener('click', function() {
        const username = document.getElementById('fragileUsername').value.trim();
        const password = document.getElementById('fragilePassword').value.trim();
        
        // Check if all fields are restored and filled
        if (fallenFields.length === 0 && username && password) {
            // Validate proper credentials - require at least 4 characters each
            if (username.length >= 4 && password.length >= 4) {
                showSuccessAndAdvance(6);
            } else {
                attempts[4]++;
                document.getElementById('attempts5').textContent = attempts[4];
                
                // Show emergency skip after 10 attempts instead of 5
                if (attempts[4] >= 10) {
                    document.getElementById('emergencySkip').classList.remove('hidden');
                    document.getElementById('hint5').classList.remove('hidden');
                }
                
                alert('Username and password must be at least 4 characters each!');
            }
        } else {
            attempts[4]++;
            document.getElementById('attempts5').textContent = attempts[4];
            
            // Show emergency skip after 10 attempts instead of 5
            if (attempts[4] >= 10) {
                document.getElementById('emergencySkip').classList.remove('hidden');
                document.getElementById('hint5').classList.remove('hidden');
            }
            
            if (fallenFields.length > 0) {
                alert('Please fix all fallen fields first!');
            } else {
                alert('Please fill both username and password!');
            }
        }
    });
}

// Level 6: Random Spawning Submit Button
function setupLevel6() {
    const usernameInput = document.getElementById('spawningUsername');
    const passwordInput = document.getElementById('spawningPassword');
    const gameArea = document.getElementById('buttonGameArea');
    let submitButton = null;
    let buttonTimeout = null;
    let bothFieldsFilled = false;
    
    if (!usernameInput || !passwordInput || !gameArea) return; // Exit if elements don't exist
    
    // Set up game area styling
    gameArea.style.cssText = `
        position: relative;
        width: 100%;
        height: 400px;
        border: 2px solid #666;
        margin: 20px 0;
        background: #111;
        border-radius: 10px;
    `;
    
    // Auto-check for skip when typing (easter egg)
    function checkAutoSkip() {
        if (usernameInput.value.toLowerCase() === 'skip' && passwordInput.value.toLowerCase() === 'skip') {
            setTimeout(() => {
                removeButton();
                showSuccessAndAdvance(7);
            }, 500);
        }
    }
    
    usernameInput.addEventListener('input', checkAutoSkip);
    passwordInput.addEventListener('input', checkAutoSkip);
    
    function checkFieldsAndSpawnButton() {
        const usernameFilled = usernameInput.value.trim().length > 0;
        const passwordFilled = passwordInput.value.trim().length > 0;
        
        if (usernameFilled && passwordFilled && !bothFieldsFilled) {
            bothFieldsFilled = true;
            spawnRandomButton();
        } else if ((!usernameFilled || !passwordFilled) && bothFieldsFilled) {
            bothFieldsFilled = false;
            removeButton();
        }
    }
    
    function spawnRandomButton() {
        removeButton(); // Remove any existing button
        
        submitButton = document.createElement('button');
        submitButton.textContent = 'SUBMIT LOGIN';
        submitButton.style.cssText = `
            position: absolute;
            padding: 10px 20px;
            background: #00ff00;
            color: black;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            z-index: 1000;
            transition: all 0.2s ease;
        `;
        
        // Random position within game area
        const maxX = gameArea.offsetWidth - 150;
        const maxY = gameArea.offsetHeight - 40;
        submitButton.style.left = Math.random() * maxX + 'px';
        submitButton.style.top = Math.random() * maxY + 'px';
        
        // Button disappears after 1 second
        buttonTimeout = setTimeout(() => {
            removeButton();
            if (bothFieldsFilled) {
                setTimeout(spawnRandomButton, 500); // Spawn new button after 0.5s
            }
        }, 1000);
        
        submitButton.addEventListener('click', function() {
            clearTimeout(buttonTimeout);
            removeButton();
            showSuccessAndAdvance(7);
        });
        
        // Add hover effect
        submitButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 10px #00ff00';
        });
        
        submitButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        gameArea.appendChild(submitButton);
    }
    
    function removeButton() {
        if (submitButton && submitButton.parentNode) {
            submitButton.remove();
            submitButton = null;
        }
        if (buttonTimeout) {
            clearTimeout(buttonTimeout);
            buttonTimeout = null;
        }
    }
    
    // Monitor input fields
    usernameInput.addEventListener('input', checkFieldsAndSpawnButton);
    passwordInput.addEventListener('input', checkFieldsAndSpawnButton);
    
    // Clean up function
    function cleanup() {
        removeButton();
    }
    
    // Store cleanup function
    if (window.level6Cleanup) {
        window.level6Cleanup();
    }
    window.level6Cleanup = cleanup;
}

// Level 7: Complex Dropdown Selection
function setupLevel7() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    
    function createDropdownRow(containerId, length) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        for (let i = 0; i < length; i++) {
            const select = document.createElement('select');
            select.className = 'letter-dropdown';
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-';
            select.appendChild(defaultOption);
            
            alphabet.forEach(letter => {
                const option = document.createElement('option');
                option.value = letter;
                option.textContent = letter;
                select.appendChild(option);
            });
            
            container.appendChild(select);
        }
    }
    
    createDropdownRow('usernameDropdowns', 4);
    createDropdownRow('passwordDropdowns', 4);
    
    document.getElementById('next7').addEventListener('click', function() {
        const usernameDropdowns = document.querySelectorAll('#usernameDropdowns select');
        const passwordDropdowns = document.querySelectorAll('#passwordDropdowns select');
        
        const username = Array.from(usernameDropdowns).map(select => select.value).join('');
        const password = Array.from(passwordDropdowns).map(select => select.value).join('');
        
        checkSkip(7, username, password);
    });
}

// Level 8: Password Guessing Challenge
function setupLevel8() {
    const usernameInput = document.getElementById('passwordUsername');
    const passwordInput = document.getElementById('passwordPassword');
    let passwordVariations = [];
    let currentVariationIndex = 0;
    
    if (!usernameInput || !passwordInput) return; // Exit if elements don't exist
    
    // Auto-check for skip when typing (easter egg)
    function checkAutoSkip() {
        if (usernameInput.value.toLowerCase() === 'skip' && passwordInput.value.toLowerCase() === 'skip') {
            setTimeout(() => {
                showSuccessAndAdvance(9);
            }, 500);
        }
    }
    
    usernameInput.addEventListener('input', checkAutoSkip);
    passwordInput.addEventListener('input', checkAutoSkip);
    
    // Store the password when user types it
    passwordInput.addEventListener('blur', function() {
        if (this.value && this.value !== storedPassword) {
            storedPassword = this.value;
            generatePasswordVariations();
            showPasswordChallenge();
        }
    });
    
    function generatePasswordVariations() {
        passwordVariations = [];
        const original = storedPassword;
        
        // Create 5 variations of the password
        for (let i = 0; i < 5; i++) {
            let variation = '';
            for (let j = 0; j < original.length; j++) {
                if (Math.random() < 0.3) { // 30% chance to change character
                    variation += String.fromCharCode(97 + Math.floor(Math.random() * 26));
                } else {
                    variation += original[j];
                }
            }
            passwordVariations.push(variation);
        }
        
        // Ensure original password is in the list
        passwordVariations[Math.floor(Math.random() * passwordVariations.length)] = original;
        
        // Shuffle array
        passwordVariations.sort(() => Math.random() - 0.5);
    }
    
    function showPasswordChallenge() {
        // Get the password options container
        const optionsContainer = document.getElementById('passwordOptions');
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = ''; // Clear existing content
        
        passwordVariations.forEach((variation, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.style.cssText = `
                margin: 10px 0;
                padding: 15px;
                border: 2px solid #666;
                cursor: pointer;
                background: #222;
                border-radius: 5px;
                transition: all 0.3s ease;
            `;
            
            // Show only one random letter, rest as dots
            const visibleIndex = Math.floor(Math.random() * variation.length);
            let displayText = '';
            for (let i = 0; i < variation.length; i++) {
                displayText += i === visibleIndex ? variation[i] : '•';
            }
            
            optionDiv.innerHTML = `
                <span style="font-family: monospace; font-size: 18px; letter-spacing: 3px;">
                    ${displayText}
                </span>
                <small style="display: block; color: #888; margin-top: 5px;">
                    Option ${index + 1} (Length: ${variation.length})
                </small>
            `;
            
            optionDiv.addEventListener('click', function() {
                if (variation === storedPassword) {
                    optionDiv.style.background = '#00ff00';
                    optionDiv.style.color = '#000';
                    setTimeout(() => {
                        showSuccessAndAdvance(9);
                    }, 1000);
                } else {
                    optionDiv.style.background = '#ff0000';
                    setTimeout(() => {
                        attempts[7]++;
                        document.getElementById('attempts8').textContent = attempts[7];
                        updateEmergencySkipVisibility();
                        optionDiv.style.background = '#222';
                        optionDiv.style.color = '#fff';
                    }, 500);
                }
            });
            
            optionDiv.addEventListener('mouseenter', function() {
                if (this.style.background === 'rgb(34, 34, 34)' || this.style.background === '') {
                    this.style.background = '#444';
                }
            });
            
            optionDiv.addEventListener('mouseleave', function() {
                if (this.style.background === 'rgb(68, 68, 68)') {
                    this.style.background = '#222';
                }
            });
            
            optionsContainer.appendChild(optionDiv);
        });
    }
    
    // Initial setup message
    const setupDiv = document.createElement('div');
    setupDiv.innerHTML = `
        <p style="color: #fff; text-align: center; padding: 20px; background: #333; border-radius: 5px;">
            First, enter your username and password above, then click outside the password field to proceed to the confirmation challenge.
        </p>
    `;
    
    const optionsContainer = document.getElementById('passwordOptions');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        optionsContainer.appendChild(setupDiv);
    }
}

// Level 9: Random Popups
function setupLevel9() {
    const popupMessages = [
        "🎉 CONGRATULATIONS! You won $1000! Click here!",
        "⚠️ Your computer is infected! Download antivirus now!",
        "💰 Crypto opportunity! Invest now!",
        "🎮 You're the 1000th visitor! Claim your prize!",
        "📱 Your phone needs cleaning! Click here!",
        "🍕 Free pizza! Just enter your credit card!",
        "👑 You're invited to join our exclusive club!",
        "🎯 Don't miss this limited time offer!",
        "🔥 Hot singles in your area!",
        "💎 Rare NFT opportunity! Buy now!"
    ];
    
    let popupInterval;
    const usernameInput = document.getElementById('popupUsername');
    const passwordInput = document.getElementById('popupPassword');
    
    // Remove skip easter egg functionality - no auto-check for skip
    
    function createRandomPopup() {
        const popup = document.createElement('div');
        popup.className = 'random-popup';
        popup.textContent = popupMessages[Math.floor(Math.random() * popupMessages.length)];
        
        popup.style.left = Math.random() * (window.innerWidth - 300) + 'px';
        popup.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        
        popup.addEventListener('click', function() {
            this.remove();
        });
        
        document.getElementById('popupArea').appendChild(popup);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 5000);
    }
    
    // Start creating popups when level 9 is active
    function startPopups() {
        popupInterval = setInterval(createRandomPopup, 1000);
    }
    
    // Stop popups when leaving level
    function stopPopups() {
        clearInterval(popupInterval);
        document.getElementById('popupArea').innerHTML = '';
    }
    
    usernameInput.addEventListener('focus', startPopups);
    
    document.getElementById('next9').addEventListener('click', function() {
        const username = usernameInput.value;
        const password = passwordInput.value;
        
        if (checkSkip(9, username, password)) {
            stopPopups();
        }
    });
}

// Level 10: Terms & Conditions Only
function setupLevel10() {
    // Remove captcha section and go directly to T&C
    const captchaSection = document.querySelector('#level10 .captcha-section');
    if (captchaSection) {
        captchaSection.style.display = 'none';
    }
    
    document.getElementById('submitTnc').addEventListener('click', function() {
        const tncChoice = document.querySelector('input[name="tnc"]:checked');
        
        if (!tncChoice) {
            attempts[9]++;
            document.getElementById('attempts10').textContent = attempts[9];
            updateEmergencySkipVisibility();
            alert('Please select an option for Terms & Conditions');
            return;
        }
        
        if (tncChoice.value === 'yes') {
            showLevel('tncReading');
        } else {
            attempts[9]++;
            document.getElementById('attempts10').textContent = attempts[9];
            updateEmergencySkipVisibility();
            alert('You must agree to Terms & Conditions to proceed!');
        }
    });
}

function generateMegaCaptcha() {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';
    
    // Generate 400 tiny images (20x20 grid)
    for (let i = 0; i < 400; i++) {
        const img = document.createElement('div');
        img.className = 'captcha-image';
        
        // Random colors to simulate images
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#000000'];
        img.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random pattern to simulate traffic lights (rare)
        if (Math.random() < 0.05) {
            img.style.background = 'linear-gradient(to bottom, #ff0000 0%, #ffff00 50%, #00ff00 100%)';
            img.dataset.trafficLight = 'true';
        }
        
        img.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
        
        imageGrid.appendChild(img);
    }
}

// TNC Reading Screen
function setupTncReading() {
    const tncText = `
        <h2>TERMS AND CONDITIONS OF SERVICE</h2>
        
        <h3>1. ACCEPTANCE OF TERMS</h3>
        <p>By accessing this frustrating login system, you agree to become a different person. This transformation is irreversible and may include permanent changes to your personality, patience levels, and relationship with technology.</p>
        
        <h3>2. USER OBLIGATIONS</h3>
        <p>As a user of TryLogMe, you must:</p>
        <ul>
            <li>Maintain your sanity (good luck with that)</li>
            <li>Refrain from throwing your computer out of the window</li>
            <li>Accept responsibility for any psychological damage incurred</li>
            <li>Not hold us liable for any rage-induced incidents</li>
        </ul>
        
        <h3>3. PRIVACY POLICY</h3>
        <p>We collect and monitor the following data about you:</p>
        <ul>
            <li>Your patience level (measured in real-time)</li>
            <li>Your rage meter readings</li>
            <li>Your will to live (before and after usage)</li>
            <li>Your keyboard typing patterns when angry</li>
            <li>Audio recordings of your screaming (for quality improvement)</li>
        </ul>
        
        <h3>4. LIMITATION OF LIABILITY</h3>
        <p>TryLogMe and its developers are not responsible for:</p>
        <ul>
            <li>Broken keyboards, mice, or other peripherals</li>
            <li>Stress-induced hair loss or premature aging</li>
            <li>Existential crises or philosophical breakdowns</li>
            <li>Spontaneous combustion of electronic devices</li>
            <li>Relationship problems caused by user frustration</li>
            <li>Loss of faith in humanity or technology</li>
        </ul>
        
        <h3>5. REFUND POLICY</h3>
        <p>There are no refunds for:</p>
        <ul>
            <li>Lost time, sanity, or dignity</li>
            <li>Damaged property or relationships</li>
            <li>Your soul (all sales are final)</li>
        </ul>
        
        <h3>6. COOKIES AND TRACKING</h3>
        <p>We use cookies to make your experience even more frustrating. These cookies may contain nuts, existential dread, and traces of digital suffering. By continuing, you consent to being psychologically profiled.</p>
        
        <h3>7. MODIFICATIONS</h3>
        <p>We may change these terms whenever we feel like it, just to add more frustration to your life. Changes will be effective immediately and retroactively.</p>
        
        <h3>8. ACCOUNT TERMINATION</h3>
        <p>Your account may be terminated if you:</p>
        <ul>
            <li>Actually manage to complete all levels without rage</li>
            <li>Maintain your sanity throughout the entire process</li>
            <li>Don't rage quit at least three times</li>
            <li>Enjoy the experience (this is strictly prohibited)</li>
        </ul>
        
        <h3>9. GOVERNING LAW</h3>
        <p>These terms are governed by Murphy's Law: "Anything that can go wrong, will go wrong." In case of disputes, they will be settled in the Court of Digital Suffering.</p>
        
        <h3>10. FINAL WARNING</h3>
        <p>By continuing, you acknowledge that:</p>
        <ul>
            <li>You have willingly entered this digital torture chamber</li>
            <li>We warned you about becoming a different person</li>
            <li>You cannot claim ignorance about the consequences</li>
            <li>You agree to haunt our dreams if you don't survive this experience</li>
        </ul>
        
        <p style="text-align: center; font-weight: bold; color: #ff0000; margin-top: 30px;">
            Remember: You were warned! 😈<br>
            There is no going back once you proceed.
        </p>
    `;
    
    const tncContainer = document.getElementById('tncText');
    
    // Simulate reading aloud with proper formatting
    function readAloud() {
        tncContainer.innerHTML = tncText;
        
        // Add reading effect
        const paragraphs = tncContainer.querySelectorAll('p, li, h2, h3');
        let currentIndex = 0;
        
        const readingInterval = setInterval(() => {
            if (currentIndex < paragraphs.length) {
                // Remove previous highlights
                paragraphs.forEach(p => p.style.background = '');
                
                // Highlight current paragraph
                paragraphs[currentIndex].style.background = 'rgba(255, 255, 0, 0.3)';
                paragraphs[currentIndex].style.transition = 'background 0.3s ease';
                
                currentIndex++;
            } else {
                clearInterval(readingInterval);
                // Remove all highlights
                paragraphs.forEach(p => p.style.background = '');
                document.getElementById('startQuiz').classList.remove('hidden');
            }
        }, 800); // Read each paragraph every 800ms
    }
    
    // Start reading when TNC screen is shown
    setTimeout(readAloud, 1000);
    
    document.getElementById('startQuiz').addEventListener('click', function() {
        showLevel('quiz');
    });
}

// Quiz Screen
function setupQuiz() {
    const questions = [
        {
            question: "What happens when you access this login system?",
            options: ["You become happy", "You become a different person", "You get money", "You win a prize"],
            correct: 1
        },
        {
            question: "What are we NOT responsible for?",
            options: ["Your happiness", "Broken keyboards", "World peace", "Your success"],
            correct: 1
        },
        {
            question: "What law governs these terms?",
            options: ["International Law", "Murphy's Law", "Newton's Law", "Bird Law"],
            correct: 1
        },
        {
            question: "What do our cookies contain?",
            options: ["Sugar", "Nuts and existential dread", "Love", "Hope"],
            correct: 1
        },
        {
            question: "What is our refund policy?",
            options: ["Full refunds", "Partial refunds", "No refunds for lost sanity", "Free cookies"],
            correct: 2
        }
    ];
    
    function generateQuiz() {
        const quizContent = document.getElementById('quizContent');
        quizContent.innerHTML = '';
        
        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'quiz-question';
            
            let html = `<h4>Question ${index + 1}: ${q.question}</h4>`;
            q.options.forEach((option, optionIndex) => {
                html += `
                    <label>
                        <input type="radio" name="q${index}" value="${optionIndex}">
                        ${option}
                    </label>
                `;
            });
            
            questionDiv.innerHTML = html;
            quizContent.appendChild(questionDiv);
        });
    }
    
    generateQuiz();
    
    document.getElementById('submitQuiz').addEventListener('click', function() {
        let correct = 0;
        
        questions.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (selected && parseInt(selected.value) === q.correct) {
                correct++;
            }
        });
        
        if (correct >= 4) { // Need 80% to pass
            showLevel('success');
        } else {
            alert(`You scored ${correct}/${questions.length}. You need at least 4 correct answers. Restarting TNC reading...`);
            showLevel('tncReading');
        }
    });
}

// Success Screen
function setupSuccess() {
    document.getElementById('claimReward').addEventListener('click', function() {
        // Check if user is eligible for reward
        if (emergencySkipUsed) {
            alert('⚠️ REWARD UNAVAILABLE ⚠️\n\nSorry! You used the emergency skip button during your journey, which makes you ineligible for the reward.\n\nHowever, congratulations on surviving the TryLogMe experience!\n\nYou are still officially a different person! 🎯');
            
            // Still show confetti for completing the experience
            createConfetti();
            return;
        }
        
        const walletAddress = document.getElementById('walletAddress').value;
        
        if (!walletAddress) {
            alert('Please enter your wallet address to claim your reward!');
            return;
        }
        
        if (walletAddress.length < 20) {
            alert('Invalid wallet address! Please enter a valid address.');
            return;
        }
          // Simulate reward claim for eligible users with a trolling twist
        // First, save the wallet address locally
        try {
            const walletData = {
                address: walletAddress,
                timestamp: new Date().toISOString(),
                completedWithoutSkip: !emergencySkipUsed
            };
            
            let savedWallets = JSON.parse(localStorage.getItem('trylogme_wallets') || '[]');
            savedWallets.push(walletData);
            localStorage.setItem('trylogme_wallets', JSON.stringify(savedWallets));
            
            console.log('Wallet saved:', walletData);
        } catch (error) {
            console.error('Error saving wallet:', error);
        }
        
        // Show fake success message first
        alert(`🎉 CONGRATULATIONS! 🎉\n\nYou have successfully completed TryLogMe without using emergency skip!\n\nYour reward has been sent to: ${walletAddress}\n\nThank you for surviving the TryLogMe experience!\n\nYou are now officially a different person! 🎯`);
        
        // Show confetti first
        createConfetti();
        
        // After a delay, show the trolling message
        setTimeout(() => {
            alert('🤡 HEHE FUCK OFF NO REWARDS FOR YOU! 🤡\n\n😂 Did you really think we\'d give you free money for clicking buttons? 😂\n\nYou just got TryLogMe\'d! 🎯\n\nBut hey, at least you\'re officially a different person now! 🎭');
        }, 3000); // 3 second delay for dramatic effect
    });
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 3000);
        }, i * 50);
    }
}

// Add confetti animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);
