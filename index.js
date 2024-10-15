document.addEventListener("DOMContentLoaded", () => {
 
    
    // Function to fetch and display the first movie's details
    function displayFirstMovie() {
        fetch("http://localhost:3000/films",{
        id:"1"
        })
            .then(response => response.json())
            .then(movie => {
                // Get elements where the movie details will be displayed
                const movieTitle = document.getElementById('title');
                const moviePoster = document.getElementById('poster');
                const movieRuntime = document.getElementById('runtime');
                const movieShowtime = document.getElementById('showtime');
                const availableTickets = document.getElementById('available-tickets');

                // Update the movie details on the page
                movieTitle.textContent = movie.title;
                moviePoster.src = movie.poster;
                movieRuntime.textContent = `${movie.runtime} minutes`;
                movieShowtime.textContent = movie.showtime;

                // Calculate available tickets
                const ticketsLeft = movie.capacity - movie.tickets_sold;
                availableTickets.textContent = `Available Tickets: ${ticketsLeft}`;
            })
            .catch(error => console.log('Error fetching movie:', error));
    }

    // Call the function to display the first movie
    displayFirstMovie();
});

// Function to fetch and display the list of movies in the menu
function displayMovieMenu() {
    fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(movies => {
            const movieMenu = document.getElementById('films');
            movieMenu.innerHTML = ` <div id="films"> 
      <div class="four wide column">
        <div class="ui cards" id="showing">
          <div class="card">
            <div id="title" class="title">${films.title}</div>
            <div id="runtime" class="meta">${films.runtime} minutes</div>
            <div class="content">
              <div class="description">
                <div id="film-info">Description: ${films.description}</div>
                <span id="showtime" class="ui label">Showtime:${films.showtime}</span>
                <span id="ticket-num">Remaining tickets: ${films.ticketsLeft}</span>
              </div>
                </div>
            <div class="extra content">
              <button id="buy-ticket" class="ui orange button">
                Buy Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

            movies.forEach(movie => {
                const li = document.createElement('li');
                li.classList.add('film', 'item');
                li.textContent = movie.title;

                // Add click event to display movie details when clicked
                li.addEventListener('click', () => displayMovieDetails(movie.id));
                
                movieMenu.appendChild(li);

                // Create a delete button for each movie
                const deleteButton = document.createElement('button');
                deleteButton.textContent = "Delete";
                deleteButton.classList.add('delete-button');

                // Add delete event listener to the button
                deleteButton.addEventListener('click', () => deleteMovie(movie.id, li));

                // Append the delete button to the list item
                li.appendChild(deleteButton);

            });
        })
        .catch(error => console.log('Error fetching movies:', error));
}

// Function to fetch and display details of a clicked movie
function displayMovieDetails(movieId) {
    fetch(`http://localhost:3000/films/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            const movieTitle = document.getElementById('title');
            const moviePoster = document.getElementById('poster');
            const movieRuntime = document.getElementById('runtime');
            const movieShowtime = document.getElementById('showtime');
            const availableTickets = document.getElementById('available-tickets');

            // Update the movie details 
            movieTitle.textContent = movie.title;
            moviePoster.src = movie.poster;
            movieRuntime.textContent = `${movie.runtime} minutes`;
            movieShowtime.textContent = movie.showtime;

            // Calculate available tickets
            const ticketsLeft = movie.capacity - movie.tickets_sold;
            availableTickets.textContent = `Available Tickets: ${ticketsLeft}`;
        })
        .catch(error => console.log('Error fetching movie details:', error));
}

// Call the function to display the movie menu when the page loads
displayMovieMenu();


// Function for purchasing tickets
document.getElementById('buy-ticket').addEventListener('click', (event) => {
    event.preventDefault()
    alert("Nice Choice!")
      const movieId = "1"; // Assuming movieId 1 for now, you can get this dynamically from the clicked movie
      
      // function to show available tickets
      fetch(`http://localhost:3000/films/${movieId}`,{
          method: GET
      })
          .then(response => response.json())
          .then(movie => {
              const availableTickets = movie.capacity - movie.tickets_sold;
  
              // If there are available tickets, allow purchase
              if (availableTickets > 0) {
               
                  // Update tickets sold
                  fetch(`http://localhost:3000/films/${movieId}`, {
                      method: "PATCH",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                          tickets_sold: movie.tickets_sold + 1
                      })
                  })
                  .then(response => response.json())
                  .then(updatedMovie => {
                      // Update available tickets on the frontend
                     console.log("Available tickets:" `${updatedMovie.ticketsLeft}`)
                  });
              } else {
                  alert("Tickets are SOLD OUT!");
              }
          })
          .catch(error => console.log('Error updating tickets:', error));
  });






//Function to delete a movie
function deleteMovie(movieId, li) {
    // Send DELETE request to the server
    fetch(`http://localhost:3000/films/${movieId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            // to remove it fronm the DOM after deleting
            li.remove();
        } else {
            console.log('Error deleting movie:', response);
        }
    })
    .catch(error => console.log('Error deleting movie:', error));
}


