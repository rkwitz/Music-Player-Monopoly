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
}

class artistCard extends informationCard{
    html() {
        // return html element to be displayed on page
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