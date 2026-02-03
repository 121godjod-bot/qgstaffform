// ============================================
// CONFIGURATION - REPLACE THESE VALUES
// ============================================
const CONFIG = {
    // Discord OAuth2 Configuration
    DISCORD_CLIENT_ID: '1468266905176379555',
    DISCORD_REDIRECT_URI: 'https://qgrzstaff.vercel.app/', // Trailing slash for Discord OAuth2!

    // Discord Webhook URL
    WEBHOOK_URL: 'https://discord.com/api/webhooks/1468269228460212487/ToIqd_EJrMeXc0p4McSh7go8VqWRk6OT6pCZSYTwIp1erHJrDKt3nJRKDhjfacRbZ5Kq',

    // Server Logos (optional - leave empty to use placeholders)
    QUANTUM_LOGO: '', // URL to Quantum Gaming logo
    REDZONE_LOGO: ''  // URL to RedZone Esports logo
};

// ============================================
// ANTI-DEVELOPER TOOLS PROTECTION
// ============================================
(function() {
    'use strict';

    // Disable right-click
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', e => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // Detect DevTools
    const detectDevTools = () => {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:24px;color:#ff0000;">⚠️ Developer Tools Detected! Please close them and refresh the page.</div>';
        }
    };

    // Check periodically
    setInterval(detectDevTools, 1000);

    // Disable console
    if (!window.console) window.console = {};
    const methods = ["log", "debug", "warn", "info", "error"];
    methods.forEach(method => {
        console[method] = function() {};
    });
})();

// ============================================
// ROLE QUESTIONS DATABASE
// ============================================
const ROLE_QUESTIONS = {
    'CREW': [
        { question: '1. Why do you want to join the staff team?', type: 'long' },
        { question: '2. How active can you be daily on Discord?', type: 'short' },
        { question: '3. How would you help new members feel welcome?', type: 'long' },
        { question: '4. What would you do if two members start arguing in chat?', type: 'long' },
        { question: '5. Have you been staff in any other server before? (If yes, explain)', type: 'long' },
        { question: '6. Do you know basic Discord rules and etiquette?', type: 'boolean' },
        { question: '7. How do you handle criticism from seniors?', type: 'long' },
        { question: '**SCENARIO:** A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'COMMUNITY STAFF': [
        { question: '1. How would you increase chat activity in the server?', type: 'long' },
        { question: '2. What kind of events would you suggest for an eGaming server?', type: 'long' },
        { question: '3. How do you deal with toxic members without escalating fights?', type: 'long' },
        { question: '4. How would you handle a member who feels ignored?', type: 'long' },
        { question: '5. Have you ever managed or grown a community?', type: 'long' },
        { question: '6. How do you balance fun with rules?', type: 'long' },
        { question: '**SCENARIO:** A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'SCRIMS MANAGER': [
        { question: '1. What are scrims and why are they important?', type: 'long' },
        { question: '2. How would you schedule scrims between two teams?', type: 'long' },
        { question: '3. What would you do if a team doesn\'t show up?', type: 'long' },
        { question: '4. How do you handle disputes during scrims?', type: 'long' },
        { question: '5. Can you manage multiple teams at once?', type: 'boolean' },
        { question: '6. How will you ensure fair play during scrims?', type: 'long' },
        { question: '7. What games are you experienced with?', type: 'short' },
        { question: '**SCENARIO:** A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'TOURNAMENTS STAFF': [
        { question: '1. Have you ever helped in a tournament before?', type: 'boolean' },
        { question: '2. How would you manage registrations?', type: 'long' },
        { question: '3. What steps will you take to prevent cheating?', type: 'long' },
        { question: '4. How will you handle match delays?', type: 'long' },
        { question: '5. How do you deal with angry teams after losing?', type: 'long' },
        { question: '6. Do you understand brackets, rules, and match flow?', type: 'boolean' },
        { question: '7. How would you coordinate with Scrims Manager?', type: 'long' },
        { question: '**SCENARIO:** A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'HEAD MOD': [
        { question: '1. What makes a good moderator?', type: 'long' },
        { question: '2. How would you handle a staff member abusing power?', type: 'long' },
        { question: '3. How do you deal with raids or mass spam?', type: 'long' },
        { question: '4. When should a user be warned vs banned?', type: 'long' },
        { question: '5. How do you stay calm in heated situations?', type: 'long' },
        { question: '6. How would you train junior moderators?', type: 'long' },
        { question: '7. What moderation bots or tools do you know?', type: 'short' },
        { question: '**SCENARIO:** A popular player is breaking rules. What will you do?', type: 'long' }
    ],
    'SR STAFF': [
        { question: '1. What experience do you have managing large servers?', type: 'long' },
        { question: '2. How do you make important server decisions?', type: 'long' },
        { question: '3. How would you resolve conflict between two staff members?', type: 'long' },
        { question: '4. How do you ensure staff discipline and professionalism?', type: 'long' },
        { question: '5. How would you handle a server crisis?', type: 'long' },
        { question: '6. What improvements would you suggest for our server?', type: 'long' },
        { question: '7. Why should we trust you with high authority?', type: 'long' },
        { question: '**SCENARIO:** A popular player is breaking rules. What will you do?', type: 'long' }
    ]
};

// ============================================
// APPLICATION STATE
// ============================================
let appState = {
    currentStep: 1,
    userData: {
        discordId: '',
        email: '',
        displayName: '',
        username: '',
        avatar: ''
    },
    formData: {
        server: '',
        role: '',
        dob: '',
        age: 0,
        answers: {}
    }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set max date for DOB input (must be at least 13 years old)
    const dobInput = document.getElementById('dobInput');
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    dobInput.max = maxDate.toISOString().split('T')[0];

    // Check if returning from Discord OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        handleDiscordCallback(code);
    } else {
        setupEventListeners();
    }
}

function setupEventListeners() {
    // Discord Login
    document.getElementById('discordLoginBtn').addEventListener('click', initiateDiscordLogin);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Server Selection
    document.querySelectorAll('.server-card').forEach(card => {
        card.addEventListener('click', () => selectServer(card.dataset.server));
    });

    // Role Selection
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => selectRole(card.dataset.role));
    });

    // DOB Input
    document.getElementById('dobInput').addEventListener('change', calculateAge);

    // Agreement Checkbox
    document.getElementById('agreeCheckbox').addEventListener('change', (e) => {
        document.getElementById('continueBtn').disabled = !e.target.checked;
    });
}

// ============================================
// DISCORD OAUTH2
// ============================================
function initiateDiscordLogin() {
    const scopes = ['identify', 'email'];
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${CONFIG.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(CONFIG.DISCORD_REDIRECT_URI)}&scope=${scopes.join('%20')}`;

    window.location.href = discordAuthUrl;
}

async function handleDiscordCallback(code) {
    showLoading(true);

    try {
        // In a real implementation, you would exchange the code for an access token
        // through your backend server. For this demo, we'll simulate the user data.

        // This is a placeholder - In production, you need a backend to handle OAuth
        // For demo purposes, we'll use mock data
        setTimeout(() => {
            // Mock user data (in production, this would come from Discord API)
            appState.userData = {
                discordId: '123456789012345678',
                email: 'user@example.com',
                displayName: 'Discord User',
                username: 'discorduser#1234',
                avatar: 'https://cdn.discordapp.com/embed/avatars/0.png'
            };

            displayUserInfo();
            showAppScreen();
            showLoading(false);

            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 1500);

    } catch (error) {
        console.error('OAuth Error:', error);
        showLoading(false);
        alert('Failed to authenticate with Discord. Please try again.');
    }
}

function displayUserInfo() {
    document.getElementById('userAvatar').src = appState.userData.avatar;
    document.getElementById('userName').textContent = appState.userData.username;
}

function showAppScreen() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
}

function logout() {
    if (confirm('Are you sure you want to logout? All progress will be lost.')) {
        location.reload();
    }
}

// ============================================
// FORM NAVIGATION
// ============================================
function nextStep() {
    const currentStepDiv = document.getElementById(`step${appState.currentStep}`);

    // Validation
    if (!validateCurrentStep()) {
        return;
    }

    // Move to next step
    currentStepDiv.classList.remove('active');
    appState.currentStep++;

    const nextStepDiv = document.getElementById(`step${appState.currentStep}`);
    nextStepDiv.classList.add('active');

    updateProgress();
    updateStepIndicators();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function previousStep() {
    const currentStepDiv = document.getElementById(`step${appState.currentStep}`);
    currentStepDiv.classList.remove('active');

    appState.currentStep--;

    const prevStepDiv = document.getElementById(`step${appState.currentStep}`);
    prevStepDiv.classList.add('active');

    updateProgress();
    updateStepIndicators();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentStep() {
    switch (appState.currentStep) {
        case 1:
            if (!appState.formData.server) {
                alert('Please select a server!');
                return false;
            }
            return true;
        case 2:
            if (!appState.formData.role) {
                alert('Please select a role!');
                return false;
            }
            return true;
        case 3:
            if (!appState.formData.dob) {
                alert('Please enter your date of birth!');
                return false;
            }
            if (appState.formData.age < 13) {
                alert('You must be at least 13 years old to apply!');
                return false;
            }
            return true;
        default:
            return true;
    }
}

function updateProgress() {
    const progress = (appState.currentStep / 5) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function updateStepIndicators() {
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= appState.currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// ============================================
// SERVER SELECTION
// ============================================
function selectServer(server) {
    appState.formData.server = server;

    // Update UI
    document.querySelectorAll('.server-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-server="${server}"]`).classList.add('selected');

    // Apply theme
    applyTheme(server);

    // Auto-advance after selection
    setTimeout(() => nextStep(), 500);
}

function applyTheme(server) {
    document.body.classList.remove('quantum-theme', 'redzone-theme');

    if (server === 'quantum') {
        document.body.classList.add('quantum-theme');
        document.getElementById('serverName').textContent = 'Quantum Gaming';
        if (CONFIG.QUANTUM_LOGO) {
            document.getElementById('serverLogo').src = CONFIG.QUANTUM_LOGO;
            document.getElementById('serverLogo').style.display = 'block';
        }
    } else if (server === 'redzone') {
        document.body.classList.add('redzone-theme');
        document.getElementById('serverName').textContent = 'RedZone Esports';
        if (CONFIG.REDZONE_LOGO) {
            document.getElementById('serverLogo').src = CONFIG.REDZONE_LOGO;
            document.getElementById('serverLogo').style.display = 'block';
        }
    }
}

// ============================================
// ROLE SELECTION
// ============================================
function selectRole(role) {
    appState.formData.role = role;

    // Update UI
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-role="${role}"]`).classList.add('selected');

    // Auto-advance after selection
    setTimeout(() => nextStep(), 500);
}

// ============================================
// DATE OF BIRTH
// ============================================
function calculateAge() {
    const dob = document.getElementById('dobInput').value;

    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    appState.formData.dob = dob;
    appState.formData.age = age;

    document.getElementById('ageValue').textContent = age;

    if (age < 13) {
        document.getElementById('ageDisplay').style.color = '#f04747';
    } else {
        document.getElementById('ageDisplay').style.color = '#43b581';
    }
}

// ============================================
// RULES & QUESTIONS
// ============================================
function proceedToQuestions() {
    if (!document.getElementById('agreeCheckbox').checked) {
        alert('You must agree to the rules before proceeding!');
        return;
    }

    loadQuestions();
    nextStep();
}

function loadQuestions() {
    const questions = ROLE_QUESTIONS[appState.formData.role];
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    document.getElementById('questionsTitle').textContent = `${appState.formData.role} - Application Questions`;

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';

        const label = document.createElement('label');
        label.className = 'question-label';
        label.textContent = q.question;

        let input;

        if (q.type === 'boolean') {
            input = document.createElement('select');
            input.className = 'question-input';
            input.innerHTML = `
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            `;
        } else if (q.type === 'short') {
            input = document.createElement('input');
            input.type = 'text';
            input.className = 'question-input';
            input.placeholder = 'Your answer...';
        } else {
            input = document.createElement('textarea');
            input.className = 'question-textarea';
            input.placeholder = 'Write your detailed answer here...';
            input.rows = 5;
        }

        input.dataset.questionIndex = index;
        input.required = true;

        questionDiv.appendChild(label);
        questionDiv.appendChild(input);
        container.appendChild(questionDiv);
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
        appState.formData.answers[questions[index].question] = answer;
    });

    if (!allAnswered) {
        alert('Please answer all questions before submitting!');
        return;
    }

    showLoading(true);

    try {
        await sendToDiscordWebhook();
        showLoading(false);
        showSuccessModal();
    } catch (error) {
        showLoading(false);
        alert('Failed to submit application. Please try again.');
        console.error('Submission error:', error);
    }
}

async function sendToDiscordWebhook() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const formattedDate = istTime.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    // Build answers text
    let answersText = '';
    const questions = ROLE_QUESTIONS[appState.formData.role];
    questions.forEach(q => {
        const answer = appState.formData.answers[q.question] || 'No answer';
        answersText += `**${q.question}**\n${answer}\n\n`;
    });

    // Create embed color based on server
    const embedColor = appState.formData.server === 'quantum' ? 0x0066ff : 0xff0000;

    const payload = {
        content: `📋 **NEW STAFF APPLICATION RECEIVED**`,
        embeds: [
            {
                title: '👤 Applicant Information',
                color: embedColor,
                fields: [
                    {
                        name: '📧 Email',
                        value: appState.userData.email,
                        inline: true
                    },
                    {
                        name: '👤 Display Name',
                        value: appState.userData.displayName,
                        inline: true
                    },
                    {
                        name: '🆔 Username',
                        value: appState.userData.username,
                        inline: true
                    },
                    {
                        name: '📅 Date of Submission',
                        value: formattedDate + ' IST',
                        inline: false
                    },
                    {
                        name: '🎮 Server',
                        value: appState.formData.server === 'quantum' ? 'Quantum Gaming' : 'RedZone Esports',
                        inline: true
                    },
                    {
                        name: '🎯 Applied Role',
                        value: appState.formData.role,
                        inline: true
                    },
                    {
                        name: '🎂 Date of Birth',
                        value: appState.formData.dob,
                        inline: true
                    },
                    {
                        name: '📊 Age',
                        value: appState.formData.age.toString() + ' years',
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Staff Application System'
                }
            },
            {
                title: `📝 ${appState.formData.role} - Answers`,
                description: answersText.length > 4000 ? answersText.substring(0, 4000) + '...\n*(Answer truncated due to length)*' : answersText,
                color: embedColor,
                timestamp: new Date().toISOString()
            }
        ]
    };

    const response = await fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Webhook request failed');
    }
}

// ============================================
// UI HELPERS
// ============================================
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
}

function resetApplication() {
    location.reload();
}
