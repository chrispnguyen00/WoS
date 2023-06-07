//Global Variables needed
var appPackage = "com.gof.global"

// var screenshots = {
//     popup_ad: {
//         location: "pictures/firstad.png",
//         score: 0.99
//     },
//     home_screen: {
//         location: "pictures/homescreen.png",
//         score: 0.99
//     }
// }

//This chunk of code runs first before following main()'s logic flow
if(Android.connected()) {
    Helper.log("Found Device, trying to start bot...");
    main();
} else {
    Helper.log("No device connected!");
}

function main() {
    Helper.log("Welcome to WoS Farm Bot v1");
    Helper.log("Checking if the game is installed...");
    Helper.log("Trying to start the game...");
    Android.startApp(appPackage);
    gameLoop();
}

function gameLoop() {
    var cont = 1;
    while (cont) {
        var size = Android.getSize();
        Helper.log(size);

        var scrn = Android.takeScreenshot();
        var results = checkScreenshots(scrn);
        Helper.log("Determined result: " + results);
        var state = detectState(results);

        Helper.log("Determined state: " + state);
    }
}

function checkScreenshots(scrn) {
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

    //Helper.log(allmatches.length + " Matches for various checks found.");
    // if(Config.getValue("prntMatches")) {
    //     scrnmatches = Vision.markMatches(scrn, allmatches, magenta, 4);
    //     scrnmatches.save("scrnmatches.png");
    // }
    return results;
}

function detectState(results) {
    var resultKeys = Object.keys(results);
    //Helper.log("Trying to determine gamestate from the following: " + resultKeys);
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