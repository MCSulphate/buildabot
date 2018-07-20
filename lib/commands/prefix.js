const utils = require("../utils");

const argsText = "<new-prefix>";
const description = "Changes the prefix used for commands.";
const permissions = [ "MANAGE_CHANNELS" ];

function handler(sender, channel, args, message, globals) {
    if (args.length === 0) {
        channel.send(`Not enough command arguments, you need: *${argsText}*`);
        return;
    }
    
    let newPrefix = args[0];
    
    if (newPrefix.length > 5 || newPrefix.length === 0) {
        channel.send("The prefix must be between 1 and 5 characters.");
    }
    else {
        globals.settings.prefix = newPrefix;
        utils.saveSettings(globals.settings);
        
        channel.send(`Set the command prefix to **${newPrefix}**.`);
    }
}

module.exports = {
    handler,
    argsText,
    permissions,
    description
};