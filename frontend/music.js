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
            let sidebar = document.getElementById("music-sidebar");
            let playlistContainer = document.getElementById("music-content");
            result.forEach( (e) => {
                // create Playlist cards for each ID
                let playlist = new PlaylistCard(e);
                playlist.html(sidebar, playlistContainer);
            });
        }, error: err => {
            alert("something went wrong with building music page");
        }   
    });
});
