#!/usr/bin/env node

// CLI Helpers
const CommandHelper = require("./command");
const EventHelper = require("./event");
const InteractiveHelper = require("./interactive");

// Help message.
function helpMessage() {
    console.log("Usage:\n\nInteractive:\n bab create <command/event>\n\nOne-line Creation:\n bab create command <commandName> <argsText> <description> [permissions..]\n bab create event <fileName> <eventName>");
}

const args = process.argv.slice(2);
const argsLength = args.length;

if (argsLength < 2) {
    helpMessage();
    return;
}
else if (argsLength === 2) {
    if (args[1] === "command") {
        InteractiveHelper.createInteractiveCommand();
        return;
    }
    else if (args[1] === "event") {
        InteractiveHelper.createInteractiveEvent();
        return;
    }
    else {
        helpMessage();
        return;
    }
}

switch (args[0]) {
    case "create":
        {
            let creationType = args[1];

            if (creationType === "command") {
                if (argsLength >= 5) {
                    let commandName = args[2];
                    let argsText = args[3];
                    let description = args[4];
                    let permissions = argsLength > 5 ? args.slice(5) : [];

                    CommandHelper.createCommand(commandName, argsText, description, permissions);
                    break;
                }
            }
            else if (creationType === "event") {
                if (argsLength >= 4) {
                    let fileName = args[2];
                    let eventName = args[3];

                    EventHelper.createEvent(fileName, eventName);
                    break;
                }
            }
        }

    default:
        {
            helpMessage();
        }
}
