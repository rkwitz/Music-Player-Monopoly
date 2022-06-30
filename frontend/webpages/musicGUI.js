function preload(){
    trans = loadImage("../resources/transparentButton.png");
}

function setup(){
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("musicContainer");

    homeLink = createA('landing.html', '');
    statLink = createA('stats.html', '');

    let songButton = createButton('');
    songButton.style('background-color', (0,0,0,0));
    songButton.style('background-size', (200,100));
    songButton.position(windowWidth/2-240-120, 250);

    draw();
}

function draw() {
    drawScreen();
    var homeTab=createImg('../resources/home.png', 'home').parent(homeLink);
    homeTab.position(50, 129-84);
    homeTab.size(homeTab.width,homeTab.height);

    var statsTab=createImg('../resources/stats.png', 'stats').parent(statLink);
    statsTab.position(homeTab.x + 140, 129-84);
    statsTab.size(statsTab.width,statsTab.height);

    textSize(32);
    textAlign(RIGHT, BOTTOM);
    text("Welcome", windowWidth-280, 130);

    textSize(28);
    textAlign(CENTER, BOTTOM);
    text("Music", windowWidth/2, 130);

    stroke(255);
    fill(0,0,0,0);
    rect(windowWidth/2-240-120, 250, 240, 96, 20);
    rect(windowWidth/2+120, 250, 240, 96, 20);

    textAlign(CENTER, TOP);
    text("Liked Songs", windowWidth/2-240,250+15);
    text("Liked Albums", windowWidth/2+240,250+15);
}
