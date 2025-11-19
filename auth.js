const USERS_KEY = "archivo.users";
const SESSION_KEY = "archivo.session";

// Helper functions
function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function setSession(username) {
  sessionStorage.setItem(SESSION_KEY, username);
}
function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
function currentUser() {
  return sessionStorage.getItem(SESSION_KEY);
}
function requireAuth() {
  if (!currentUser()) window.location.href = "index.html";
}
function logout() {
  clearSession();
  window.location.href = "index.html";
}

// --- Registration Logic ---
if (document.getElementById("registerBtn")) {
  document.getElementById("registerBtn").addEventListener("click", () => {
    const u = document.getElementById("regUser").value.trim();
    const p = document.getElementById("regPass").value;
    const msg = document.getElementById("msg");

    if (!u || !p) return (msg.textContent = "Please fill all fields!");
    if (p.length < 5) return (msg.textContent = "Password must be at least 5 characters.");

    const users = loadUsers();
    if (users.some(user => user.username.toLowerCase() === u.toLowerCase())) {
      return (msg.textContent = "Username already exists.");
    }

    users.push({ username: u, password: p });
    saveUsers(users);
    msg.textContent = "Account created successfully! Redirecting to login...";
    setTimeout(() => (window.location.href = "index.html"), 1500);
  });
}

// --- Login Logic ---
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // ✅ stop the form from reloading the page

    const u = document.getElementById("loginUser").value.trim();
    const p = document.getElementById("loginPass").value;
    const msg = document.getElementById("msg");

    const users = loadUsers();
    const found = users.find(user => user.username === u && user.password === p);

    if (found) {
      setSession(u);
      window.location.href = "catalogSystem.html"; // ✅ redirects properly now
    } else {
      msg.textContent = "Invalid username or password.";
    }
  });
}

const SAVED_KEY = "archivo.savedGames";

function loadSaved() {
  return JSON.parse(localStorage.getItem(SAVED_KEY) || "{}");
}

function saveSaved(obj) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(obj));
}

function saveGame(id, name, img) {
  const user = currentUser();
  if (!user) return alert("Please log in first.");

  let saved = loadSaved();
  if (!saved[user]) saved[user] = [];

  // Prevent duplicates
  if (saved[user].some(g => g.id === id)) {
    alert(`"${name}" is already saved.`);
    return;
  }

  saved[user].push({ id, name, img });
  saveSaved(saved);

  alert(`Saved "${name}"`);
}

function loadProfiles() {
  return JSON.parse(localStorage.getItem("archivo.profiles") || "{}");
}

function getDisplayName(username) {
  const profiles = loadProfiles();
  if (profiles[username] && profiles[username].displayName.trim() !== "") {
    return profiles[username].displayName;
  }
  return username; // fallback
}
