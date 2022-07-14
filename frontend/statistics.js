/*  =============================================================
    ==                      top category                       ==
    =============================================================
*/
let topArtistFunction = function(container) {
    let req = {'range': 'medium', 'numberArtists': 40}
    $.ajax({
        url: "/myTopArtists/?" + $.param(req),
        type: "GET",
        ContentType: 'application/json',
        success: result => {
            for (let i=0; i<result.total; ++i) {
                let artist = new artistCard(result.artists[i]);
                container.append(artist.html());
            }
        }, error: err => {
            console.log("Something went wrong:");
            console.log(err.responseJSON);
        }
    });
}


let topArtist = new statistic("Top Artists", topArtistFunction);

let topCategory = new category("Your Tops", [topArtist]);