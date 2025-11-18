requireAuth(); // blocks page if not logged in

const username = currentUser();
document.getElementById("profileUsername").textContent = username;

const PROFILE_KEY = "archivo.profiles";

// Load all profiles from localStorage
function loadProfiles() {
  return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
}

// Save all profiles back
function saveProfiles(profiles) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
}

// Load this user's profile if it exists
function loadCurrentProfile() {
  const profiles = loadProfiles();
  return profiles[username] || {
    displayName: "",
    bio: "",
    platform: "",
    genre: ""
  };
}

// Fill fields with saved data
const profile = loadCurrentProfile();
document.getElementById("displayNameInput").value = profile.displayName;
document.getElementById("bioInput").value = profile.bio;
document.getElementById("platformInput").value = profile.platform;
document.getElementById("genreInput").value = profile.genre;

// Save button
document.getElementById("saveProfileBtn").onclick = () => {
  const profiles = loadProfiles();

  profiles[username] = {
    displayName: document.getElementById("displayNameInput").value,
    bio: document.getElementById("bioInput").value,
    platform: document.getElementById("platformInput").value,
    genre: document.getElementById("genreInput").value
  };

  saveProfiles(profiles);

  document.getElementById("saveMsg").textContent = "Profile Saved!";
  setTimeout(() => (document.getElementById("saveMsg").textContent = ""), 2000);
};
