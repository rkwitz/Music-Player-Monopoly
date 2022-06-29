// globals
var statIndex = 0;  // default stat to show; could refer to topSongs

// Switch case to determine which stat to display on screen
function displayStat(){
    switch (statIndex){
        case 0:
            // code for graphically displaying stat at index 0
            break;
        default:
            console.log("Error: Out of domain");
    }
}

// Button Events
function ArrowSelect(dir) {
    if (dir == "left" && statIndex > 0) {
        statIndex--;
    }
    else if (statIndex < (allStats.length-1)){
        statIndex++;
    }
    displayStat();
}
