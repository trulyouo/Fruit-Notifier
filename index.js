const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const WATCH_CHANNEL_ID = '1535308968661094490';
const ALERT_CHANNEL_ID = '1561259494799839252';
const TRIGGER_TEXT = '🍎 [Legendary] Divine';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.channel.id !== WATCH_CHANNEL_ID) return;

  if (message.content.includes(TRIGGER_TEXT)) {
    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
    const alertChannel = await client.channels.fetch(ALERT_CHANNEL_ID);
    if (alertChannel) {
      await alertChannel.send(`@everyone - DIVINE HIT!\n${messageLink}`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
