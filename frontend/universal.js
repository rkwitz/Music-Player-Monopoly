/*  =============================================================
    ==               logic for informationCards                ==
    =============================================================
*/

class informationCard {
    constructor(data) {
        this.data = data; // data from frontend
    }
    html() {}
}

class artistCard extends informationCard  {
    constructor(data) {
        super(data);
    }
    html() {
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

class playlistCard extends informationCard {
    constructor(data) {
        super(data);
    }
    html(clickable) {
        // bool clickable --> whether or not this card is interactive
        // return html element to be displayed on page

        // make a button or something that requests all tracks in playlist from backend
        // somehow create trackCards for each card (maybe in here, maybe not I'm not sure)
    }
}

class trackCard extends informationCard {
    constructor(data) {
        super(data);
    }
    html(clickable) {
        // bool clickable --> whether or not this card is interactive
        // return html element to be displayed on page

        // make a button or something that requests to play this track from backend
    }
}

/*  =============================================================
    ==               logic for statistics page                 ==
    =============================================================
*/

class category {
    constructor(name, statistics) {
        this.statistics = statistics; // arry of statistic objects within the catagory
        this.name = name; // string
        this.currentStat = 0;
    }
    get name() {
        return this.name;
    }
    get statistics() {
        return this.statistics;
    }
    set currentStat(num) {
        this.currentStat = num;
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

class statistic {
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