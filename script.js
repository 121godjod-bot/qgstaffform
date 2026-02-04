// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    DISCORD_CLIENT_ID: '1468266905176379555',
    REDIRECT_URI: 'https://qgrzstaff.vercel.app/',
    WEBHOOK_URL: 'https://discord.com/api/webhooks/1468269228460212487/ToIqd_EJrMeXc0p4McSh7go8VqWRk6OT6pCZSYTwIp1erHJrDKt3nJRKDhjfacRbZ5Kq',
    SCOPES: 'identify email'
};

const AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CONFIG.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(CONFIG.REDIRECT_URI)}&response_type=token&scope=${encodeURIComponent(CONFIG.SCOPES)}`;

// ============================================
// GLOBAL STATE
// ============================================
let appState = {
    server: null,
    theme: null,
    user: null,
    token: null,
    currentStep: 1,
    formData: {
        displayName: '',
        age: '',
        role: '',
        answers: {}
    }
};

// ============================================
// ROLE QUESTIONS
// ============================================
const ROLE_QUESTIONS = {
    'CREW': [
        { q: '1. Why do you want to join the staff team?', type: 'long' },
        { q: '2. How active can you be daily on Discord?', type: 'short' },
        { q: '3. How would you help new members feel welcome?', type: 'long' },
        { q: '4. What would you do if two members start arguing in chat?', type: 'long' },
        { q: '5. Have you been staff in any other server before? (If yes, explain)', type: 'long' },
        { q: '6. Do you know basic Discord rules and etiquette?', type: 'boolean' },
        { q: '7. How do you handle criticism from seniors?', type: 'long' },
        { q: 'SCENARIO: A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'COMMUNITY STAFF': [
        { q: '1. How would you increase chat activity in the server?', type: 'long' },
        { q: '2. What kind of events would you suggest for an eGaming server?', type: 'long' },
        { q: '3. How do you deal with toxic members without escalating fights?', type: 'long' },
        { q: '4. How would you handle a member who feels ignored?', type: 'long' },
        { q: '5. Have you ever managed or grown a community?', type: 'long' },
        { q: '6. How do you balance fun with rules?', type: 'long' },
        { q: 'SCENARIO: A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'SCRIMS MANAGER': [
        { q: '1. What are scrims and why are they important?', type: 'long' },
        { q: '2. How would you schedule scrims between two teams?', type: 'long' },
        { q: '3. What would you do if a team doesn\'t show up?', type: 'long' },
        { q: '4. How do you handle disputes during scrims?', type: 'long' },
        { q: '5. Can you manage multiple teams at once?', type: 'boolean' },
        { q: '6. How will you ensure fair play during scrims?', type: 'long' },
        { q: '7. What games are you experienced with?', type: 'short' },
        { q: 'SCENARIO: A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'TOURNAMENTS STAFF': [
        { q: '1. Have you ever helped in a tournament before?', type: 'boolean' },
        { q: '2. How would you manage registrations?', type: 'long' },
        { q: '3. What steps will you take to prevent cheating?', type: 'long' },
        { q: '4. How will you handle match delays?', type: 'long' },
        { q: '5. How do you deal with angry teams after losing?', type: 'long' },
        { q: '6. Do you understand brackets, rules, and match flow?', type: 'boolean' },
        { q: '7. How would you coordinate with Scrims Manager?', type: 'long' },
        { q: 'SCENARIO: A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'HEAD MOD': [
        { q: '1. What makes a good moderator?', type: 'long' },
        { q: '2. How would you handle a staff member abusing power?', type: 'long' },
        { q: '3. How do you deal with raids or mass spam?', type: 'long' },
        { q: '4. When should a user be warned vs banned?', type: 'long' },
        { q: '5. How do you stay calm in heated situations?', type: 'long' },
        { q: '6. How would you train junior moderators?', type: 'long' },
        { q: '7. What moderation bots or tools do you know?', type: 'short' },
        { q: 'SCENARIO: A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'SR STAFF': [
        { q: '1. What experience do you have managing large servers?', type: 'long' },
        { q: '2. How do you make important server decisions?', type: 'long' },
        { q: '3. How would you resolve conflict between two staff members?', type: 'long' },
        { q: '4. How do you ensure staff discipline and professionalism?', type: 'long' },
        { q: '5. How would you handle a server crisis?', type: 'long' },
        { q: '6. What improvements would you suggest for our server?', type: 'long' },
        { q: '7. Why should we trust you with high authority?', type: 'long' },
        { q: 'SCENARIO: A popular player is breaking rules. What will you do?', type: 'long' }
    ]
};

// ============================================
// PARTICLE CANVAS ANIMATION
// ============================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            const color = appState.theme === 'red' ? '255, 0, 0' : '0, 212, 255';
            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================
// OAUTH2 HANDLING
// ============================================
function parseTokenFromHash() {
    if (location.hash && location.hash.includes('access_token')) {
        const params = new URLSearchParams(location.hash.slice(1));
        const token = params.get('access_token');
        const expires_in = params.get('expires_in');
        
        if (token) {
            const data = {
                token,
                timestamp: Date.now(),
                expires_in: Number(expires_in) || 604800
            };
            localStorage.setItem('discord_token', JSON.stringify(data));
            history.replaceState(null, '', CONFIG.REDIRECT_URI);
            return token;
        }
    }
    
    const stored = localStorage.getItem('discord_token');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            const elapsed = Date.now() - data.timestamp;
            if (elapsed < (data.expires_in * 1000)) {
                return data.token;
            } else {
                localStorage.removeItem('discord_token');
            }
        } catch (e) {
            localStorage.removeItem('discord_token');
        }
    }
    
    return null;
}

async function fetchDiscordUser(token) {
    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch user');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

function initiateDiscordLogin() {
    window.location.href = AUTH_URL;
}

function logout() {
    localStorage.removeItem('discord_token');
    sessionStorage.clear();
    location.reload();
}

// ============================================
// SCREEN MANAGEMENT
// ============================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ============================================
// THEME SWITCHING WITH ANIMATION
// ============================================
function applyTheme(theme) {
    document.body.classList.add('theme-transitioning');
    
    if (theme === 'red') {
        document.body.classList.add('red-theme');
    } else {
        document.body.classList.remove('red-theme');
    }
    
    setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
    }, 1000);
}

// ============================================
// SERVER SELECTION
// ============================================
function selectServer(server, theme) {
    appState.server = server;
    appState.theme = theme;
    
    sessionStorage.setItem('selected_server', server);
    sessionStorage.setItem('selected_theme', theme);
    
    // Apply theme with animation
    applyTheme(theme);
    
    // Update login screen badge
    const badge = document.getElementById('selectedServerBadge');
    badge.textContent = server === 'quantum' ? 'QG' : 'RZ';
    
    // Check if already logged in
    if (appState.token && appState.user) {
        populateUserInfo();
        showScreen('appScreen');
    } else {
        showScreen('loginScreen');
    }
}

function backToServerSelect() {
    sessionStorage.removeItem('selected_server');
    sessionStorage.removeItem('selected_theme');
    showScreen('serverSelection');
}

// ============================================
// USER INFO POPULATION
// ============================================
function populateUserInfo() {
    const user = appState.user;
    
    // Top nav
    const username = user.discriminator && user.discriminator !== '0' 
        ? `${user.username}#${user.discriminator}` 
        : user.username;
    
    document.getElementById('navUsername').textContent = username;
    
    const avatar = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.id) >> 22) % 6}.png`;
    
    document.getElementById('userAvatar').src = avatar;
    
    // Server logo in nav
    const logo = document.getElementById('navServerLogo');
    logo.textContent = appState.server === 'quantum' ? 'QG' : 'RZ';
    document.getElementById('navServerName').textContent = appState.server === 'quantum' ? 'QUANTUM GAMING' : 'REDZONE ESPORTS';
    
    // Form fields
    document.getElementById('username').value = username;
    document.getElementById('email').value = user.email || 'No email provided';
    document.getElementById('displayName').value = user.username;
}

// ============================================
// STEP NAVIGATION
// ============================================
function updateProgressTracker(step) {
    const steps = document.querySelectorAll('.progress-step');
    const progressLine = document.getElementById('progressLine');
    
    steps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
    
    const progress = ((step - 1) / (steps.length - 1)) * 100;
    progressLine.style.width = `${progress}%`;
}

function showStep(stepNumber) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(`step${stepNumber}`).classList.add('active');
    appState.currentStep = stepNumber;
    updateProgressTracker(stepNumber);
}

function goToNextStep() {
    // Validation for each step
    if (appState.currentStep === 1) {
        const displayName = document.getElementById('displayName').value.trim();
        const age = document.getElementById('age').value;
        
        if (!displayName || displayName.length < 2) {
            alert('Please enter a valid display name (at least 2 characters)');
            return;
        }
        
        if (!age || age < 13 || age > 99) {
            alert('Please enter a valid age (13-99)');
            return;
        }
        
        appState.formData.displayName = displayName;
        appState.formData.age = age;
    }
    
    if (appState.currentStep === 2) {
        if (!appState.formData.role) {
            alert('Please select a role');
            return;
        }
    }
    
    if (appState.currentStep === 3) {
        const rulesChecked = document.getElementById('rulesAgree').checked;
        if (!rulesChecked) {
            alert('You must agree to the rules to continue');
            return;
        }
    }
    
    if (appState.currentStep < 4) {
        showStep(appState.currentStep + 1);
    }
}

function goToPrevStep() {
    if (appState.currentStep > 1) {
        showStep(appState.currentStep - 1);
    }
}

// ============================================
// ROLE SELECTION
// ============================================
function selectRole(role) {
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    event.target.closest('.role-card').classList.add('selected');
    appState.formData.role = role;
    
    // Load questions for this role
    loadQuestions(role);
}

function loadQuestions(role) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    const questions = ROLE_QUESTIONS[role];
    
    questions.forEach((q, index) => {
        const block = document.createElement('div');
        block.className = 'question-block';
        
        const label = document.createElement('label');
        label.className = 'question-label';
        label.textContent = q.q;
        
        let input;
        if (q.type === 'long') {
            input = document.createElement('textarea');
            input.className = 'question-textarea';
            input.placeholder = 'Write your answer here...';
            input.required = true;
        } else if (q.type === 'short') {
            input = document.createElement('input');
            input.type = 'text';
            input.className = 'question-input';
            input.placeholder = 'Your answer...';
            input.required = true;
        } else if (q.type === 'boolean') {
            input = document.createElement('select');
            input.className = 'question-input';
            input.innerHTML = '<option value="">Choose...</option><option value="Yes">Yes</option><option value="No">No</option>';
            input.required = true;
        }
        
        input.dataset.questionIndex = index;
        
        block.appendChild(label);
        block.appendChild(input);
        container.appendChild(block);
    });
}

// ============================================
// FORM SUBMISSION
// ============================================
async function submitApplication() {
    // Collect answers
    const inputs = document.querySelectorAll('#questionsContainer input, #questionsContainer textarea, #questionsContainer select');
    const questions = ROLE_QUESTIONS[appState.formData.role];
    
    appState.formData.answers = {};
    
    let allAnswered = true;
    inputs.forEach((input, index) => {
        const answer = input.value.trim();
        if (!answer) {
            allAnswered = false;
        }
        appState.formData.answers[questions[index].q] = answer;
    });
    
    if (!allAnswered) {
        alert('Please answer all questions before submitting');
        return;
    }
    
    // Show loading
    document.getElementById('loadingOverlay').classList.add('active');
    
    try {
        await sendToWebhook();
        document.getElementById('loadingOverlay').classList.remove('active');
        showScreen('thankYouScreen');
    } catch (error) {
        document.getElementById('loadingOverlay').classList.remove('active');
        alert('Failed to submit application. Please try again.');
        console.error(error);
    }
}

async function sendToWebhook() {
    const now = new Date();
    const istTime = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    const username = appState.user.discriminator && appState.user.discriminator !== '0'
        ? `${appState.user.username}#${appState.user.discriminator}`
        : appState.user.username;
    
    // Plain text for basic info
    let plainText = `**NEW STAFF APPLICATION RECEIVED**

Display Name: ${appState.formData.displayName}
Email: ${appState.user.email || 'No email provided'}
Username: ${username}
Age: ${appState.formData.age}
Date of Submission: ${istTime} IST
Server: ${appState.server === 'quantum' ? 'Quantum Gaming' : 'RedZone Esports'}
`;
    
    // Embed for questions and answers
    let answersText = '';
    Object.keys(appState.formData.answers).forEach(question => {
        answersText += `**${question}**\n${appState.formData.answers[question]}\n\n`;
    });
    
    // Truncate if too long
    if (answersText.length > 4000) {
        answersText = answersText.substring(0, 4000) + '...\n*(Truncated)*';
    }
    
    const embedColor = appState.theme === 'blue' ? 0x00d4ff : 0xff0000;
    
    const payload = {
        content: plainText,
        embeds: [{
            title: `${appState.formData.role} - Application Answers`,
            description: answersText,
            color: embedColor,
            timestamp: now.toISOString(),
            footer: { text: 'Staff Application System' }
        }]
    };
    
    const response = await fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error('Webhook failed');
    }
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    // Server selection cards
    document.querySelectorAll('.server-option').forEach(option => {
        option.addEventListener('click', () => {
            const server = option.dataset.server;
            const theme = option.dataset.theme;
            selectServer(server, theme);
        });
    });
    
    // Back to server select
    const backBtn = document.getElementById('backToServerBtn');
    if (backBtn) {
        backBtn.addEventListener('click', backToServerSelect);
    }
    
    // Discord login button
    const loginBtn = document.getElementById('discordLoginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', initiateDiscordLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Step navigation buttons
    const step1NextBtn = document.getElementById('step1NextBtn');
    if (step1NextBtn) {
        step1NextBtn.addEventListener('click', goToNextStep);
    }
    
    const step2BackBtn = document.getElementById('step2BackBtn');
    if (step2BackBtn) {
        step2BackBtn.addEventListener('click', goToPrevStep);
    }
    
    const step2NextBtn = document.getElementById('step2NextBtn');
    if (step2NextBtn) {
        step2NextBtn.addEventListener('click', goToNextStep);
    }
    
    const step3BackBtn = document.getElementById('step3BackBtn');
    if (step3BackBtn) {
        step3BackBtn.addEventListener('click', goToPrevStep);
    }
    
    const step3NextBtn = document.getElementById('step3NextBtn');
    if (step3NextBtn) {
        step3NextBtn.addEventListener('click', goToNextStep);
    }
    
    const step4BackBtn = document.getElementById('step4BackBtn');
    if (step4BackBtn) {
        step4BackBtn.addEventListener('click', goToPrevStep);
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitApplication);
    }
    
    // Role cards
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', function() {
            selectRole(this.dataset.role);
        });
    });
    
    // Rules agreement checkbox
    const rulesCheckbox = document.getElementById('rulesAgree');
    const continueBtn = document.getElementById('step3NextBtn');
    
    if (rulesCheckbox && continueBtn) {
        rulesCheckbox.addEventListener('change', (e) => {
            continueBtn.disabled = !e.target.checked;
        });
    }
    
    // Apply again button
    const applyAgainBtn = document.getElementById('applyAgainBtn');
    if (applyAgainBtn) {
        applyAgainBtn.addEventListener('click', () => {
            location.reload();
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================
async function initApp() {
    // Initialize particles
    initParticles();
    
    // Check for Discord token
    const token = parseTokenFromHash();
    
    if (token) {
        appState.token = token;
        const user = await fetchDiscordUser(token);
        
        if (user) {
            appState.user = user;
            
            // Check if server was already selected
            const savedServer = sessionStorage.getItem('selected_server');
            const savedTheme = sessionStorage.getItem('selected_theme');
            
            if (savedServer && savedTheme) {
                appState.server = savedServer;
                appState.theme = savedTheme;
                
                // Apply theme without animation on initial load
                if (savedTheme === 'red') {
                    document.body.classList.add('red-theme');
                }
                
                // Populate user info
                populateUserInfo();
                
                // Show app screen
                showScreen('appScreen');
            } else {
                // Show server selection (user is logged in but no server selected yet)
                showScreen('serverSelection');
            }
        }
    } else {
        // No token, show server selection
        showScreen('serverSelection');
    }
    
    // Setup event listeners
    setupEventListeners();
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
