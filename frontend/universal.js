$( document ).ready(function() {
    let container = document.getElementById("statistic-content");
    topCategory.html(container);
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
    html(statContainer) {
        // in here add event handler to upon click
        // performStatistic() method run on every statistic
        // to multiple containers (some hidden) on the page
        let title = document.createElement("h2");
        title.innerHTML = this.statistics[this.currentStat].name;
        title.className = "stat-title"

        let content = document.createElement("section");
        content.id = "card-container";
        this.statistics[this.currentStat].performStatistic(content);

        let left = document.createElement("btn");
        left.id = "left-btn";
        left.className = "-1"
        left.innerHTML = "left";
        let right = document.createElement("btn");
        right.id = "right-btn";
        right.innerHTML = "right";
        right.className = "1"
        // add event listeners to change currently visualized data
        document.addEventListener('click',(e) => {
            if(e.target && e.target.id== 'left-btn'){
                let targetIndex = parseInt(e.target.className);
                if (targetIndex >= 0) {
                    this.statistics[targetIndex].performStatistic(content);
                    title.innerHTML = this.statistics[targetIndex].name;
                    e.target.className = --targetIndex;
                    let right = parseInt(document.getElementById("right-btn").className);
                    document.getElementById("right-btn").className = --left;
                }
            }
        });
        document.addEventListener('click',(e) => {
            if(e.target && e.target.id== 'right-btn'){
                let targetIndex = parseInt(e.target.className);
                if (targetIndex < this.statistics.length) {
                    // console.log(targetIndex)
                    // console.log(this.statistics[targetIndex])
                    this.statistics[targetIndex].performStatistic(content);
                    title.innerHTML = this.statistics[targetIndex].name;
                    e.target.className = ++targetIndex;
                    let left = parseInt(document.getElementById("left-btn").className);
                    document.getElementById("left-btn").className = ++left;
                }
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
    // set name(name) {
    //     this.name = name;
    // }
    name() {
        return this.name;
    }
    performStatistic(container) {
        // perform whatever functionality necessary for this statistic
        // append content to container
        container.innerHTML = "";
        this.functionality(container);
    }
}