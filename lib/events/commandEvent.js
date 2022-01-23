// require() only fires the actual requiring once... this should work.
const cmdHandler = require("../commandHandler");
const utils = require("../utils");

const eventName = "messageCreate";

function handler(globals, message) {
    if (utils.isCommand(message, globals.settings.prefix) && message.author.id !== globals.client.user.id) {
        cmdHandler.handleCommand(message);
    }
}

module.exports = {
    eventName,
    handler
};
