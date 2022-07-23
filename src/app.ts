import { Client, Intents, ClientOptions } from "discord.js";
import * as dotenv from "dotenv";
import message from "./message";
dotenv.config();

import ready from './ready';

console.log("Bot is starting...");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

ready(client);

message(client);


client.login(process.env.BOT_TOKEN);