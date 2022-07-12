$( document ).ready(function() {

    let req = {'range': 'medium', 'numberArtists': 40}

    $.ajax({
        url: "/myTopArtists/?" + $.param(req),
        type: "GET",
        ContentType: 'application/json',
        success: result => {
            console.log(result);
            for (let i=0; i<result.total; ++i) {
                let artist = new artistCard(result.artists[i]);
                let container = document.getElementById("card-container");
                container.append(artist.html());
            }
        }, error: err => {
            console.log("Something went wrong:");
            console.log(err.responseJSON);
        }
    });
});