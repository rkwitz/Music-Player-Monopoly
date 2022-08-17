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
    // select the first category when entering this page
    topCategory.enterStat(content);
    Array.from(sidebar.children)[0].classList.add("current");
});

/*  =============================================================
    ==                      User Statistics                    ==
    =============================================================
*/

// top category
let topArtistFunction = function(container) {
    let req = {'range': 'long', 'numberArtists': 99}
    if (login.isLogged()) {
        $.ajax({
            url: "/myTopArtists/?" + $.param(req),
            type: "GET",
            ContentType: 'application/json',
            headers: {"Authorization": `${login.getToken()}`},
            success: result => {
                for (let i=0; i<result.total; ++i) {
                    let artist = new ArtistCard(result.artists[i]);
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
    else {
        location.href = "/index.html";
    }
}

let topSongsFunction = function(container) {
    let req = {'range': 'long', 'numberSongs': 99}
    if (login.isLogged()) {
        $.ajax({
            url: "/myTopSongs/?" + $.param(req),
            type: "GET",
            ContentType: 'application/json',
            headers: {"Authorization": `${login.getToken()}`},
            success: result => {
                for (let i=0; i<result.total; ++i) {
                    let song = new TrackCard(result.songs[i]);
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
    else {
        location.href = "/index.html";
    }
}

let topDecadesFunction = function(container) {
    var decades = {
        '1940s': 0.0,
        '1950s': 0.0,
        '1960s': 0.0,
        '1970s': 0.0,
        '1980s': 0.0,
        '1990s': 0.0,
        '2000s': 0.0,
        '2010s': 0.0,
        '2020s': 0.0
    };
    const num = 99;
    let req = {'range': 'long', 'numberSongs': num}
    const rankWeight = 5 // #1 top Track will add to the score of its decade by a factor of rankWeight more than the last available top Track
    if (login.isLogged()) {
        $.ajax({
            url: "/myTopSongs/?" + $.param(req),
            type: "GET",
            ContentType: 'application/json',
            headers: {"Authorization": `${login.getToken()}`},
            success: result => {
                for (let i=0; i<result.total; ++i) {
                    //parse date to year string
                    let date = result.songs[i].releaseDate;
                    year = parseInt(date.substring(0,4));
                    labels = Object.keys(decades);
                    for (var j = labels.length-1; j >= 0;j--){
                        if (year >= (1940 + 10*j)) {
                            decades[labels[j]] += (num-i)*(rankWeight - 1) + num;
                            break;
                        }
                    }
                }
                let histogram = new Histogram(decades);
                htmlArt = histogram.html();
                htmlArt.classList.add('canvas', 'hist');
                container.append(htmlArt);
            }, error: err => {
                console.log("Something went wrong:");
                console.log(err.responseJSON);
            }
        });
    }
    else {
        location.href = "/index.html";
    }
}

let topGenreFunction = function(container) {
    var genres = {};
    const num = 99;
    const rankWeight = 5 // #1 top Artist will add to the score of its genres by a factor of rankWeight more than the last available top Artist
    let req = {'range': 'long', 'numberArtists': num}
    if (login.isLogged()) {
        $.ajax({
            url: "/myTopArtists/?" + $.param(req),
            type: "GET",
            ContentType: 'application/json',
            headers: {"Authorization": `${login.getToken()}`},
            success: result => {
                for (let i=0; i<result.total; ++i) {
                    let genreList = Array();
                    genreList = result.artists[i].genres;
                    genreList.forEach((genreName) => {
                        score = (num-i)*(rankWeight - 1) + num
                        if (genres.hasOwnProperty(genreName)){
                            genres[genreName] += score;
                        }
                        else {
                            genres[genreName] = score;
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
                
                // Create a new array with only the first 13 items
                items = items.slice(0, 13);
    
                sortedGenre={}
                items.forEach((v) => {
                    useKey = v[0]
                    useValue = v[1]
                    sortedGenre[useKey] = useValue
                });
    
                let piChart = new PiChart(sortedGenre);
                htmlArt = piChart.html();
                htmlArt.classList.add('canvas', 'pie');
                container.append(htmlArt);
            }, error: err => {
                console.log("Something went wrong:");
                console.log(err.responseJSON);
            }
        });
    }
    else {
        location.href = "/index.html";
    }
}