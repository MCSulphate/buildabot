const log = require("coloured-logger")({ logName: "Utils", useFiles: false });
const fs = require("fs");
const path = require("path");

// Write-queue system, to prevent attempted concurrent write operations.
let writeQueue = [];

function getWriteLock() {
    if (writeQueue.length == 0) {
        writeQueue.push({});
        return;
    }
    else {
        return new Promise(resolve => {
            writeQueue.push(resolve);
        });
    }
}

function freeWriteLock() {
    writeQueue.shift();

    if (writeQueue.length != 0) {
        writeQueue[0]();
    }
}

// Reads or creates a JSON file.
function readOrCreateJSONFile(fileName, defaultContent, prettyPrint) {
    fileName = path.join(__dirname, "..", "..", "..", "buildabot", "data", fileName);
    defaultContent = defaultContent || {};
    let contents = null;
    
    // Always try to create the ./data folder, just in case.
    try {
        let dataFolder = path.join(__dirname, "..", "..", "..", "buildabot", "data");
        fs.mkdirSync(dataFolder);
    }
    catch (err) {
        // Ignore the error if it's just telling us it exists.
        if (err.code !== "EEXIST") {
            log.error(`Error creating the data folder: ${err.message}`);
            return contents;
        }
    }
    
    try {
        contents = JSON.parse(fs.readFileSync(fileName, "utf-8"));
    }
    catch (err) {
        // If the file doesn't exist, write a blank JSON object to it.
        if (err.code === "ENOENT") {
            try {
                // Create the file with default content.
                let spacing = prettyPrint ? 4 : null;
                fs.writeFileSync(fileName, JSON.stringify(defaultContent, null, spacing), "utf-8");
                contents = defaultContent;
            }
            catch (err) {
                log.error(`Error writing to ${fileName}: ${err.message}`);
            }
        }
        // Log all other errors.
        else {
            log.error(`Error reading from ${fileName}: ${err.message}`);
        }
    }
    
    return contents;
}

// Determines whether a message is a command.
function isCommand(message, prefix) {
    return message.content.indexOf(prefix) === 0;
}

// Asynchronously saves to a filename with the given contents.
async function saveDataToFile(data, filename, prettyPrint) {
    await getWriteLock();

    filename = path.join(__dirname, "..", "..", "..", "buildabot", "data", filename);
    fs.writeFile(filename, JSON.stringify(data, null, prettyPrint ? 4 : null), "utf-8", err => {
        if (err) {
            log.error(`Error writing to ${filename}: ${err.message}`);
        }

        freeWriteLock();
    });
}

// Asynchronously saves settings.
function saveSettings(settings) {
    saveDataToFile(settings, "settings.json", true);
}

// Asynchronously saves data.
function saveData(data) {
    saveDataToFile(data, "data.json");
}

// Gets a user id from an @ mention.
function getUserIDFromMention(mention) {
    return mention.replace(/(<|>|@)*/g, "");
}

// Export everything.
module.exports = {
    readOrCreateJSONFile,
    isCommand,
    saveSettings,
    saveData,
    getUserIDFromMention
};