/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Arina Kolodeznikova Student ID: 145924213 Date: 02/06/2023
*  Cyclic Link: https://alive-ox-gear.cyclic.app/
*
********************************************************************************/ 

var page = 1;
const perPage = 10;

function loadMovieData(title = null) {
    fetchData(title)
      .then(res => {
        generateTable(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

function fetchData(title = null) {
    return new Promise((resolve, reject) => {
        let pagination = document.querySelector('.pagination');
        let containsClass = pagination.classList.contains('d-none');
        let url = `https://plum-splendid-jellyfish.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;

        if (title) {
            url += `&title=${title}`;
            if (!containsClass) {
                pagination.classList.add('d-none');
            }
        } else {
            if (containsClass) {
                pagination.classList.remove('d-none');
            }
        };

        fetch(url)
            .then (res => {
                if (res.ok) {
                    resolve(res.json());
                } else {
                    reject(new Error(`Failed to fetch Movie Data`));
                }
            })
            .catch (err => {
                reject(err);
            })
    }); 
};

function generateTable(data) {
    let movieRows = `${data.map(movie => {
            return `<tr data-id=${movie._id}>
            <td>${movie.year}</td>
            <td>${movie.title}</td>
            <td>${movie.plot === undefined ? "N/A" : movie.plot}</td>
            <td>${movie.rated === undefined ? "N/A" : movie.rated}</td>
            <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
        </tr>`
    }).join(' ')}`;
    document.querySelector('#moviesTable tbody').innerHTML = movieRows;
    document.querySelector('#current-page').textContent = page;
    addClickEvents(document.querySelectorAll('#moviesTable tr'));
};

function addClickEvents(rows) {
    rows.forEach((row) => {
        row.addEventListener('click', () => {
            fetch(`https://plum-splendid-jellyfish.cyclic.app/api/movies/${row.getAttribute("data-id")}`)
                .then(res => { return res.json();})
                .then(movie => {
                    generateModal(movie.data);
                })
                .catch(err => {
                    console.error(err);
                });
        });
      });
};

function generateModal(movie) {
    document.querySelector('.modal-title').textContent = movie.title;
    document.querySelector('.modal-body').innerHTML = `
        ${movie.poster ? `<img class="img-fluid w-100" alt="movie picture" src="${movie.poster}"><br><br>` : ''}
        <strong>Directed By:</strong> ${movie.directors.join(", ")}<br><br>
        <p>${movie.fullplot}</p>
        <strong>Cast:</strong> ${movie.cast.length > 0 ? movie.cast.join(", ") : "N/A"}<br><br>
        <strong>Awards:</strong> ${movie.awards.text}<br>
        <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)
    `

    // showing the modal
    let detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
        backdrop: 'static', // default true - "static" indicates that clicking on the backdrop will not close the modal window
        keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
        focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
      });
      detailsModal.show();
};

window.addEventListener("DOMContentLoaded", (event) => {
    loadMovieData()

    // previous page on click event
    document.getElementById("previous-page").addEventListener("click", () => {
        (page > 1) ? page-- : page;
        loadMovieData();
    });

    // next page on click event
    document.getElementById("next-page").addEventListener("click", () => {
        page++;
        loadMovieData();
    });

    // preventing the default submit and loading the data for the movie with a certain title
    document.getElementById("searchForm").addEventListener("submit", (event) => {
        event.preventDefault();
        loadMovieData(document.getElementById("title").value);
    });

    // clearing the form
    document.getElementById("clearForm").addEventListener("click", () => {
        document.getElementById("title").value = "";
        loadMovieData();
    });
});