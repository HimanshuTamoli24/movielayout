const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_URL =
  "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=";

const main = document.querySelector("#main");
const form = document.querySelector("#form");
const search = document.querySelector("#search");

// Load search term from local storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const savedSearchTerm = localStorage.getItem("searchTerm");
  if (savedSearchTerm) {
    search.value = savedSearchTerm;
    getMovies(SEARCH_URL + savedSearchTerm);
  } else {
    getMovies(API_URL);
  }
});

// Fetch movies based on the URL
async function getMovies(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    showMovies(data.results);
    // Clear input field if data is not empty and not a default request
    if (url !== API_URL && data.results.length === 0) {
      showNoResultsMessage();
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    main.innerHTML = "<p style='color: white;'>Something went wrong. Please try again later.</p>";
  }
}

// Display movies in the main section
function showMovies(movies) {
  main.innerHTML = "";
  if (movies.length === 0) {
    showNoResultsMessage();
    return;
  }
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>
    `;
    main.appendChild(movieEl);
  });
}

// Display a message when no search results are found
function showNoResultsMessage() {
  main.innerHTML =
    "<p style='color: white;'>No results found. Try a different search.</p>";
}

// Determine the class based on the movie rating
function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (searchTerm) {
    localStorage.setItem("searchTerm", searchTerm); // Save to local storage
    getMovies(SEARCH_URL + searchTerm);
  } else {
    alert("Search box cannot be empty. Write something in it.");
  }
});
