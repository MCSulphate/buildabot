const logger = require("./index")({ useFiles: false, logName: "Tests" }),
    Colour = logger.Colour,
    Level = logger.Level;

// Info, Warning and Error Messages
logger.info("Information message :)");
logger.warn("Warning messsage :/");
logger.error("Error message :( \n");

// Custom Levels & Messages
logger.addLevel("CUSTOM");
logger.log("Custom message!", Level.CUSTOM, Colour.MAGENTA);

// Object Logging
let obj = {
    str: "string",
    num: 100,
    bool: false,
    obj: {}
};
logger.info(obj);

// Function Logging
function someFunction() {
}
logger.info(someFunction);

// Changing the Log Name
logger.setLogName();

// Time Stamp Check
setTimeout(() => {
    logger.info("Time stamp check.");
}, 1000);