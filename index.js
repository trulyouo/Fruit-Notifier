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

  const contentMatch = message.content?.includes(TRIGGER_TEXT);

  const embedMatch = message.embeds?.some(embed =>
    embed.title?.includes(TRIGGER_TEXT) ||
    embed.description?.includes(TRIGGER_TEXT) ||
    embed.fields?.some(field =>
      field.name?.includes(TRIGGER_TEXT) ||
      field.value?.includes(TRIGGER_TEXT)
    ) ||
    embed.footer?.text?.includes(TRIGGER_TEXT) ||
    embed.author?.name?.includes(TRIGGER_TEXT)
  );

  if (contentMatch || embedMatch) {
    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
    const alertChannel = await client.channels.fetch(ALERT_CHANNEL_ID);
    if (alertChannel) {
      await alertChannel.send(`@everyone - DIVINE HIT!\n${messageLink}`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
