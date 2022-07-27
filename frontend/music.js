/*  =============================================================
    ==                         Main                            ==
    =============================================================
*/
$( document ).ready(function() {
    // create user's sidebar of playlists
    $.ajax({
        url: "/usersPlaylists",
        type: "GET",
        ContentType: 'application/json',
        success: result => {
            result.forEach( (e) => {
                // create Playlist cards for each ID
                let playlist = new PlaylistCard(e);
            });
        }, error: err => {
            alert("something went wrong with building music page");
        }   
    });
});
