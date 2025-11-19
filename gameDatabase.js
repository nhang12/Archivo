// gameDatabase.js
// The Archivo — Video Game Database Subsystem
// Author: Group Archivo
// Functions: fetchGames, getGamesByGenre, getGamesByYear, getGamesByPlatform

const API_KEY = "b21ca23c36fd48df8b669db3d384f873";
const BASE_URL = "https://api.rawg.io/api/games";

/**
 * Fetch games from RAWG API with filters:
 *  - genre
 *  - year
 *  - platform
 *  - page (for pagination!)
 */
async function fetchGames({
  genre = "",
  year = "",
  platform = "",
  page = 1
} = {}) {

  // DATE FILTER
  // Default nostalgic range (1990–2005)
  let dateRange = year
    ? `${year}-01-01,${year}-12-31`
    : "1990-01-01,2005-12-31";

  // Build API URL with pagination
  let params = new URLSearchParams({
    key: API_KEY,
    dates: dateRange,
    ordering: "-rating",
    page: page,
    page_size: 20         // Recommended by RAWG (20 games per page)
  });

  if (genre) params.append("genres", genre);
  if (platform) params.append("platforms", platform);

  const url = `${BASE_URL}?${params.toString()}`;

  console.log("Fetching:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("RAWG API error:", response.status);
      return [];
    }

    const data = await response.json();
    return data.results || [];

  } catch (error) {
    console.error("Error contacting RAWG:", error);
    return [];
  }
}

// ─────────────────────────────
// Convenience wrappers
// ─────────────────────────────

async function getGamesByGenre(genre) {
  return await fetchGames({ genre });
}

async function getGamesByYear(year) {
  return await fetchGames({ year });
}

async function getGamesByPlatform(platform) {
  return await fetchGames({ platform });
}

// Expose functions
window.fetchGames = fetchGames;
window.getGamesByGenre = getGamesByGenre;
window.getGamesByYear = getGamesByYear;
window.getGamesByPlatform = getGamesByPlatform;
