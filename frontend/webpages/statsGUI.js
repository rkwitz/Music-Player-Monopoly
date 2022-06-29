// create buttons that call increment statIndex and call drawStat();
function setup(){
    createCanvas(windowWidth, windowHeight);
    const LeftButton = createButton('<<');
    const RightButton = createButton('>>');

    LeftButton.mousePressed(function() { ArrowSelect("left");});
    RightButton.mousePressed(function() { ArrowSelect("right");});

    LeftButton.position(windowWidth*5/12, windowHeight*7/9)
    RightButton.position(windowWidth*7/12, windowHeight*7/9)

    musicLink = createA('music.html', '');
    homeLink = createA('landing.html', '');
    
    draw();
}

function draw() {
    drawScreen();
    var musicTab=createImg('../resources/music.png', 'music').parent(musicLink);
    musicTab.position(50, 129-84);
    musicTab.size(musicTab.width,musicTab.height);

    var homeTab=createImg('../resources/home.png', 'home').parent(homeLink);
    homeTab.position(musicTab.x + 140, 129-84);
    homeTab.size(homeTab.width,homeTab.height);

    textSize(32);
    textAlign(RIGHT, BOTTOM);
    text("Welcome", windowWidth-280, 130);

    textSize(28);
    textAlign(CENTER, BOTTOM);
    text("Stats", windowWidth/2, 130);
}
