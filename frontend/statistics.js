/*  =============================================================
    ==                         Main                            ==
    =============================================================
*/

$( document ).ready(function() {
    // create "Your Tops" Category
    let topArtist = new Statistic("Top Artists", topArtistFunction);
    let topSong = new Statistic("Top Songs", topSongsFunction);
    let topGenre = new Statistic("Top Genres", topGenreFunction);
    let topDecade = new Statistic("Top Decades of Music", topDecadesFunction);
    let topCategory = new Category("Your Tops", [topArtist, topSong, topGenre, topDecade]);

    let sidebar = document.getElementById("statistic-sidebar");
    let content = document.getElementById("statistic-content");
    topCategory.html(sidebar, content);
});

/*  =============================================================
    ==                      User Statistics                    ==
    =============================================================
*/

// top category
let topArtistFunction = function(container) {
    let req = {'range': 'long', 'numberArtists': 50}
    $.ajax({
        url: "/myTopArtists/?" + $.param(req),
        type: "GET",
        ContentType: 'application/json',
        success: result => {
            for (let i=0; i<result.total; ++i) {
                let artist = new ArtistCard(result.artist[i]);
                htmlArt = artist.html();
                htmlArt.dataset.ranking = i+1;
                htmlArt.classList.add('card-numbered');
                container.append(htmlArt);
            }
        }, error: err => {
            console.log("Something went wrong:");
            console.log(err.responseJSON);
        }
    });
}

let topSongsFunction = function(container) {
    let req = {'range': 'long', 'numberSongs': 50}
    $.ajax({
        url: "/myTopSongs/?" + $.param(req),
        type: "GET",
        ContentType: 'application/json',
        success: result => {
            for (let i=0; i<result.total; ++i) {
                let song = new SongsCard(result.song[i]);
                htmlArt = song.html();
                htmlArt.dataset.ranking = i+1;
                htmlArt.classList.add('card-numbered');
                container.append(htmlArt);
            }
        }, error: err => {
            console.log("Something went wrong:");
            console.log(err.responseJSON);
        }
    });
}

let topDecadesFunction = function(container) {
    var decades = {
        '1940s': 0,
        '1950s': 0,
        '1960s': 0,
        '1970s': 0,
        '1980s': 0,
        '1990s': 0,
        '2000s': 0,
        '2010s': 0,
        '2020s': 0
    };
    const num = 150;
    let req = {'range': 'long', 'numberSongs': num}
    $.ajax({
        url: "/myTopSongs/?" + $.param(req),
        type: "GET",
        ContentType: 'application/json',
        success: result => {
            for (let i=0; i<result.total; ++i) {
                //parse date to year string
                let date = result.song[i].releaseDate;
                year = parseInt(date.substring(0,4));
                labels = Objects.keys(decades);
                for (var j = labels.length-1; j >= 0;j--){
                    if (year >= (1940 + 10*j)) {
                        decades.labels[j] += num-i;
                    }
                }
            }
            let histogram = new Histogram(decades);
            htmlArt = histogram.html();
            htmlArt.dataset.ranking = i+1;
            htmlArt.classList.add('canvas');
            container.append(htmlArt);
        }, error: err => {
            console.log("Something went wrong:");
            console.log(err.responseJSON);
        }
    });
}

let topGenreFunction = function(container) {
    var genres = {};
    const num = 150;
    let req = {'range': 'long', 'numberSongs': num}
    $.ajax({
        url: "/myTopSongs/?" + $.param(req),
        type: "GET",
        ContentType: 'application/json',
        success: result => {
            for (let i=0; i<result.total; ++i) {
                let genreList = Array();
                genreList = result.song[i].album.genre;
                genreList.forEach((genreName) => {
                    if (genres.hasOwnProperty(genreName)){
                        genres.genreName += num-i;
                    }
                    else {
                        genre[genreName] = num-i;
                    }
                });
            }
            // Create items array
            var items = Object.keys(genres).map(function(key) {
                return [key, genres[key]];
            });
            
            // Sort the array based on the second element
            items.sort(function(first, second) {
                return second[1] - first[1];
            });
            
            // Create a new array with only the first 5 items
            items = items.slice(0, 5);

            sortedGenre={}
            items.forEach((v) => {
                useKey = v[0]
                useValue = v[1]
                sortedGenre[useKey] = useValue
            });

            let piChart = new PiChart(sortedGenre);
            htmlArt = piChart.html();
            htmlArt.dataset.ranking = i+1;
            htmlArt.classList.add('canvas');
            container.append(htmlArt);
        }, error: err => {
            console.log("Something went wrong:");
            console.log(err.responseJSON);
        }
    });
}