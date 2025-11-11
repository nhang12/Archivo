// gameInfo.js — loads and displays info for one game
const API_KEY = "b21ca23c36fd48df8b669db3d384f873";

// Get game ID from URL
const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

async function fetchGameInfo(id) {
  const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
  if (!res.ok) return null;
  return await res.json();
}

(async () => {
  requireAuth(); // from auth.js
  const container = document.getElementById("content");

  if (!gameId) {
    container.innerHTML = "<p>No game selected.</p>";
    return;
  }

  const game = await fetchGameInfo(gameId);
  if (!game) {
    container.innerHTML = "<p>Unable to load game info.</p>";
    return;
  }

  container.innerHTML = `
    <h1>${game.name}</h1>
    <img src="${game.background_image || ""}" alt="${game.name}">
    <p><strong>Released:</strong> ${game.released || "Unknown"}</p>
    <p><strong>Metacritic:</strong> ${game.metacritic ?? "N/A"}</p>
    <p><strong>Genres:</strong> ${game.genres.map(g => g.name).join(", ")}</p>
    <p><strong>Platforms:</strong> ${
      game.platforms ? game.platforms.map(p => p.platform.name).join(", ") : "N/A"
    }</p>
    <p style="margin-top:15px;">${game.description_raw || "No description available."}</p>
  `;
})();
