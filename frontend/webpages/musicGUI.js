function setup(){
    createCanvas(windowWidth, windowHeight);

    homeLink = createA('landing.html', '');
    statLink = createA('stats.html', '');
    
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
}
