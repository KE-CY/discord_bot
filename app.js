const { Client, Intents } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on('messageCreate', (msg) => {
    try {
        if (!msg.guild || !msg.member) return;
        if (!msg.member.user) return;
        if (msg.member.user.bot) return;
    } catch (err) {
        return;
    }

    const prefix = '!' //前綴符號定義
    if (msg.content.substring(0, prefix.length) === prefix) {
        const cmd = msg.content.substring(prefix.length).split(' ');
        try {
            const index = msg.content.indexOf(' ', prefix.length);
            switch (cmd[0]) {
                case 'echo':
                    msg.channel.send(msg.content.substr(index));
                    break;
                case 'boardcast':
                    // 定期發送訊息到特定頻道
                    break;
                case 'text_channel':
                    const name = msg.content.substr(index);
                    msg.guild.channels.create(name, {
                        type: "text",
                        permissionOverwrites: [{
                            id: msg.guild.id,
                            allow: ['VIEW_CHANNEL'],
                            deny: ['SEND_MESSAGES'],
                        }]
                    })
                    break;
                case 'kick':
                    // 踢出特定使用者
                    break;
                case 'ban':
                    // 禁言特定使用者
                    break;
            }
        } catch (err) {
            console.log('OnMessageError', err);
        }
    }

})

