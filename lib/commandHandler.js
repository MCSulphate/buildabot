const log = require("coloured-logger")({ logName: "CommandHandler", useFiles: false });
const fs = require("fs");
const path = require("path");
const commands = {};

let settings;
let globals;

// Loads all of the command handlers, sets needed values.
function initCommandHandler(g) {
    // Set globals.
    globals = g;
    settings = g.settings;

    let commandName;

    try {
        let internalPath = path.join(__dirname, "commands");
        let externalPath = path.join(__dirname, "..", "..", "..", "buildabot", "commands");
        
        // Always try to create the external commands folder.
        try {
            fs.mkdirSync(externalPath);
        }
        catch (err) {
            // Ignore 'existing' error messages.
            if (err.code !== "EEXIST") {
                log.error(`Error creating external commands folder: ${err.message}`);
                return;
            }
        }
        
        let internalFiles = fs.readdirSync(internalPath);
        let externalFiles = fs.readdirSync(externalPath);

        // Load internal first, then external, checking for clashes with internal commands.
        for (let file of internalFiles) {
            // Figure out the full path, command name and then require it.
            let fullPath = path.join(internalPath, file);
            commandName = file.split(".")[0];
            commands[commandName] = require(fullPath);
        }
        
        for (let file of externalFiles) {
            let fullPath = path.join(externalPath, file);
            commandName = file.split(".")[0];
            
            if (commands[commandName]) {
                // Don't let there be duplicate commands.
                log.warn(`Duplicate command: ${commandName}. prefix and command-list are internal commands and cannot be modified.`);
            }
            else {
                commands[commandName] = require(fullPath);
            }
        }

        globals.commands = commands;
    }
    catch (err) {
        if (commandName) {
            log.error(`Error loading command ${commandName}: ${err.message}`);
        }
        else {
            log.error(`Error loading commands: ${err.message}`);
        }

        process.exit(1);
    }
}

// Handles a command.
function handleCommand(message) {
    let command = message.content;

    // Make sure it's not in DMs.
    if (message.channel.type !== "text") {
        message.channel.send("I don't work in DMs! Try typing that command again, but in a server.");
        return;
    }

    // Make sure the user is still part of the server.
    if (!message.member) {
        message.channel.send("You must still be a part of the server you sent this command from.");
        return;
    }

    // Split into arguments.
    let args = command.split(" ") || [];
    let commandName = args.shift().substring(settings.prefix.length);

    // Check if the command actually exists, and handle it.
    if (!commands[commandName]) {
        message.channel.send(`Invalid command. Type ${settings.prefix}command-list for a list of commands.`);
    }
    else if (!hasPermissions(message.member, commands[commandName].permissions)) {
        message.channel.send("You do not have permission to use that command.");
    }
    else {
        // Parameters in order:
        // The author of the message, the channel it was sent in, the arguments, the message, then settings/data.
        try {
            commands[commandName].handler(message.author, message.channel, args, message, globals);
        }
        catch (err) {
            log.error(`Error executing command ${commandName}: ${err.message}`);
            message.channel.send("There was an internal error executing that command, please try again.");
        }
    }
}

// Checks if a user has the required permissions.
function hasPermissions(user, permissions) {
    for (let permission of permissions) {
        if (!user.hasPermission(permission)) return false;
    }

    return true;
}

// Export the functions.
module.exports = { initCommandHandler, handleCommand };
