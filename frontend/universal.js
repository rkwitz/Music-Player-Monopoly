class informationCard {
    constructor(data) {
        this.data = data;
    }
    get data() {
        return this.data;
    }
    set data(data) {
        this.data = data;
    }
    html() {}
}

class artistCard  {
    constructor(data) {
        this.data = data;
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

class playlistCard  {
    html(clickable) {
        // bool clickable --> whether or not this card is interactive
        // return html element to be displayed on page

        // make a button or something that requests all tracks in playlist from backend
        // somehow create trackCards for each card (maybe in here, maybe not I'm not sure)
    }
}

class trackCard  {
    html(clickable) {
        // bool clickable --> whether or not this card is interactive
        // return html element to be displayed on page

        // make a button or something that requests to play this track from backend
    }
}