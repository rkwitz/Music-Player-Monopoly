/*  =============================================================
    ==                         Main                            ==
    =============================================================
*/

$( document ).ready(function() {
    // create "Your Tops" Category
    let topArtist = new Statistic("Top Artists", topArtistFunction);
    let topCategory = new Category("Your Tops", [topArtist]);

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