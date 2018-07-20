const fs = require("fs");
const path = require("path");
const log = require("coloured-logger")({ logName: "cli", useFiles: false });

function createEvent(fileName, eventName) {
    console.log(`\nCreating event handler for the ${eventName} event...`);
    
    // Get the template and replace all the flags with the contents needed.
    let templateContents = fs.readFileSync(path.join(__dirname, "templates", "event.js"), "utf-8");
    templateContents = templateContents.replace(/%eventName%/, eventName);
    
    // Save the new template to a new file.
    let externalFolderPath = path.join(__dirname, "..", "..", "..", "buildabot");
    let externalCommandsPath = path.join(__dirname, "..", "..", "..", "buildabot", "events");
    
    // Try to create the folders needed, ignoring 'existing' errors.
    try {
        tryCreateFolder(externalFolderPath);
        tryCreateFolder(externalCommandsPath);
    }
    catch (err) {
        log.error(`Error creating folders: ${err.message}`);
        return;
    }
    
    // Try and create the new file.
    let filePath = path.join(externalCommandsPath, fileName + ".js");
    try {
        fs.writeFileSync(filePath, templateContents, "utf-8");
    }
    catch (err) {
        log.error(`Error creating event handler file: ${err.message}`);
        return;
    }
    
    log.info(`Successfully created the event handler. It can be found in the ./buildabot/events/ folder from your project root.`);
}

function tryCreateFolder(path) {
    try {
        fs.mkdirSync(path);
    }
    catch (err) {
        if (err.code !== "EEXIST") {
            throw err;
        }
    }
}

module.exports = {
    createEvent
};