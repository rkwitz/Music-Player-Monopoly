function setup() {
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("landingContainer");

    musicLink = createA('music.html', '');
    statLink = createA('stats.html', '');
    
    draw();
}

function draw() {
    drawScreen();
    var musicTab=createImg('../resources/music.png', 'music').parent(musicLink);
    musicTab.position(50, 129-84);
    musicTab.size(musicTab.width,musicTab.height);

    var statsTab=createImg('../resources/stats.png', 'stats').parent(statLink);
    statsTab.position(musicTab.x + 140, 129-84);
    statsTab.size(statsTab.width,statsTab.height);

    textSize(32);
    textAlign(RIGHT, BOTTOM);
    text("Welcome", windowWidth-280, 130);

    textSize(28);
    textAlign(CENTER, BOTTOM);
    text("Home", windowWidth/2, 130);
}
