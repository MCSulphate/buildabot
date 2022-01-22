A simple coloured logger, with file support. All messages are nicely styled, coloured
and logged to the console, and to two files: one for combined logs, and one for errors.

## Installation
`npm install coloured-logger`

## Usage
This package is very simple to use, and can be required and set up on a single line:

```js
const logger = require("coloured-logger")(options);
```
Requiring returns an object that you can use to log your messages.

### Features
* Logs to the console and (optionally) to files, one for combined logs and one for errors.
* Supports custom logging levels and different colours.
* No dependencies and very lightweight.
* Ready to use straight out of the box, no additional configuration is necessary.
* Logs timestamps to the console, and date + timestamps to files.

### Options
* `outputFile` - A filename for the combined log file. Defaults to `output.log`.
* `errorFile` - A filename for the error log file. Defaults to `error.log`.
* `useFiles` - Specifies whether you want to use files or not. Default is `true`.
* `logName` - The name of the logger, to show next to each message. Default is the filename
  of the calling file.
* `useLogName` - Specifies whether you want to use a log name for this logger. Default is
  false. This is not needed if you use `logName`.

**Note:** All options are optional, none are required. By default, output files are set to
`output.log` and `error.log` for combined and errors, respectively. All logs are kept in the
`logs` directory.

### Functions
* `logger.info(message)` - Logs an information message.
* `logger.warn(message)` - Logs a warning message.
* `logger.error(message)` - Logs an error message.
* `logger.log(message, level, colour)` - Logs a message with the given level and colour.
* `logger.addLevel(level)` - Adds a custom level to the logger.Level object.
* `logger.setLogName([name])` - Sets the name of the logger, if no name specified then will
  default to the filename of the calling file.

### Additional Information
**Available Colours:**
* RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, GREY
* RESET (used to reset the colour of the text to the default)

All colours can be accessed from the logger.Colour object.

### Example Usage

```js
const logger = require("./index")({ useFiles: false, useLogName: true, logName: "Tests" }),
    Colour = logger.Colour,
    Level = logger.Level;

// Info, Warning and Error Messages
logger.info("Information message :)");
logger.warning("Warning messsage :/");
logger.error("Error message :( \n");

// Custom Levels & Messages
logger.addLevel("CUSTOM");
logger.log("Custom message!", Level.CUSTOM, Colour.MAGENTA);

// Object Logging
let obj = {
    str: "string",
    num: 100,
    bool: false,
    obj: {}
};
logger.info(obj);

// Changing the Log Name
logger.setLogName();

// Time Stamp Check
setTimeout(() => {
    logger.info("Time stamp check.");
}, 1000);
```

**Output:**

![Example Usage Output](https://image.prntscr.com/image/i8ZlBC9WQzmVK_ogO4wmpg.png)

The example code can be found in the `tests.js` file.

## License
I am using the [MIT License](https://opensource.org/licenses/MIT) for this package.