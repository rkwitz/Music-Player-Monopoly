function setup() {
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("indexContainer");

    link = createA('/login', '');

    draw();
}

function draw() {
    drawScreen();
    var img=createImg('../resources/login.png', 'login').parent(link);
    img.position(windowWidth-140, 129-84);
    img.size(img.width,img.height);

    textSize(28);
    textAlign(CENTER, BOTTOM);
    text("Music Player Monopoly", windowWidth/2, 130);

    textAlign(CENTER, TOP);
    text("Welcome to Music Player Monopoly!\n\nWe use Spotify data to show you the most\ninteresting statistics about your unique music taste.\n\nClick the button in the top right to sign\nin through Spotify and get started!", windowWidth/2, windowHeight*1/3);
}
