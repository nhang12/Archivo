// gameDatabase.js
// The Archivo — Video Game Database Subsystem
// Author: Yousif Mehsen
// Functions: fetchGames, getGamesByGenre, getGamesByYear, getGamesByPlatform

const API_KEY = "b21ca23c36fd48df8b669db3d384f873";
const BASE_URL = "https://api.rawg.io/api/games";

// This function gets games from the RAWG website.
// You can tell it which genre, year, or platform you want.
async function fetchGames(options = {}) {

  // Pull out what the user gave us (like genre, year, platform)
  const genre = options.genre;
  const year = options.year;
  const platform = options.platform;

  // Decide which years to look for.
  // If no year is given, we’ll show nostalgic games (1990–2005)
  let dateRange;
  if (year) {
    dateRange = `${year}-01-01,${year}-12-31`;
  } else {
    dateRange = "1990-01-01,2005-12-31";
  }

  // Build the search link for the RAWG API.
  // It includes your key and the filters you chose.
  let url = `https://api.rawg.io/api/games?key=${API_KEY}&dates=${dateRange}&ordering=-rating`;
  if (genre) url += `&genres=${genre}`;
  if (platform) url += `&platforms=${platform}`;

  try {
    // Ask the RAWG website for the data
    const response = await fetch(url);

    // If the site didn’t answer properly, stop and show the problem
    if (!response.ok) {
      console.log("Problem getting data:", response.status);
      return [];
    }

    // Turn the data we got into something we can use (JSON)
    const data = await response.json();

    // Give back just the list of games
    return data.results || [];

  } catch (error) {
    // If anything goes wrong (like bad internet), show an error and return nothing
    console.log("Error talking to RAWG:", error);
    return [];
  }
}


// 2️⃣ Filter by genre
async function getGamesByGenre(genre) {
  return await fetchGames({ genre });
}

// 3️⃣ Filter by release year
async function getGamesByYear(year) {
  return await fetchGames({ year });
}

// 4️⃣ Filter by platform
async function getGamesByPlatform(platform) {
  return await fetchGames({ platform });
}

// Export for clarity if used as module (optional in browser)
window.fetchGames = fetchGames;
window.getGamesByGenre = getGamesByGenre;
window.getGamesByYear = getGamesByYear;
window.getGamesByPlatform = getGamesByPlatform;
