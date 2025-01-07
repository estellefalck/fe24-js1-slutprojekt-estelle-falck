const axios = window.axios; // Axios från CDN
const API_KEY = "77d38de8ff1bab16badd4cf113a74715"; // API-nyckel för The Movie Database
const BASE_URL = "https://api.themoviedb.org/3"; // Grundläggande URL för API-anrop

// Hämta referenser till HTML-element
const elements = {
  resultsContainer: document.getElementById("results"),
  topRatedButton: document.getElementById("top-rated"),
  popularButton: document.getElementById("popular"),
  searchButton: document.getElementById("search-button"),
  searchInput: document.getElementById("search-input"),
  goBackButton: document.getElementById("go-back"),
};

// Lägg till klicklyssnare för knappar
elements.topRatedButton.addEventListener("click", () => handleCategoryClick("top_rated"));
elements.popularButton.addEventListener("click", () => handleCategoryClick("popular"));
elements.searchButton.addEventListener("click", handleSearch);
elements.searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});
elements.goBackButton.addEventListener("click", restorePreviousView);

// Spara nuvarande vy för "tillbaka"-funktionen
let currentView = { type: "", data: [], prevData: [] };

// Återställ föregående vy om det finns data sparad
function restorePreviousView() {
  if (currentView.prevData.length) {
    if (currentView.type === "search") {
      displaySearchResults(currentView.prevData);
    } else {
      displayMovies(currentView.prevData);
    }
    elements.goBackButton.style.display = "none";
    currentView.prevData = [];
  } else {
    displayErrorMessage("No previous view to restore.");
  }
}

// Hantera klick på kategori-knappar
function handleCategoryClick(category) {
  clearSearchInput(); 
  clearActiveButtons(); 
  markButtonAsActive(category); 
  fetchMovies(category); 
}

// Markera den aktiva kategoriknappen
function markButtonAsActive(category) {
  elements.topRatedButton.classList.remove("active");
  elements.popularButton.classList.remove("active");

  if (category === "top_rated") {
    elements.topRatedButton.classList.add("active");
  } else if (category === "popular") {
    elements.popularButton.classList.add("active");
  }
}

// Hämta filmer baserat på kategori (t.ex. "top_rated" eller "popular")
async function fetchMovies(type) {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${type}`, {
      params: { api_key: API_KEY },
    });
    const data = response.data;
    if (data && data.results) {
      currentView = { type, data: data.results.slice(0, 10), prevData: [] };
      displayMovies(currentView.data);
    } else {
      displayErrorMessage("No movies found.");
    }
  } catch (error) {
    displayErrorMessage("Something went wrong while fetching movies.");
    console.error(error);
  }
}

// Hantera sökförfrågningar från användaren
async function handleSearch() {
  const query = elements.searchInput.value.trim(); // Hämta användarens sökord
  if (!query) {
    alert("Please enter something to search!"); // Ge en varning om fältet är tomt
    return;
  }
  try {
    const response = await axios.get(`${BASE_URL}/search/multi`, {
      params: { api_key: API_KEY, query },
    });
    const data = response.data;
    if (data && data.results.length > 0) {
      currentView = { type: "search", data: data.results, prevData: [] };
      displaySearchResults(currentView.data);
      clearActiveButtons();
    } else {
      displayErrorMessage(`No results found for "${query}".`);
    }
  } catch (error) {
    displayErrorMessage("Something went wrong while searching.");
    console.error(error);
  }
}

// Hämta detaljer om en film, person eller TV-serie
async function fetchDetails(type, id) {
  try {
    const response = await axios.get(`${BASE_URL}/${type}/${id}`, {
      params: { api_key: API_KEY },
    });
    const data = response.data;
    if (data) {
      currentView.prevData = [...currentView.data];
      displayDetails(type, data);
      elements.goBackButton.style.display = "block"; 
    }
  } catch (error) {
    displayErrorMessage("Something went wrong while fetching details.");
    console.error(error);
  }
}

// Visa en lista med filmer i resultatcontainern
function displayMovies(movies) {
  elements.resultsContainer.innerHTML = movies
    .map(
      (movie) => `
      <div class="result-item" onclick="handleMovieClick(${movie.id})">
        <img src="${getImageUrl(movie.poster_path)}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>Release date: ${movie.release_date || "N/A"}</p>
      </div>
    `
    )
    .join("");
  elements.goBackButton.style.display = "none";
}

// Visa sökresultat (filmer, personer eller TV-serier)
function displaySearchResults(results) {
  elements.resultsContainer.innerHTML = results
    .map((result) => {
      if (result.media_type === "movie") {
        return `
          <div class="result-item" onclick="handleMovieClick(${result.id})">
            <img src="${getImageUrl(result.poster_path)}" alt="${result.title}">
            <h3>${result.title}</h3>
            <p>Release date: ${result.release_date || "N/A"}</p>
            <p>${result.overview || "No description available."}</p>
          </div>
        `;
      } else if (result.media_type === "person") {
        return `
          <div class="result-item" onclick="handlePersonClick(${result.id})">
            <img src="${getImageUrl(result.profile_path)}" alt="${result.name}">
            <h3>${result.name}</h3>
            <p>Department: ${result.known_for_department || "N/A"}</p>
            <p><strong>Known for:</strong></p>
            <p>${createKnownForList(result.known_for)}</p>
          </div>
        `;
      } else if (result.media_type === "tv") {
        return `
          <div class="result-item" onclick="handleTvClick(${result.id})">
            <img src="${getImageUrl(result.poster_path)}" alt="${result.name}">
            <h3>${result.name}</h3>
            <p>First Air Date: ${result.first_air_date || "N/A"}</p>
            <p>${result.overview || "No description available."}</p>
          </div>
        `;
      }
    })
    .join("");
  elements.goBackButton.style.display = "none";
}

// Klickhanterare för filmer
function handleMovieClick(id) {
  fetchDetails("movie", id);
}

// Klickhanterare för TV-serier
function handleTvClick(id) {
  fetchDetails("tv", id);
}

// Klickhanterare för personer
function handlePersonClick(id) {
  fetchDetails("person", id);
}

// Generera bild-URL eller visa en platshållare om ingen bild finns
function getImageUrl(path) {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
}

// Visa detaljer för filmer, TV-serier eller personer
function displayDetails(type, details) {
  const content =
    type === "movie"
      ? `
    <div class="details">
      <img src="${getImageUrl(details.poster_path)}" alt="${details.title}">
      <h2>${details.title}</h2>
      <p><strong>Overview:</strong> ${details.overview || "No description available."}</p>
      <p><strong>Release Date:</strong> ${details.release_date || "N/A"}</p>
      <p><strong>Genres:</strong> ${details.genres.map((g) => g.name).join(", ") || "N/A"}</p>
      <p><strong>Runtime:</strong> ${details.runtime || "N/A"} minutes</p>
      <p><strong>Vote Average:</strong> ${details.vote_average || "N/A"} (${details.vote_count || 0} votes)</p>
      <p><strong>Production Companies:</strong> ${details.production_companies.map((c) => c.name).join(", ") || "N/A"}</p>
    </div>`
      : type === "person"
      ? `
    <div class="details">
      <img src="${getImageUrl(details.profile_path)}" alt="${details.name}">
      <h2>${details.name}</h2>
      <p><strong>Department:</strong> ${details.known_for_department || "N/A"}</p>
      <p><strong>Biography:</strong> ${details.biography || "No biography available."}</p>
      <p><strong>Birthday:</strong> ${details.birthday || "N/A"}</p>
      <p><strong>Place of Birth:</strong> ${details.place_of_birth || "N/A"}</p>
    </div>`
      : `
    <div class="details">
      <img src="${getImageUrl(details.poster_path)}" alt="${details.name}">
      <h2>${details.name}</h2>
      <p><strong>Overview:</strong> ${details.overview || "No description available."}</p>
      <p><strong>First Air Date:</strong> ${details.first_air_date || "N/A"}</p>
      <p><strong>Last Air Date:</strong> ${details.last_air_date || "N/A"}</p>
      <p><strong>Number of Seasons:</strong> ${details.number_of_seasons || "N/A"}</p>
      <p><strong>Number of Episodes:</strong> ${details.number_of_episodes || "N/A"}</p>
    </div>`;
  
  elements.resultsContainer.innerHTML = content;
  elements.goBackButton.style.display = "block";
}

// Visa ett felmeddelande i resultatcontainern
function displayErrorMessage(message) {
  elements.resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}

// Skapa lista för "Known for"-information
function createKnownForList(knownFor) {
  return knownFor
    .map((item) => {
      const type = item.media_type === "movie" ? "Movie" : "TV";
      return `${type}: ${item.title || item.name}`;
    })
    .join(", ");
}


// Töm sökfältet
function clearSearchInput() {
  elements.searchInput.value = "";
}

// Avmarkera alla kategoriknappar
function clearActiveButtons() {
  elements.topRatedButton.classList.remove("active");
  elements.popularButton.classList.remove("active");
}
