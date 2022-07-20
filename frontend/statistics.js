/*  =============================================================
    ==                      User Statistics                    ==
    =============================================================
*/

// top category
let topArtistFunction = function(container) {
    let req = {'range': 'medium', 'numberArtists': 40}
    $.ajax({
        url: "/myTopArtists/?" + $.param(req),
        type: "GET",
        ContentType: 'application/json',
        success: result => {
            for (let i=0; i<result.total; ++i) {
                let artist = new ArtistCard(result.artists[i]);
                htmlArt = artist.html()
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

let monkey = function(container) {
    container.append("monkey");
}


let topArtist = new Statistic("Top Artists", topArtistFunction);
let topArtist2 = new Statistic("Top Artists", monkey);

let topCategory = new Category("Your Tops", [topArtist, topArtist2, topArtist, topArtist, topArtist2]);