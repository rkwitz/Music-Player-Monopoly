$( document ).ready(function() {
    var login = new Login();
    login.html(document.body);
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
    html(container) {
        // in here add event handler to upon click
        // performStatistic() method run on every statistic
        // to multiple containers (some hidden) on the page
        let title = document.createElement("h2");
        title.innerHTML = this.statistics[this.currentStat].name;

        let content = document.createElement("section");
        content.id = "statistic-content";
        this.statistics[this.currentStat].performStatistic(content);

        let left = document.createElement("btn");
        left.id = "left-btn";
        left.innerHTML = "left";
        let right = document.createElement("btn");
        right.id = "right-btn";
        right.innerHTML = "right";
        // add event listeners to change currently visualized data
        document.addEventListener('click',function(e){
            if(e.target && e.target.id== 'left-btn'){
                if (!(this.currentStat - 1 <= 0)) {
                    this.currentStat--;
                    this.statistics[this.currentStat].performStatistic(content);
                    title.innerHTML = this.statistics[this.currentStat].name;
                }
             }
        });
        document.addEventListener('click',function(e){
            if(e.target && e.target.id== 'right-btn'){
                if (!(this.currentStat + 1 > this.statistics.length)) {
                    this.currentStat++;
                    this.statistics[this.currentStat].performStatistic(content);
                    title.innerHTML = this.statistics[this.currentStat].name;
                }
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
    get name() {
        return this.name;
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
        let loginbtn = document.createElement("btn");
        loginbtn.id = "login-btn";
        loginbtn.innerHTML = "Login";

        document.addEventListener('click',(e) => {
            if(e.target && e.target.id== 'login-btn'){
                this.login();
             }
        });

        let logoutbtn = document.createElement("btn");
        logoutbtn.id = "logout-btn";
        logoutbtn.innerHTML = "Logout";

        document.addEventListener('click',(e) => {
            if(e.target && e.target.id== 'logout-btn'){
                this.logout();
             }
        });
        container.prepend(loginbtn);
        container.prepend(logoutbtn);
    }
}