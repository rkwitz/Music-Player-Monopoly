/*  =============================================================
    ==                         Main                            ==
    =============================================================
*/
let login;

$( document ).ready(function() {
    login = new Login();
    login.html(document.getElementById('head'));
});
/*  =============================================================
    ==               logic for informationCards                ==
    =============================================================
*/

class InformationCard {
    constructor(data) {
        this.data = data; // data from frontend
    }
    html(clickable = true) {}
}

class ArtistCard extends InformationCard  {
    constructor(data) {
        super(data);
    }
    html(clickable = true) {
        let card = document.createElement('div');
        card.classList.add('card', 'artist-card');

        if (clickable) {
            card.addEventListener("click", (e) => {
                window.location = this.data.url;
            });
        }

        let followers = document.createElement('p');
        followers.innerHTML = this.data.followers.toLocaleString("en-US"); // adds commas
        followers.innerHTML += " followers";
        followers.className = "followers";
        
        // TODO: some sort of graphic with popularity?

        let genreTitle = document.createElement('h4');
        genreTitle.innerHTML = "Genres:";
        genreTitle.className = "genre-title"

        let genres = document.createElement('ul');
        genres.className = 'genre-list'
        let genreList = Array();
        genreList = this.data.genres
        let maxGenres = 4;
        genreList.forEach((genreName) => {
            if (maxGenres != 0) {
                let li = document.createElement('li');
                li.className = 'genre-item';
                let genre = document.createElement('p');
                genre.innerHTML = genreName;
                genre.className = "genre";
                li.append(genre);
                genres.append(li);
                maxGenres--;
            }
        });

        let name = document.createElement('h3');
        name.className = 'artist-name';
        name.innerHTML = this.data.name;

        let img = document.createElement('img');
        img.className = 'artist-image';
        img.src = this.data.image;
        img.alt = `A photo of the artist "${this.data.name}"`;

        card.append(name);
        card.append(img);
        card.append(genreTitle);
        card.append(genres);
        card.append(followers);
        return card;
    }
}

class PlaylistCard extends InformationCard {
    constructor(data) {
        super(data);
        this.playlistID = data;
    }

    html(sidebar, playlistContainer) {
        // call backend for tracks in playlist
        let req = {"id": this.playlistID};
        $.ajax({
            url: "/playlistGetTracks/?"  + $.param(req),
            type: "GET",
            ContentType: 'application/json',
            headers: {"Authorization": `${login.getToken()}`},
            success: result => {
                this.img = result.art;
                this.name = result.name;
                this.url = result.url;
                let trackArr = result.songs;
                let trackCards = Array();
                for (let i=0; i<trackArr.length; ++i) {
                    // create Tracks cards for each track in playlist
                    let track = new TrackCard(trackArr[i]);
                    trackCards.push(track);
                }
                this.trackCards = trackCards;
                let btn = document.createElement("button");
                btn.className = "playlist";
                btn.classList.add('small-white-btn');
                btn.classList.add('min-width-50')
                btn.innerHTML = this.name;
                
                btn.addEventListener("click", (e) => {
                    if (!e.target.classList.contains("current")) {
                        var elems = document.querySelectorAll(".playlist");
                        [].forEach.call(elems, function(el) {
                            el.classList.remove("current");
                        });
                        e.target.classList.add("current");
                        this.enterPlaylist(playlistContainer);
                    }
                });
                sidebar.append(btn);
            }, error: err => {
                alert("Something went wrong bulding a PlaylistCard")
            }
        });
    }

    enterPlaylist(container) {
        container.innerHTML = ""; // clear the container
        let title = document.createElement("h2");
        title.innerHTML = this.name;
        title.className = "music-title"
        
        let img = document.createElement("img");
        img.src = this.img;
        img.className = "music-img";
        img.alt = `Playlist cover for ${this.name}`;

        let logo = document.createElement("img");
        logo.src = "/resources/Spotify/Logos/Spotify_Logo_RGB_Green.png";
        logo.className = "logo-img";

        img.addEventListener("click", (e) => {
            window.location = this.url;
        });
        let content = document.createElement("div");
        content.id = "card-container";
        // display tracks and playlist information
        this.trackCards.forEach( (track) => { // iterate over TrackCards()
            content.append(track.html());
        });
        container.append(title);
        container.append(img);
        container.append(logo);
        container.append(content);
    }
}

class TrackCard extends InformationCard {
    constructor(data) {
        super(data);
    }
    html(clickable = true) {
        let card = document.createElement('div');
        card.classList.add('card', 'track-card');

        if (clickable) {
            card.addEventListener("click", (e) => {
                window.location = this.data.url;
            });
        }

        let name = document.createElement('h3');
        name.className = 'track-name';
        name.innerHTML = this.data.name;

        let artistTitle = document.createElement('h4');
        artistTitle.innerHTML = "artists:";
        artistTitle.className = "artists-title"

        let artists = document.createElement('ul');
        artists.className = 'track-list'
        let artistList = Array();
        artistList = this.data.artists
        let maxArtists = 3;
        for (let i=0; i<artistList.length; ++i) {
            if (maxArtists != 0) {
                let li = document.createElement('li');
                li.className = 'artist-item';
                let artist = document.createElement('p');
                artist.innerHTML = artistList[i];
                artist.className = "artist";
                li.append(artist);
                artists.append(li);
                maxArtists--;
            }
        }

        let img = document.createElement('img');
        img.className = 'track-image';
        img.src = this.data.art;
        img.alt = `A photo of the track "${this.data.name}" by ${this.data.artists[0]}`;
        
        card.append(name);
        card.append(img);
        card.append(artistTitle);
        card.append(artists);
        return card;
    }
}

/*  =============================================================
    ==           Other Methods of Displaying Stats             ==
    =============================================================
*/
class Histogram {
    constructor(data) {
        this.labels = Object.keys(data);

        this.data = Array();
        for (var i = 0; i < this.labels.length;i++){
            this.data.push(data[this.labels[i]]);
        }
    }
    html() {
        let hist = document.createElement('canvas');
        hist.id = 'histogram';
        hist.classList.add('histogram');

        const ctx = hist.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.labels,
                datasets: [{
                    data: this.data,
                    backgroundColor: 'blue'
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                        text: '',
                        padding: {
                            top: 10,
                            bottom: 5
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                        }
                    },
                    y: {
                        display: false
                    }
                }
            }
        });
        return hist;
    }
}

class PiChart {  // Top 13
    constructor(data) {
        this.labels = Object.keys(data);

        this.data = [];
        for (var i = 0; i < this.labels.length;i++){
            this.data.push(data[this.labels[i]]);
        }
    }
    html() {
        let colors = [
            'blue',
            'red',
            'green',
            'yellow',
            'purple',
            'orange',
            'maroon',
            'fuchsia',
            'lime',
            'olive',
            'navy',
            'teal',
            'aqua'
        ];
        if (this.data.length < 13){
            colors = colors.slice(0, this.data.length);
        }
        let pie = document.createElement('canvas');
        pie.id = 'pie';
        pie.classList.add('pie');

        const ctx = pie.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.labels,
                datasets: [{
                    data: this.data,
                    backgroundColor: colors,
                    hoverOffset: 4
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: '',
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    },
                    legend: {
                        font: {
                            size: 20
                        },
                        position: 'bottom'
                    }
                },
            }
        });
        return pie;
    }
}

/*  =============================================================
    ==               logic for statistics page                 ==
    =============================================================
*/

class Category {
    constructor(name, statistics) {
        this.statistics = statistics; // arry of statistic objects within the catagory
        this.name = name; // string
    }
    html(catContainer, statContainer) {
        let btn = document.createElement("button");
        btn.className = "category";
        btn.innerHTML = this.name;
        btn.addEventListener("click", (e) => {
            if (!e.target.classList.contains("current")) {
                var elems = document.querySelectorAll(".category");
                [].forEach.call(elems, function(el) {
                    el.classList.remove("current");
                });

                e.target.classList.add("current");
                this.enterStat(statContainer);
            }
        });
        catContainer.append(btn);
    }

    enterStat(statContainer) {
        // in here add event handler to upon click
        // performStatistic() method run on specific statistic in member var arr
        // stat is chosen by class on left or right arrow
        statContainer.innerHTML = "";
        let title = document.createElement("h2");
        title.innerHTML = this.statistics[0].name;
        title.className = "stat-title"
        let content = document.createElement("div");
        content.id = "card-container";
        this.statistics[0].performStatistic(content);

        let left = document.createElement("btn");
        left.id = "left-btn";
        left.className = "-1"
        let right = document.createElement("btn");
        right.id = "right-btn";
        right.className = "1";
        // add event listeners to change currently visualized data
        left.addEventListener('click',(e) => {
            let targetIndex = parseInt(e.target.className);
            if (targetIndex >= 0) {
                // hide button briefly to account for api call 
                // otherwise user can "unalign" stats
                e.target.style.display = 'none';
                setTimeout(() => {
                    e.target.style.display = 'block';
                }, 1000)
                this.statistics[targetIndex].performStatistic(content);
                title.innerHTML = this.statistics[targetIndex].name;
                e.target.className = --targetIndex;
                let right = parseInt(document.getElementById("right-btn").className);
                document.getElementById("right-btn").className = --right;
            }
        });
        right.addEventListener('click',(e) => {
            let targetIndex = parseInt(e.target.className);
            if (targetIndex < this.statistics.length) {
                // hide button briefly to account for api call 
                // otherwise user can "unalign" stats
                e.target.style.display = 'none';
                setTimeout(() => {
                    e.target.style.display = 'block';
                }, 1000)
                this.statistics[targetIndex].performStatistic(content);
                title.innerHTML = this.statistics[targetIndex].name;
                e.target.className = ++targetIndex;
                let left = parseInt(document.getElementById("left-btn").className);
                document.getElementById("left-btn").className = ++left;
            }
        });
        statContainer.append(title);
        statContainer.append(left);
        statContainer.append(content);
        statContainer.append(right);
    }
}

class Statistic {
    constructor(name, functionality) {
        this.name = name; // string
        this.functionality = functionality; // function
    }
    performStatistic(container) {
        // perform whatever functionality necessary for this statistic
        // append content to container
        container.innerHTML = "";
        this.functionality(container);
    }
}

/*  =============================================================
    ==               User Login                                ==
    =============================================================
*/

class Login {
    constructor() {
        this.loginVerify = false;
        this.page = window.location.pathname.split("/").pop();
    }
    login() {
        location.href = "/login";
    }

    logout() {
        location.reload();
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    setToken() {
        // store access token in cookie upon login
        if (window.location.hash) {
            const hash = window.location.hash
            .substring(1)
            .split('&')
            .reduce(function (initial, item) {
            if (item) {
                var parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
            }, {});
            window.location.hash = '';
            document.cookie = `access_token=${hash.access_token}; path=/`; // expires=Thu, 18 Dec 2013 12:00:00 UTC;
            location.reload();
        }
    }

    getToken() {
        let name = "access_token=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

    isLogged() {
        if (this.getToken()){
            console.log("logged");
            return true;
        } else {
            console.log("not logged");
            return false;
        }
    }

    html(container) {    
        if (this.isLogged()) { // user is logged in
            let playback = new Playback();
            playback.html(document.body);

            let homebtn = document.createElement("btn");
            homebtn.id = "home-btn";
            homebtn.innerHTML = "Home";
            homebtn.classList.add('small-white-btn');
            

            if (this.page == 'index.html'){
                homebtn.classList.add("current");
            }
            else{
                document.addEventListener('click',(e) => {
                    if(e.target && e.target.id== 'home-btn'){
                        location.href = "/index.html";
                    }
                });
            }

            let statsbtn = document.createElement("btn");
            statsbtn.id = "stats-btn";
            statsbtn.innerHTML = "Stats";
            statsbtn.classList.add('small-white-btn');
            
            if (this.page == 'stats.html'){
                statsbtn.classList.add("current");
            }
            else{
                document.addEventListener('click',(e) => {
                    if(e.target && e.target.id== 'stats-btn'){
                        location.href = "/stats.html";
                    }
                });
            }

            let musicbtn = document.createElement("btn");
            musicbtn.id = "music-btn";
            musicbtn.innerHTML = "Music";
            musicbtn.classList.add('small-white-btn');
            
            if (this.page == 'music.html'){
                musicbtn.classList.add("current");
            }
            else{
                document.addEventListener('click',(e) => {
                    if(e.target && e.target.id== 'music-btn'){
                        location.href = "/music.html";
                    }
                });
            }

            let logoutbtn = document.createElement("btn");
            logoutbtn.id = "logout-btn";
            logoutbtn.innerHTML = "Logout";
            logoutbtn.classList.add('large-white-btn');

            document.addEventListener('click',(e) => {
                if(e.target && e.target.id== 'logout-btn'){
                    this.logout();
                }
            });
            container.prepend(logoutbtn);
            container.prepend(homebtn);
            container.prepend(musicbtn);
            container.prepend(statsbtn);
        }
        else { // user is not logged in
            if (this.page != 'index.html' && this.page != ''){
                location.href = "/index.html";
            }

            let loginbtn = document.createElement("btn");
            loginbtn.id = "login-btn";
            loginbtn.innerHTML = "Login";
            loginbtn.classList.add('large-white-btn');

            document.addEventListener('click',(e) => {
                if(e.target && e.target.id== 'login-btn'){
                    this.login();
                }
            });
            container.prepend(loginbtn);
        }
    }
}
/*  =============================================================
    ==               Playback                                  ==
    =============================================================
*/
class Playback {
    constructor(){}
    
    html(container) {

        let footer = document.createElement("footer");
        let image = document.createElement("img");
        footer.innerHTML = "<ul id='playback'><li> <button id='skip-backwards'></button> </li><li> <button id='playback-button'></button> </li><li> <button id='skip-forward'></button> </li></ul>";
        image.className = "albumArt"
        //footer.prepend(image)
        container.append(footer);
        var btn = $("#playback-button");
        var skipForwards = $("#skip-forward");
        var skipBackwards = $("#skip-backwards");
        $.ajax({
            url: "/playbackState",
            type: "GET",
            ContentType: 'application/json',
            headers: {"Authorization": `${login.getToken()}`},
            success: result => {
                if (result == "playing") {
                    btn.toggleClass("paused");
                }
            }, error: err => {}
        });
        //play or pause clicked
        btn.click(function() {
            if (btn.hasClass("paused")) {
                $.ajax({
                    url: "/pause",
                    type: "GET",
                    ContentType: 'application/json',
                    headers: {"Authorization": `${login.getToken()}`},
                    success: result => {
                        btn.toggleClass("paused");
                        console.log("Paused Sucessfully");
                    }, error: err => {
                        if (err.responseJSON.body.error.reason == 'NO_ACTIVE_DEVICE') {
                            alert("No Active Device Found");
                        }
                        else if (err.responseJSON.body.error.message == "Player command failed: Restriction violated") {
                            btn.toggleClass("paused");
                        }
                        else {
                            alert("Something Went Wrong");
                            console.log("Something went wrong:");
                            console.log(err.responseJSON);
                        }
                    }
                });
            }
            else {
                $.ajax({
                    url: "/play",
                    type: "GET",
                    ContentType: 'application/json',
                    headers: {"Authorization": `${login.getToken()}`},
                    success: result => {
                        btn.toggleClass("paused");
                        console.log("Played Sucessfully");
                    }, error: err => {
                        if (err.responseJSON.body.error.reason == 'NO_ACTIVE_DEVICE') {
                            alert("No Active Device Found");
                        }
                        else if (err.responseJSON.body.error.message == "Player command failed: Restriction violated") {
                            btn.toggleClass("paused");
                        }
                        else {
                            alert("Something Went Wrong");
                            console.log("Something went wrong:");
                            console.log(err.responseJSON);
                        }
                    }
                });
            }
            return false;
        });
        //skip foward clicked
        skipForwards.click(function() {
            $.ajax({
                url: "/skipNext",
                type: "GET",
                ContentType: 'application/json',
                headers: {"Authorization": `${login.getToken()}`},
                success: result => {
                    console.log("Skipped Forward Sucessfully")
                    $.ajax({
                        url: "/playbackState",
                        type: "GET",
                        ContentType: 'application/json',
                        headers: {"Authorization": `${login.getToken()}`},
                        success: result => {
                            if (result == "paused") {
                                btn.toggleClass("paused");
                            }
                        }, error: err => {}
                    });
                }, error: err => {
                    alert("Something Went Wrong");
                    console.log("Something went wrong:");
                    console.log(err.responseJSON);
                }
            });
        });
        //skip backwards clicked
        skipBackwards.click(function() {
            $.ajax({
                url: "/skipPrevious",
                type: "GET",
                ContentType: 'application/json',
                headers: {"Authorization": `${login.getToken()}`},
                success: result => {
                    console.log("Skipped Backward Sucessfully")
                    $.ajax({
                        url: "/playbackState",
                        type: "GET",
                        ContentType: 'application/json',
                        headers: {"Authorization": `${login.getToken()}`},
                        success: result => {
                            if (result == "paused") {
                                btn.toggleClass("paused");
                            }
                        }, error: err => {}
                    });
                }, error: err => {
                    alert("Something Went Wrong");
                    console.log("Something went wrong:");
                    console.log(err.responseJSON);
                }
            });
        });
    }
}