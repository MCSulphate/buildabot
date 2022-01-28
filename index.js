const log = require("coloured-logger")({ logName: "Application", useFiles: false });
const Discord = require("discord.js");
const Intents = Discord.Intents.FLAGS;
const path = require("path");
const fs = require("fs");

const utils = require("./lib/utils");
const cmdHandler = require("./lib/commandHandler");
const eventHandler = require("./lib/eventHandler");

const defaultOptions = {
    intents: [
        Intents.GUILDS,
        Intents.GUILD_MEMBERS,
        Intents.GUILD_MESSAGES,
        Intents.GUILD_INVITES,
        Intents.GUILD_MESSAGE_REACTIONS,
        Intents.DIRECT_MESSAGES
    ]
};

let client;

module.exports = function(options = defaultOptions) {
    log.info("Starting up...");

    if (!options) {
        options = defaultOptions;
    }

    client = new Discord.Client({
        intents: options.intents
    });

    // Default settings.
    const defaultSettings = {
        clientToken: "",
        prefix: "!"
    };
    
    // Always try to create the external buildabot folder.
    let folderPath = path.join(__dirname, "..", "..", "buildabot");
    try {
        fs.mkdirSync(folderPath);
    }
    catch (err) {
        // Ignore 'exists' errors.
        if (err.code !== "EEXIST") {
            log.error(`Failed to create buildabot folder: ${err.message}`);
            return;
        }
    }

    // Load settings and data.
    let settings = utils.readOrCreateJSONFile("settings.json", defaultSettings, true);
    let data = utils.readOrCreateJSONFile("data.json");

    // Check whether a client token has been set.
    if (settings.clientToken) {
        log.info("Loaded settings and data.");
    }
    else {
        log.warn("No client token found in the settings file, please set one and relaunch.");
        return;
    }

    // Log a 'ready' message when the bot has logged in.
    // This event must be added first, to ensure it has priority over added events.
    client.on("ready", () => {
        log.info("Bot logged in, application started successfully.");
    });

    // Create globals here, so they are consistent across events and commands.
    const globals = {
        settings,
        data,
        client,
        utils
    };

    // Load events.
    eventHandler.initEventHandler(globals);
    log.info("Loaded event handlers.");

    // Load commands.
    cmdHandler.initCommandHandler(globals);
    log.info("Loaded commands.");

    // Exit if the bot failed to start.
    if (!settings || !data) {
        log.error("There was an error starting the bot.");
        process.exit(1);
    }

    // Login with the bot user token.
    client.login(settings.clientToken)
        .catch(err => {
            log.error(`Error logging in: ${err.message}`);
        });

};