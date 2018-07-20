const log = require("coloured-logger")({ logName: "Application" });
const eventName = "error";

function handler(globals, err) {
    log.error(`There was an error: ${err.message}`);
}

module.exports = {
    eventName,
    handler
};