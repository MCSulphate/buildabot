/*
 Copyright (c) 2017 Matthew Lester <mjflester@gmail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 and associated documentation files (the "Software"), to deal in the Software without restriction, 
 including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included
 in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/

const fs   = require("fs"),
      path = require("path");

// Private function, returns the file that called this package (used for default log name).
function _getCallerFileName() {
    // Capture the original function for setting later.
    let originalFunction = Error.prepareStackTrace;
    
    let callerFile;
    try {
        let err = new Error();
        let currentFile;
        
        // Just return the stack when prepareStackTrace is called.
        Error.prepareStackTrace = function (err, stack) { return stack; };
        
        // Get the current file name and find the caller.
        currentFile = err.stack.shift().getFileName();
        while (err.stack.length) {
            callerFile = err.stack.shift().getFileName();
            
            if (callerFile !== currentFile) break;
        }
    } catch (e) {}
    
    // Set the function back to it's original one.
    Error.prepareStackTrace = originalFunction;
    return path.basename(callerFile);
}

// Module Exports
exports = module.exports = function (options) {
    options = options || {};
    
    // Configure the log file paths.
    let outputFilePath;
    let errorFilePath;
    
    let useFiles = options.useFiles === undefined ? true : !!options.useFiles; // True by default.
    if (useFiles) {
        outputFilePath = path.join(__dirname, "..", "..", "logs", (options.outputFile || "output.log"));
        errorFilePath = path.join(__dirname, "..", "..", "logs", (options.errorFile || "error.log"));
    }
    
    // Configure the log name.
    let logName;
    
    let useLogName = options.logName ? true : !!options.useLogName; // useLogName not needed if logName is being used.
    if (useLogName) {
        if (options.logName) logName = options.logName;
        else logName = _getCallerFileName();
    }
    
    function _getLogName(shouldColour) {
        if (!useLogName) return "";
        let colours = shouldColour ? [Colour.GREY, Colour.GREEN, Colour.RESET] : ["", "", ""];
        // Add spacing here, otherwise unnecessary spacing is created in the actual message when there is no log name.
        return `${colours[0]}[${colours[1]}${logName}${colours[0]}]${colours[2]} `;
    }

    // Level constant, used to identify different types of logs.
    const Level = {
        INFO: 0,
        WARN: 1,
        ERROR: 2,
        
        0: "INFO",
        1: "WARN",
        2: "ERROR"
    };

    // Colour constant, used for colouring log messages.
    const Colour = {
        RESET: "\x1b[0m",

        RED: "\x1b[31m",
        GREEN: "\x1b[32m",
        YELLOW: "\x1b[33m",
        BLUE: "\x1b[34m",
        MAGENTA: "\x1b[35m",
        CYAN: "\x1b[36m",
        WHITE: "\x1b[37m",
        GREY: "\x1b[90m"
    };

    // DateType constant, used for generating different date-related strings.
    const DateType = {
        TIME: 0,
        FULL: 1,
        
        0: "TIME",
        1: "FULL"
    };

    // Function that returns a date-related string.
    function _getDateString(shouldColour, dateType) {
        let date = new Date();
        let colour = shouldColour ? [Colour.GREY, Colour.RESET] : [ "", "" ];
        
        // Pad all (maximum of) 2 digit values with a 0 at the start if they do not already have one.
        let padString = (stringToPad) => { return stringToPad.padStart(2, "0"); };
        let dateString = `[${colour[0]}${padString(date.getDate().toString())}/${padString(date.getMonth().toString())}/${date.getFullYear().toString().substring(2)}${colour[1]}]`;
        let timeString = `${colour[0]}${padString(date.getHours().toString())}:${padString(date.getMinutes().toString())}:${padString(date.getSeconds().toString())}${colour[1]}`;
        
        if (dateType === DateType.FULL) {
            return dateString + " " + timeString;
        } else if (dateType === DateType.TIME) {
            return timeString;
        } else return undefined;
    }

    // Base strings for log messages.
    const startBegin = () => { return `${_getDateString(true, DateType.TIME)} ${Colour.GREY}[`; };
    const startEnd = `${Colour.GREY}] ${_getLogName(true)}${Colour.WHITE}`;
    
    // Checks whether the log folder exists, and if not, tries to create it.
    function _checkFolder() {
        if (!useFiles) return true;
        
        let folderPath = path.join(__dirname, "..", "..", "logs");
        if (!fs.existsSync(folderPath)) {
            try {
                fs.mkdirSync(folderPath);
                return true;
            } catch (e) {
                _logMessage(e, Level.ERROR, Colour.RED);
                return e;
            }
        } else return true;
    }
    
    // Logs a message to the console and returns a string to be appended to the respective files.
    let _logMessage = (message, level, colour) => {
        if (message instanceof Object && !(message instanceof Function)) message = "\n" + JSON.stringify(message, null, 4);
        else if (message instanceof Function) message = "\n" + message;
        console.log(`${startBegin()}${colour}${Level[level]}${startEnd}${message}${Colour.RESET}`);
        return `${_getDateString(false, DateType.FULL)} [${Level[level]}] ${_getLogName(false)}${message}\n`;
    };
    
    // Returns error object if it fails to create the folder.
    let folderCreated = _checkFolder();
    if (!folderCreated) {
        _logMessage("Failed to create logs folder.", Level.ERROR, Colour.RED);
        return { error: "Failed to create logs folder." };
    }
    
    // Appends a log message to a file.
    function _appendToFile(path, content) {
        fs.appendFile(path, content, "utf-8", (err) => {
            if (err) {
                _logMessage(`Failed to append to logfile '${path}'.`, Level.ERROR, Colour.RED);
            }
        });
    }

    // Interface to use this module.
    return {
        usingFiles: useFiles,
        
        // Logs an info message.
        info: (message) => {
            let messageToLog = _logMessage(message, Level.INFO, Colour.BLUE);
            if (useFiles) _appendToFile(outputFilePath, messageToLog);
        },

        // Logs a warning message.
        warn: (message) => {
            let messageToLog = _logMessage(message, Level.WARN, Colour.YELLOW);
            if (useFiles) _appendToFile(outputFilePath, messageToLog);
        },

        // Logs an error message.
        error: (message) => {
            let messageToLog = _logMessage(message, Level.ERROR, Colour.RED);
            if (useFiles) {
                _appendToFile(outputFilePath, messageToLog);
                _appendToFile(errorFilePath, messageToLog);
            }
        },
        
        // Logs a custom message.
        log: (message, level, colour) => {
            let messageToLog = _logMessage(message, level, colour);
            if (useFiles) _appendToFile(outputFilePath, messageToLog);
        },
        
        // Constants
        Colour: Colour,
        Level: Level,
        DateType: DateType,
        
        // Adds a custom message to be used.
        addLevel: function (level) {
            let indexToAdd = Object.keys(this.Level).length / 2;
            this.Level[level.toUpperCase()] = indexToAdd;
            this.Level[indexToAdd] = level.toUpperCase();
        },
        
        // Sets the log name.
        setLogName: function (name) {
            logName = name || _getCallerFileName();
        }
    };
};
