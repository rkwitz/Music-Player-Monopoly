/*  =============================================================
    ==                         Main                            ==
    =============================================================
*/

async function waitVerify() {
    await new Promise(r => setTimeout(r, 240));
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
}

$( document ).ready(function() {
    waitVerify();
});
