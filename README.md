Build-a-Bot
===========
Welcome! This package is very simple to use, and will get you up and running with
Discord bots in no time at all. It uses the **discord.js** package for interfacing
with the Discord API. Please see the discord.js documentation for further help
on using the objects you will use in this package.

This package will allow you to login to Discord as a bot user, and then create
commands and event handlers for your bot to add awesome functionality, just by using
simple command-line commands (from version 1.3.0).

The `coloured-logger` package is being used by the bot for logging messages to the
console and to files.

Usage
=====
Installation
------------
Install the package with `npm install buildabot`. In your main project file, simply
use `require("buildabot")();` at the top of your file to set up the bot. The bot
will create a folder named `buildabot` at the root of your project, make sure to
set your bot's user token in the `settings.json` file, which is created for you.

### Customising Bot Intents
Discord now requires you to declare a set of 'intents' that your bot uses. This is
essentially what events/interactions your bot receives and can use. Some of these
are 'privileged', meaning you can only use them if your bot is in <100 servers, or
if your bot has been verified.

By default, buildabot uses the following set of intents:
 - GUILDS
 - GUILD_MEMBERS
 - GUILD_MESSAGES
 - GUILD_INVITES
 - GUILD_MESSAGE_REACTIONS
 - DIRECT_MESSAGES

Since version 1.7.0, you can now customise the intents that buildabot uses, in case
you do not want to use certain intents/privileged intents. To do so, when using
`require("buildabot")()`, simply pass in an object with an `intents` array, containing
a set of intent flags. You can find the intent flags by importing `discord.js`, under
`Intents.FLAGS`. You can find more information on this [here](https://discordjs.guide/popular-topics/intents.html).

An example of customising the intents might look like this:   
```
const { Intents } = require("discord.js");
require("buildabot")({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });
```

Adding Commands and Events
--------------------------
As of version 1.3.0, you can now create commands and events using the console. Type
`npx bab` to see the command usage.

You have two choices, you can either use the interactive creation process, or a
one-line command to create either commands or events:

**Interactive:**
Type either `npx bab create command` or `npx bab create event` and you will be guided
through the creation process for a command or an event. It will then create the
file in the `./buildabot/commands/` or `./buildabot/events/` directories, from there
you can then add your code for your handlers.

**One-Line Creation:**
For commands, the command you need to use is:
`npx bab create command <commandName> <argsText> <description [permissions..]`

And for events, this is the command:
`npx bab create event <fileName> <eventName>`

Files will be created in the same place.

**Note:** The `prefix` and `command-list` commands have been already set up for you and are
internal commands, so you cannot create these commands. If you don't like them, feel
free to remove them from the `./node_modules/buildabot/lib/commands` folder.

Using Program Settings and Stored Data
--------------------------------------
The handler functions created for commands and event handlers both have a `globals`
parameter. This contains important objects and data essential for managing your bot.

Both command and event handlers have access to the following:
  * `settings` - The application settings, loaded from `./buildabot/data/settings.json`.
  * `data` - The application data, loaded from `./buildabot/data/data.json`.
  * `client` - The Client object from the discord.js package used to connect to Discord.
  * `utils` - The module exports from this package's `utils.js` file.

Additionally, command handlers have access to `commands` - This is an object containing
command names as keys and their handlers as the values, in case you need to read from
this or modify it in any way.

The `utils` object can be used to save the program settings and data at any point,
asynchronously. Simply use `globals.utils.saveSettings(settings);` or
`globals.utils.saveData(data);` to save the settings or data during runtime. A
success/error message will be logged to the console after completion, or if there is
a problem.

Footnote
========
That's about it, so get into it and go and make some awesome Discord bots! Good luck!
P.S. Don't forget to report any issues on the GitHub repo!