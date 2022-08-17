/*  =============================================================
    ==                         Main                            ==
    =============================================================
*/

async function waitVerify() {
    await new Promise(r => setTimeout(r, 240));
    if (login.isLogged()) {
        $.ajax({
            url: "/usersPlaylists",
            type: "GET",
            ContentType: 'application/json',
            headers: {"Authorization": `${login.getToken()}`},
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
    else {
        location.href = "/index.html";
    }
}

$( document ).ready(function() {
    waitVerify();
    //console.log(decodeURIComponent(document.cookie));
});
