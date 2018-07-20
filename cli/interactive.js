const inquirer = require("inquirer");
const CommandHelper = require("./command");
const EventHelper = require("./event");

function createInteractiveCommand() {
    // Questions
    let nameQuestion = getInputQuestion("commandName", "Command Name:");
    let argsTextQuestion = getInputQuestion("argsText", "Command Usage (arguments):");
    let descriptionQuestion = getInputQuestion("description", "Description:");
    
    // List of all the possible permissions.
    let permissions = [
        "ADMINISTRATOR",
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS"
    ];
    
    let permissionsQuestion = {
        type: "checkbox",
        name: "permissions",
        message: "Please select the permissions required to use this command:",
        choices: permissions
    };
    
    // Ask the questions, get the answers.
    let questions = [nameQuestion, argsTextQuestion, descriptionQuestion, permissionsQuestion];
    inquirer.prompt(questions).then(answers => {
        let commandName = answers.commandName;
        let argsText = answers.argsText;
        let description = answers.description;
        let permissions = answers.permissions;
        
        CommandHelper.createCommand(commandName, argsText, description, permissions);
    });
}

function createInteractiveEvent() {
    // Questions
    let fileNameQuestion = getInputQuestion("fileName", "File Name:");
    let eventNameQuestion = getInputQuestion("eventName", "Event Name:");
    
    // Ask the questions, get the answers.
    let questions = [fileNameQuestion, eventNameQuestion];
    inquirer.prompt(questions).then(answers => {
        let fileName = answers.fileName;
        let eventName = answers.eventName;
        
        EventHelper.createEvent(fileName, eventName);
    });
}

function getInputQuestion(name, message) {
    return {
        type: "input",
        name,
        message,
        validate
    };
}

function validate(input) {
    return input ? true : "Please input a value.";
}

module.exports = {
    createInteractiveCommand,
    createInteractiveEvent
};