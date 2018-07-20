const argsText = "";
const description = "Displays this list of commands.";
const permissions = [ "SEND_MESSAGES" ];

function handler(sender, channel, args, message, globals) {
    let list = "__Available Commands__";
    let commands = globals.commands;
    
    // Build a list of commands, args and descriptions.
    for (let command of Object.keys(commands)) {
        let argsText = commands[command].argsText;
        let description = commands[command].description;
        
        list += `\n - **${globals.settings.prefix}${command} ${argsText}**: *${description}*`;
    }
    
    // Send the list of commands.
    channel.send(list);
}

module.exports = {
    argsText,
    description,
    permissions,
    handler
};