import { channel } from "diagnostics_channel";
import { AwaitReactionsOptions, Client, Message } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";

export default (client: Client): void => {
    client.on("messageCreate", async (msg) => {
        try {
            if (!msg.guild || !msg.member) return;
            if (!msg.member.user) return;
            if (msg.member.user.bot) return;
        } catch (err) {
            return;
        }
        const prefix = '!' //前綴符號定義
        if (msg.content.substring(0, prefix.length) === prefix) {
            const args = msg.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            const clientMsg = args.join(" ");
            try {
                const index = msg.content.indexOf(' ', prefix.length);
                switch (cmd) {
                    case 'echo':
                        // 回復相同訊息
                        await Echo(msg, clientMsg)
                        break;
                    case 'boardcast':
                        // 定期發送訊息到特定頻道
                        await Boardcast(msg, clientMsg, client);
                        break;
                    case 'text_channel':
                        await CreateChannel(msg, clientMsg)
                        break;
                    case 'kick':
                        // 踢出特定使用者
                        await Kick(msg);
                        break;
                    case 'ban':
                        // 禁言特定使用者
                        await Ban(msg);
                        break;
                }
            } catch (err) {
                console.log('OnMessageError', err);
            }
        }
    });
};
/** 回傳相同訊息 */
function Echo(msg: Message, clientMsg: string) {
    if (!clientMsg) {
        msg.channel.send("沒有輸入需要回傳內容!");
        return;
    }
    msg.channel.send(clientMsg);

}
/** 發送訊息到特定頻道 */
function Boardcast(msg: Message, clientMsg: string = null, client: Client) {
    if (!clientMsg) {
        msg.channel.send("沒有輸入需要回傳內容!");
        return;
    }
    msg.reply('確定在所有附屬服務器上廣播這條消息嗎？').then(confirmationMessage => {
        const emojis = ['✅', '❌'];
        for (const emoji of emojis) {
            confirmationMessage.react(emoji);
        }
        const filter = (reaction, user) => {
            console.log('there')
            return emojis.includes(reaction.emoji.name) && user.id === msg.author.id;
        };
        confirmationMessage.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] }).then(reactions => {
            const emoji = reactions.first().emoji.name;
            console.log(emoji);
            switch (emoji) {
                case '✅':
                    const channels = client.channels.cache
                    console.log(channels)

                    break;
                case '❌':
                    msg.reply('廣播中斷！');

            }
        })




    });
    // msg.channel.send(clientMsg);

}
/** 創建文字頻道 */
function CreateChannel(msg: Message, name: string) {
    if (!name) {
        msg.channel.send("沒有輸入需要頻道名稱!");
        return;
    }
    msg.guild.channels.create(name, {
        type: ChannelTypes.GUILD_TEXT, permissionOverwrites: [{
            id: msg.guild.id,
            allow: ['VIEW_CHANNEL'],
            deny: ['SEND_MESSAGES'],
        }]
    })
    msg.channel.send(`頻道${name}創建成功!`);

}
/** 踢出 */
function Kick(msg: Message) {
    const member = msg.mentions.members?.first();
    const checkBot = member.user.bot;
    if (!member || checkBot) {
        msg.channel.send('請標註人員');
        return;
    }
    member.kick()
    msg.channel.send(`你踢出<@${member.id}>`);
}

/** 禁言一分鐘 */
function Ban(msg: Message) {
    const member = msg.mentions.members?.first();
    const checkBot = member.user.bot;
    if (!member || checkBot) {
        msg.channel.send('請標註人員');
        return;
    }
    member.timeout(1 * 60 * 1000);
    msg.channel.send(`你禁言<@${member.id}>一分鐘!`);

}