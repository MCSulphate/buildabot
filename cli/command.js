const fs = require("fs");
const path = require("path");
const log = require("coloured-logger")({ logName: "cli", useFiles: false });

function createCommand(commandName, argsText, description, permissions) {
    console.log(`\nCreating command ${commandName}...`);
    
    if (commandName === "prefix" || commandName === "command-list") {
        log.error("You cannot create commands called 'prefix' or 'command-list', these already exist as internal commands.");
        return;
    }
    
    // Get the template and replace all the flags with the contents needed.
    let templateContents = fs.readFileSync(path.join(__dirname, "templates", "command.js"), "utf-8");
    templateContents = templateContents.replace(/%commandName%/, commandName);
    templateContents = templateContents.replace(/%argsText%/, argsText);
    templateContents = templateContents.replace(/%description%/, description);
    templateContents = templateContents.replace(/%permissions%/, getArrayContentsAsString(permissions));
    
    // Save the new template to a new file.
    let externalFolderPath = path.join(__dirname, "..", "..", "..", "buildabot");
    let externalCommandsPath = path.join(__dirname, "..", "..", "..", "buildabot", "commands");
    
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
    let filePath = path.join(externalCommandsPath, commandName + ".js");
    try {
        fs.writeFileSync(filePath, templateContents, "utf-8");
    }
    catch (err) {
        log.error(`Error creating command file: ${err.message}`);
        return;
    }
    
    log.info(`Successfully created the command. It can be found in the ./buildabot/commands/ folder from your project root.`);
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

function getArrayContentsAsString(array) {
    let finalString = "";
    for (let item of array) {
        finalString += `"${item}", `;
    }
    
    return finalString.slice(0, finalString.length - 2);
}

module.exports = {
    createCommand
};