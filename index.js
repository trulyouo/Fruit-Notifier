const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const WATCH_CHANNEL_ID = '1535308968661094490';

const TRIGGERS = [
  { text: '🍎 [Legendary] Divine', alertChannel: '1561259494799839252', message: '@everyone - DIVINE HIT!' },
  { text: '🍎 [Mythical] Galaxy', alertChannel: '1561911747831398440', message: '@everyone - GALAXY HIT!' },
  { text: '🍎 [Mythical] Empyrean', alertChannel: '1561911833760366674', message: '@everyone - EMPYREAN HIT!' },
  { text: '🍎 [Mythical] Ember', alertChannel: '1561911763102994512', message: '@everyone - EMBER HIT!' },
];

const PAINT_ITEMS = [
  '🎨 [Rare] Lime Blade',
  '🎨 [Legendary] Torment Pain',
  '🎨 [Common] Celebration Bomb',
  '🎨 [Uncommon] Glacier Eagle',
  '🎨 [Rare] Scarlet Ghost',
  '🎨 [Uncommon] Topaz Diamond',
  '🎨 [Legendary] Yellow Lightning',
];
const PAINT_CHANNEL = '1567842857316786317';
const PAINT_THRESHOLD = 4;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.channel.id !== WATCH_CHANNEL_ID) return;

  const fullText = [
    message.content,
    ...message.embeds.map(e => [
      e.title, e.description, e.footer?.text, e.author?.name,
      ...(e.fields?.map(f => `${f.name} ${f.value}`) || [])
    ].join(' '))
  ].join(' ');

  // Regular triggers
  for (const trigger of TRIGGERS) {
    if (fullText.includes(trigger.text)) {
      const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
      const alertChannel = await client.channels.fetch(trigger.alertChannel);
      if (alertChannel) {
        await alertChannel.send(`${trigger.message}\n${messageLink}`);
      }
    }
  }

  // Paint items - count total quantity
  let totalPaint = 0;
  const foundItems = [];

  for (const item of PAINT_ITEMS) {
    // Match item followed by optional "- Nx" to get quantity
    const regex = new RegExp(item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\s*-\\s*(\\d+)x)?', 'g');
    let match;
    while ((match = regex.exec(fullText)) !== null) {
      const qty = match[1] ? parseInt(match[1]) : 1;
      totalPaint += qty;
      foundItems.push(`${item} x${qty}`);
    }
  }

  if (totalPaint >= PAINT_THRESHOLD) {
    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
    const paintChannel = await client.channels.fetch(PAINT_CHANNEL);
    if (paintChannel) {
      await paintChannel.send(`@everyone - PAINT HIT! Total: ${totalPaint}\n${foundItems.join('\n')}\n${messageLink}`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
