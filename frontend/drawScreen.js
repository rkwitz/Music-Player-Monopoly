// This file will be ran on every page of the site
// Its purpose is to draw the general background details present on every page

function drawScreen() {
    background(40);
    stroke(0);
    textAlign(CENTER, TOP);
    textSize(64);
    fill(0);
    rect(0, 0, windowWidth, 150)
    fill(255);
    text('MPM', windowWidth/2, 30);
}
