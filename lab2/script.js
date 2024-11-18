const personalMovieDB = {
    privat: false,
    movies: {
        "1+1": 9,
        "Титаник": 10,
        "Зеленая книга": 9,
    }
}

function showMovies(){
    if (!personalMovieDB.privat){
        const tableContainer = document.getElementById('content')
        let tableHTML = '<table><tr><th>Название фильма</th><th>Оценка</th><tr>';

        for (let movie in personalMovieDB.movies) {
            tableHTML += `<tr><td>${movie}</td><td>${personalMovieDB.movies[movie]}</td></tr>`;
        }

        tableHTML += '</table>';
        tableContainer.innerHTML = tableHTML;
    }
}

showMovies();