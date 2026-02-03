// -----------------------------
// Staff Application - script.js
// -----------------------------
// This script expects to read config from <body data-discord-client-id data-redirect-uri data-webhook-url>
// Example: <body data-discord-client-id="..." data-redirect-uri="https://..." data-webhook-url="https://...">

// --- helper: read config from body attributes ---
const CONFIG = (function readConfig() {
  const ds = document.body.dataset;
  return {
    DISCORD_CLIENT_ID: ds.discordClientId || '',       // set in index.html data-discord-client-id
    DISCORD_REDIRECT_URI: ds.redirectUri || ds.redirectUri || ds.redirect || '', // data-redirect-uri
    WEBHOOK_URL: ds.webhookUrl || ''                   // data-webhook-url
  };
})();

// Minimal role question set (keeps your original questions)
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

// -------------------------
// appState (keeps track)
// -------------------------
let appState = {
  currentStep: 1,
  userData: { discordId: '', email: '', displayName: '', username: '', avatar: '' },
  formData: { server: '', role: '', dob: '', age: 0, answers: {} }
};

// -------------------------
// initialization
// -------------------------
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  // safe guard: set dob max
  const dobInput = document.getElementById('dobInput');
  if (dobInput) {
    const today = new Date();
    const max = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    dobInput.max = max.toISOString().split('T')[0];
  }

  // populate rules (kept short here; you can expand)
  const rulesContent = document.getElementById('rulesContent');
  if (rulesContent) {
    rulesContent.innerHTML = `
      <div class="rule-item"><span class="rule-number">1.</span><span class="rule-text"><strong>Do NOT use AI tools</strong> (ChatGPT, Bard, etc.) — AI generated applications will be rejected.</span></div>
      <div class="rule-item"><span class="rule-number">2.</span><span class="rule-text"><strong>Answer honestly and in your own words.</strong></span></div>
      <div class="rule-item"><span class="rule-number">3.</span><span class="rule-text"><strong>One application only.</strong></span></div>
      <div class="warning-box"><h3>⚠️ IMPORTANT</h3><p>If found using AI or copied content: immediate rejection.</p></div>
    `;
  }

  // devtools detection (non-destructive overlay)
  setupDevtoolsDetection();

  // handle OAuth redirect code / error
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const err = params.get('error') || params.get('error_description');
  if (err) {
    showLoginMessage('Discord OAuth returned an error: ' + err, true);
    // leave setup listeners so user can demo-login
    setupEventListeners();
    return;
  }

  if (code) {
    // NOTE: you need a backend to exchange the code for tokens.
    // For now we simulate the callback (demo mode).
    showLoading(true);
    setTimeout(() => {
      simulateLogin(); // mock the user after OAuth redirect for demo/testing
      showLoading(false);
      // clean the URL so user doesn't see code param
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 900);
    return;
  }

  // normal path (no code): attach handlers
  setupEventListeners();
}

function setupEventListeners() {
  const discordBtn = document.getElementById('discordLoginBtn');
  if (discordBtn) discordBtn.addEventListener('click', initiateDiscordLogin);

  const demoBtn = document.getElementById('demoLoginBtn');
  if (demoBtn) demoBtn.addEventListener('click', simulateLogin);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // server cards
  document.querySelectorAll('.server-card').forEach(card => card.addEventListener('click', () => selectServer(card.dataset.server)));

  // role cards
  document.querySelectorAll('.role-card').forEach(card => card.addEventListener('click', () => selectRole(card.dataset.role)));

  // dob
  const dob = document.getElementById('dobInput');
  if (dob) dob.addEventListener('change', calculateAge);

  // agreement
  const agree = document.getElementById('agreeCheckbox');
  if (agree) agree.addEventListener('change', (e) => {
    document.getElementById('continueBtn').disabled = !e.target.checked;
  });

  // devtools overlay close
  const devClose = document.getElementById('devtoolsCloseBtn');
  if (devClose) devClose.addEventListener('click', () => {
    document.getElementById('devtoolsOverlay').classList.add('hidden');
  });

  // username click to edit displayName
  const userName = document.getElementById('userName');
  if (userName) userName.addEventListener('click', () => {
    const newName = prompt('Change display name:', appState.userData.displayName || appState.userData.username || '');
    if (newName !== null && newName.trim()) {
      appState.userData.displayName = newName.trim();
      displayUserInfo();
    }
  });
}

// -------------------------------
// DevTools detection overlay
// -------------------------------
function setupDevtoolsDetection() {
  let last = Date.now();
  setInterval(() => {
    const threshold = 160;
    const w = window.outerWidth - window.innerWidth;
    const h = window.outerHeight - window.innerHeight;
    if (w > threshold || h > threshold) {
      // show overlay but keep page intact
      document.getElementById('devtoolsOverlay').classList.remove('hidden');
    }
  }, 1000);
}

// -------------------------------
// OAuth (client-side redirect only)
// -------------------------------
function initiateDiscordLogin() {
  if (!CONFIG.DISCORD_CLIENT_ID || !CONFIG.DISCORD_REDIRECT_URI) {
    showLoginMessage('Missing DISCORD_CLIENT_ID or REDIRECT_URI in index.html body data attributes.', true);
    return;
  }
  const scopes = ['identify', 'email'];
  const url = `https://discord.com/api/oauth2/authorize?client_id=${encodeURIComponent(CONFIG.DISCORD_CLIENT_ID)}&redirect_uri=${encodeURIComponent(CONFIG.DISCORD_REDIRECT_URI)}&response_type=code&scope=${scopes.join('%20')}`;
  // redirect user
  window.location.href = url;
}

// -------------------------------
// Demo login / simulate result of OAuth (autofill user)
// -------------------------------
function simulateLogin() {
  appState.userData = {
    discordId: '99999999999999999',
    email: 'demo.user@example.com',
    displayName: 'Demo User',
    username: 'demouser#0001',
    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png'
  };
  displayUserInfo();
  showAppScreen();
}

// display user header
function displayUserInfo() {
  const avatar = document.getElementById('userAvatar');
  const name = document.getElementById('userName');
  if (avatar) avatar.src = appState.userData.avatar || '';
  if (name) name.textContent = appState.userData.displayName || appState.userData.username || 'User';
}

// show app screen
function showAppScreen() {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('appScreen').classList.add('active');
}

// logout
function logout() {
  if (!confirm('Logout and lose progress?')) return;
  // simple reload
  location.reload();
}

// -------------------------------
// Steps & progress
// -------------------------------
function nextStep() {
  if (!validateCurrentStep()) return;
  document.getElementById(`step${appState.currentStep}`).classList.remove('active');
  appState.currentStep++;
  document.getElementById(`step${appState.currentStep}`).classList.add('active');
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function previousStep() {
  document.getElementById(`step${appState.currentStep}`).classList.remove('active');
  appState.currentStep = Math.max(1, appState.currentStep - 1);
  document.getElementById(`step${appState.currentStep}`).classList.add('active');
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentStep() {
  if (appState.currentStep === 1 && !appState.formData.server) { alert('Select server'); return false; }
  if (appState.currentStep === 2 && !appState.formData.role) { alert('Select role'); return false; }
  if (appState.currentStep === 3) {
    if (!appState.formData.dob) { alert('Enter date of birth'); return false; }
    if (appState.formData.age < 13) { alert('Minimum age 13'); return false; }
  }
  return true;
}

function updateProgress() {
  const fill = document.getElementById('progressFill');
  const pct = (appState.currentStep / 5) * 100;
  if (fill) fill.style.width = `${pct}%`;
}

// server selection
function selectServer(server) {
  appState.formData.server = server;
  document.querySelectorAll('.server-card').forEach(c => c.classList.remove('selected'));
  const el = document.querySelector(`.server-card[data-server="${server}"]`);
  if (el) el.classList.add('selected');
  applyTheme(server);
  // small delay then next
  setTimeout(nextStep, 350);
}

function applyTheme(server) {
  document.body.classList.remove('quantum-theme', 'redzone-theme');
  const logo = document.getElementById('serverLogo');
  const name = document.getElementById('serverName');
  if (server === 'quantum') {
    document.body.classList.add('quantum-theme');
    if (name) name.textContent = 'Quantum Gaming';
    if (logo) { logo.src = ''; logo.style.display = 'none'; }
  } else {
    document.body.classList.add('redzone-theme');
    if (name) name.textContent = 'RedZone Esports';
    if (logo) { logo.src = ''; logo.style.display = 'none'; }
  }
}

// role
function selectRole(role) {
  appState.formData.role = role;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  const el = document.querySelector(`.role-card[data-role="${role}"]`);
  if (el) el.classList.add('selected');
  setTimeout(nextStep, 350);
}

// dob -> age
function calculateAge() {
  const val = document.getElementById('dobInput').value;
  if (!val) return;
  const birth = new Date(val);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  appState.formData.dob = val;
  appState.formData.age = age;
  const ageEl = document.getElementById('ageValue');
  if (ageEl) ageEl.textContent = age;
  const ageDisp = document.getElementById('ageDisplay');
  if (ageDisp) ageDisp.style.color = (age < 13 ? 'var(--danger)' : 'var(--success)');
}

// rules -> questions
function proceedToQuestions() {
  const agree = document.getElementById('agreeCheckbox');
  if (!agree || !agree.checked) { alert('You must accept rules'); return; }
  loadQuestions();
  nextStep();
}

function loadQuestions() {
  const questions = ROLE_QUESTIONS[appState.formData.role] || [];
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';
  document.getElementById('questionsTitle').textContent = `${appState.formData.role} - Application Questions`;
  questions.forEach((q, i) => {
    const wrapper = document.createElement('div'); wrapper.className = 'question-item';
    const label = document.createElement('label'); label.className = 'question-label'; label.textContent = q.question;
    let input;
    if (q.type === 'boolean') {
      input = document.createElement('select'); input.className = 'question-input';
      input.innerHTML = `<option value="">Select</option><option>Yes</option><option>No</option>`;
    } else if (q.type === 'short') {
      input = document.createElement('input'); input.type = 'text'; input.className = 'question-input'; input.placeholder = 'Answer...';
    } else {
      input = document.createElement('textarea'); input.className = 'question-textarea'; input.placeholder = 'Detailed answer...'; input.rows = 5;
    }
    input.dataset.index = i;
    wrapper.appendChild(label); wrapper.appendChild(input); container.appendChild(wrapper);
  });
}

// submit
async function submitApplication() {
  const inputs = Array.from(document.querySelectorAll('#questionsContainer input, #questionsContainer textarea, #questionsContainer select'));
  const questions = ROLE_QUESTIONS[appState.formData.role] || [];
  const answers = {};
  let all = true;
  inputs.forEach((inp, idx) => {
    const v = inp.value.trim();
    if (!v) all = false;
    answers[questions[idx].question] = v || 'No answer';
  });
  if (!all) { alert('Please answer all questions'); return; }
  appState.formData.answers = answers;

  showLoading(true);
  try {
    await sendToDiscordWebhook();
    showLoading(false);
    showSuccessModal();
  } catch (e) {
    showLoading(false);
    alert('Failed to submit: ' + e.message);
    console.error(e);
  }
}

async function sendToDiscordWebhook() {
  if (!CONFIG.WEBHOOK_URL) throw new Error('Webhook URL not configured in index.html body data attributes.');
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const formattedDate = ist.toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  let answersText = '';
  const questions = ROLE_QUESTIONS[appState.formData.role] || [];
  questions.forEach(q => {
    const ans = appState.formData.answers[q.question] || 'No answer';
    answersText += `**${q.question}**\n${ans}\n\n`;
  });

  const embedColor = appState.formData.server === 'quantum' ? 0x0066ff : 0xff0000;

  const payload = {
    content: `📋 **NEW STAFF APPLICATION RECEIVED**`,
    embeds: [
      {
        title: '👤 Applicant Information',
        color: embedColor,
        fields: [
          { name: '📧 Email', value: appState.userData.email || 'N/A', inline: true },
          { name: '👤 Display Name', value: appState.userData.displayName || 'N/A', inline: true },
          { name: '🆔 Username', value: appState.userData.username || 'N/A', inline: true },
          { name: '📅 Date of Submission', value: formattedDate + ' IST', inline: false },
          { name: '🎮 Server', value: appState.formData.server === 'quantum' ? 'Quantum Gaming' : 'RedZone Esports', inline: true },
          { name: '🎯 Applied Role', value: appState.formData.role, inline: true },
          { name: '🎂 DOB', value: appState.formData.dob || 'N/A', inline: true },
          { name: '📊 Age', value: (appState.formData.age || '--') + ' years', inline: true }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'Staff Application System' }
      },
      {
        title: `📝 ${appState.formData.role} - Answers`,
        description: answersText.length > 4000 ? answersText.substring(0, 4000) + '...\n*(truncated)*' : answersText,
        color: embedColor,
        timestamp: new Date().toISOString()
      }
    ]
  };

  const res = await fetch(CONFIG.WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'no body');
    throw new Error('Webhook failed: ' + res.status + ' - ' + text);
  }
}

// helpers: UI
function showLoading(show) { const o = document.getElementById('loadingOverlay'); if (!o) return; if (show) o.classList.add('active'); else o.classList.remove('active'); }
function showSuccessModal() { const m = document.getElementById('successModal'); if (m) m.classList.add('active'); }
function resetApplication(){ location.reload(); }
function showLoginMessage(msg, isError) { const el = document.getElementById('loginMessage'); if (!el) return; el.textContent = msg; el.style.color = isError ? 'var(--danger)' : 'var(--muted)'; }
