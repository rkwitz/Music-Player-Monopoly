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
    html();
}

class artistCard extends informationCard{
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
        followers.className = "followers";
        
        // TODO: some sort of graphic with popularity?

        let genres = document.createElement('ul');
        genres.classNAME = 'genre-list'
        this.data.genres.foreach((genre) => {
            let genre = document.createElement('li');
            genre.className = 'genre-item';
            genre.append(document.createElement('p').setAttribute('innerHTML', genre).setAttribute("className", "genre"));
            genres.append(genre);
        });

        let name = document.createElement('h3');
        name.className = 'artist-name';
        name.innerHTML = this.data.name;

        let img = document.createElement('img');
        img.className = 'artist-image';
        img.src = this.data.image;
        img.alt = `A photo of the artist "${this.data.name}"`;

        card.append(name).append(img).append(genres).append(followers);
        return card;
    }
}

class playlistCard extends informationCard{
    html(clickable) {
        // bool clickable --> whether or not this card is interactive
        // return html element to be displayed on page

        // make a button or something that requests all tracks in playlist from backend
        // somehow create trackCards for each card (maybe in here, maybe not I'm not sure)
    }
}

class trackCard extends informationCard{
    html(clickable) {
        // bool clickable --> whether or not this card is interactive
        // return html element to be displayed on page

        // make a button or something that requests to play this track from backend
    }
}