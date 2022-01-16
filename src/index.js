//Packages
const Events = require("events");
const Discord = require("discord.js");

//Varibles
const AllEvents = module.exports.Events = "avatarUpdate" || "systemMessage" || "pendingJoin" || "pendingJoinCompleted";
const Eventer = new Events.EventEmitter();
let Client;
let onClient = false;

//STARTER

/**
 * Creates the events for your bot!
 * @param {Discord.Client} client 
 * @param {Array} ExcludedEvents 
 * @param {Boolean} logIt 
 * @param {Boolean} onClient
 * @returns {Events}
 */
module.exports.init = async (client, ExcludedEvents=[], logIt=false, onClient=false) => {
    Client = client;
    if(onClient) onClient = true;
    if(logIt) console.log("Discord Events Started!")
    if(!ExcludedEvents.includes("avatarUpdate")){
        await this.startAvatarUpdate(client);
    } if(!ExcludedEvents.includes("systemMessage")){
        await this.startSystemMessage(client);
    } if(!ExcludedEvents.includes("pendingJoin")){
        await this.startPendingUsers(client);
    }
    return Eventer;
}

//UTILS

/**
 * Logs something.
 * @param {AllEvents} Event 
 * @param  {...any} args 
 */
const log = async (Event, ...args) => {
    if(onClient) Client.emit(Event, args);
    else Eventer.emit(Event, args);
}

//LOGGERS

/**
 * Adds pending users listener.
 * @param {Discord.Client} client
 * @private 
 */
module.exports.startPendingUsers = async (client) => {
    //Wait for stuff
    setInterval(() => {
        for (const guild of client.guilds.cache.values()) {
            for (const member of guild.members.cache.values()) {
                if (member?.pending == false) {
                    log("pendingJoin", member, client);
                } else {
                    log("pendingJoinCompleted", member, client);
                }
            }
        }
    }, 2000);
};

/**
 * Adds member listeners.
 * @param {Discord.Client} client
 * @private 
 */
module.exports.startAvatarUpdate = async (client) => {
    client.on("guildMemberUpdate", (oldMember, newMember) => {
        if(oldMember.displayAvatarURL() == newMember.displayAvatarURL()){
            log("avatarUpdate", oldMember, newMember, newMember.displayAvatarURL(), client);
        }
    });
};

/**
 * Adds system message listeners.
 * @param {Discord.Client} client
 * @private 
 */
module.exports.startSystemMessage = async (client) => {
    client.on("message", async message => {
        if(message.system) log("systemMessage", message, client);
    })
}

/**
 * @event avatarUpdate
 * @param {Discord.GuildMember} oldMember
 * @param {Discord.GuildMember} newMember
 * @param {String} newAvatar
 */

/**
 * @event systemMessage
 * @param {Discord.Message} message
 * @param {Discord.Client} client
 */

/**
 * @event pendingJoin
 * @param {Discord.GuildMember} member
 * @param {Discord.Client} client
 */

/**
 * @event pendingJoinCompleted
 * @param {Discord.GuildMember} member
 * @param {Discord.Client} client
 */