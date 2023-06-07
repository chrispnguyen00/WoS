//Global Variables needed
var appPackage = "com.gof.global"

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
    //gameLoop();
}