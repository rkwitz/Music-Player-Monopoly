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
}
