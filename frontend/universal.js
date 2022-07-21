/*  =============================================================
    ==                         Main                            ==
    =============================================================
*/

$( document ).ready(function() {
    var login = new Login();
    login.html(document.body);
    if (location.href !=  ("http://localhost:3000/index.html")){ 
        let playback = new Playback();
        playback.html(document.body);
    }
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
        // return html element to be displayed on page 
        // const format = {
        //     name: "Cage The Elephant",
        //     followers: 2921544,
        //     popularity: 73,
        //     genres: [
        //       "modern alternative rock",
        //       "modern rock",
        //       "punk blues",
        //       "rock"
        //     ],
        //     image: "https://i.scdn.co/image/ab6761610000e5eb7d994f7e137c10249de19455",
        //     url: "https://open.spotify.com/artist/26T3LtbuGT1Fu9m0eRq5X3",
        //     uri: "spotify:artist:26T3LtbuGT1Fu9m0eRq5X3"
        // }
        let card = document.createElement('div');
        card.classList.add('card', 'artist-card');

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
    }
    html(clickable = true) {
        // bool clickable --> whether or not this card is interactive
        // return html element to be displayed on page

        // make a button or something that requests all tracks in playlist from backend
        // somehow create trackCards for each card (maybe in here, maybe not I'm not sure)
    }
}

class TrackCard extends InformationCard {
    constructor(data) {
        super(data);
    }
    html(clickable = true) {
        // bool clickable --> whether or not this card is interactive
        // return html element to be displayed on page

        // make a button or something that requests to play this track from backend
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
        this.currentStat = 0;
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
        // performStatistic() method run on every statistic
        // to multiple containers (some hidden) on the page
        statContainer.innerHTML = "";
        let title = document.createElement("h2");
        title.innerHTML = this.statistics[this.currentStat].name;

        let content = document.createElement("section");
        content.id = "statistic-content";
        this.statistics[this.currentStat].performStatistic(content);

        let left = document.createElement("btn");
        left.id = "left-btn";
        left.className = "-1"
        let right = document.createElement("btn");
        right.id = "right-btn";
        right.className = "1"
        // add event listeners to change currently visualized data
        left.addEventListener('click',(e) => {
            let targetIndex = parseInt(e.target.className);
            if (targetIndex >= 0) {
                this.statistics[targetIndex].performStatistic(content);
                title.innerHTML = this.statistics[targetIndex].name;
                e.target.className = --targetIndex;
                let right = parseInt(document.getElementById("right-btn").className);
                document.getElementById("right-btn").className = --left;
            }
        });
        right.addEventListener('click',(e) => {
            let targetIndex = parseInt(e.target.className);
            if (targetIndex < this.statistics.length) {
                this.statistics[targetIndex].performStatistic(content);
                title.innerHTML = this.statistics[targetIndex].name;
                e.target.className = ++targetIndex;
                let left = parseInt(document.getElementById("left-btn").className);
                document.getElementById("left-btn").className = ++left;
            }
        });
        container.append(title);
        container.append(content);
        container.append(left);
        container.append(right);
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
    login() {
        location.href = "/login";
    }
    logout() {
        const url = 'https://www.spotify.com/logout/';
        console.log(this.isLogged());
        const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40');
        setTimeout(() => spotifyLogoutWindow.close(), 1000);
        setTimeout(() => location.href = "/index.html", 1050);
        
    }
    isLogged() {
        $.ajax({
            url: "/isLogged",
            type: "GET",
            ContentType: 'application/json',
            success: result => {
                return result;
            }, error: err => {
                return false;
            }
        });
    }
    html(container) {
        console.log(location.href);
        
        if (location.href !=  ("http://localhost:3000/index.html")){ 
            let logoutbtn = document.createElement("btn");
            logoutbtn.id = "logout-btn";
            logoutbtn.innerHTML = "Logout";

            document.addEventListener('click',(e) => {
                if(e.target && e.target.id== 'logout-btn'){
                    this.logout();
                }
            });
            container.prepend(logoutbtn);
        }
        else {
            let loginbtn = document.createElement("btn");
            loginbtn.id = "login-btn";
            loginbtn.innerHTML = "Login";

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
        footer.innerHTML = "<ul id='playback'><li> <button id='skip-backwards'></button> </li><li> <button id='playback-button'></button> </li><li> <button id='skip-forward'></button> </li></ul>";
        container.append(footer);
        var btn = $("#playback-button");
        var skipForwards = $("#skip-forward");
        var skipBackwards = $("#skip-backwards");
        $.ajax({
            url: "/playbackState",
            type: "GET",
            ContentType: 'application/json',
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
                success: result => {
                    console.log("Skipped Forward Sucessfully")
                    $.ajax({
                        url: "/playbackState",
                        type: "GET",
                        ContentType: 'application/json',
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
                success: result => {
                    console.log("Skipped Backward Sucessfully")
                    $.ajax({
                        url: "/playbackState",
                        type: "GET",
                        ContentType: 'application/json',
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