//Global Variables needed
var appPackage = "com.gof.global"

var screenshots = {
    popup_ad: {
        location: "pictures/firstad.png",
        score: 0.99
    },
    home_screen: {
        location: "pictures/homescreen.png",
        score: 0.99
    }
}

//This chunk of code runs first before following main()'s logic flow
if(Android.connected()) {
    Helper.log("Found Device, trying to start bot...");
    main();
} else {
    Helper.log("No device connected!");
}

async function main() {
    Helper.log("Welcome to WoS Farm Bot v1");
    Helper.log("Checking if the game is installed...");
    Helper.log("Trying to start the game...");
    Android.startApp(appPackage);
    await sleep(10000); 
    gameLoop();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function gameLoop() {
    var cont = 1;
    while (cont) {
        var size = Android.getSize();
        Helper.log(size);

        var scrn = Android.takeScreenshot();
        var results = checkScreenshots(scrn);
        var state = detectState(results);

        Helper.log("Determined state: " + state);
    }
}

function checkScreenshots(scrn) {
    var allmatches = {};
    var results = {};

    Object.keys(screenshots).forEach(function(key) {
        var vals = screenshots[key];
        Helper.log("Comparing current screenshot with " + vals.location + " Min Score: " + vals.score);
        //Try to find matches
        var template = new Image(vals.location);
        var matches = Vision.findMatches(scrn, template, vals.score);
        //Set results
        if(matches.length > 0) {
            allmatches = allmatches.concat(matches);
            results[key] = matches;
        }
    });

    Helper.log(allmatches.length + " Matches for various checks found.");
    return results;
}

function detectState(results) {
    var resultKeys = Object.keys(results);
    if(typeof(results.home_screen) == "object" && Object.keys(results.home_screen).length > 0) {
        Helper.log("Detected Main Screen");
        return "home_screen";
    }

    if(typeof(results.popup_ad) == "object" && Object.keys(results.popup_ad).length > 0) {
        Helper.log("Detected Popup Ad on Startup!");
        return "popup_ad";
    }

    return "unknown";
}