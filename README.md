The Movie Database (TMDb) Viewer

This project is a web application that allows users to search for movies, TV shows, and actors using The Movie Database (TMDb) API. The application is built using HTML, CSS, and JavaScript, and utilizes the Axios library for making API requests.

Features

Search Functionality: Users can search for movies, TV shows, or actors using the TMDb search endpoint.

Top Rated and Popular Categories: Users can explore top-rated and popular movies with a single click.

Detailed Information:

Movies: Overview, genres, runtime, release date, and production companies.

TV Shows: Overview, first/last air dates, number of seasons/episodes.

Actors: Biography, department, known works (labeled as "Movie" or "TV").

Go Back Button: Navigate back to the previous view seamlessly.

Responsive Design: Optimized for various screen sizes.

Technologies Used

JavaScript: Core programming logic.

Axios: Library for making HTTP requests to the TMDb API.

HTML/CSS: Markup and styling for the application.

TMDb API: Source for movie, TV show, and actor data.

How to Use

Clone or download this repository.

Include the following files in your project:

index.html: Main HTML structure.

script.js: Contains all JavaScript logic.

styles.css: Optional CSS for styling.

Open the index.html file in your browser.

Use the search bar or category buttons to explore movies, TV shows, and actors.

API Key Setup

This application requires an API key from TMDb:

Sign up at TMDb.

Generate an API key from your TMDb account settings.

Replace the placeholder API key in the script.js file:

const API_KEY = "77d38de8ff1bab16badd4cf113a74715";

Project Structure

index.html: Main HTML file containing the layout.

script.js: JavaScript file with all functionalities (API calls, event handling, rendering views).

styles.css: CSS file for styling the application.

Known Issues

Limited API Calls: Exceeding TMDb's API call limits may result in errors.

Error Handling: Some edge cases might not display appropriate error messages.

Future Improvements

Add pagination for large result sets.

Improve error handling and user feedback.

Add a "favorites" feature to save movies or shows.

Enhance UI/UX for a more interactive experience.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments

Special thanks to TMDb for providing an extensive API.

Icons and images are retrieved from TMDb and are subject to their terms of use.

