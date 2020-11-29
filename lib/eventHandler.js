const log = require("coloured-logger")({ logName: "EventHandler", useFiles: false });
const fs = require("fs");
const path = require("path");
const utils = require("./utils");
const events = {};

let globals;
let client;

// Event handler function closure.
function eventHandler(eventName) {
    
    // Handles maximum of three event arguments, executing all handlers in the order they were added.
    return function(arg1, arg2, arg3) {
        let handlers = events[eventName];
        for (let handler of handlers) {
            handler(globals, arg1, arg2, arg3);
        }
    };
}

// Function to initialise the event handler.
function initEventHandler(g) {
    globals = g;
    client = g.client;
    
    try {
        let internalPath = path.join(__dirname, "events");
        let externalPath = path.join(__dirname, "..", "..", "..", "buildabot", "events");
        
        // Always try to create the external commands folder.
        try {
            fs.mkdirSync(externalPath);
        }
        catch (err) {
            // Ignore 'existing' error messages.
            if (err.code !== "EEXIST") {
                log.error(`Error creating external events folder: ${err.message}`);
                return;
            }
        }
        
        let internalFiles = fs.readdirSync(internalPath);
        let externalFiles = fs.readdirSync(externalPath);
        
        // Load internal and then external events.
        for (let file of internalFiles) {
            // Figure out the full path.
            let fullPath = path.join(internalPath, file);
            
            // Get the event data.
            let eventData = require(fullPath);
            let eventName = eventData.eventName;
            let handler = eventData.handler;
            
            // If the event is not yet being handled, add a handler function to the client.
            if (!events[eventName]) {
                events[eventName] = [];
                client.on(eventName, eventHandler(eventName));
            }
            
            // Push the event handler on to the array.
            events[eventName].push(handler);
        }
        
        for (let file of externalFiles) {
            let fullPath = path.join(externalPath, file);
            
            // Event data.
            let eventData = require(fullPath);
            let eventName = eventData.eventName;
            let handler = eventData.handler;
            
            if (!events[eventName]) {
                events[eventName] = [];
                client.on(eventName, eventHandler(eventName));
            }
            
            events[eventName].push(handler);
        }
    }
    catch (err) {
        log.error(`Error loading commands: ${err.message}`);
        process.exit(1);
    }
}

module.exports = {
    initEventHandler
};