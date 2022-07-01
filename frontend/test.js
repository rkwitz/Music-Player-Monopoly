$( document ).ready(function() {

    let req = {'range': 'long', 'numberArtists': 40}

    $.ajax({
        url: "/myTopArtists/?" + $.param(req),
        type: "GET",
        ContentType: 'application/json',
        success: result => {
            console.log(result);
            for (let i=0; i<result.total; ++i) {
                let element = new artistCard(result.artists[i]);
                document.body.append(element.html());
            }
        }, error: err => {
            console.log("Something went wrong:");
            console.log(err.responseJSON);
        }
    });
});