client.on('messageCreate', async (message) => {
  if (message.channel.id !== WATCH_CHANNEL_ID) return;

  console.log('MSG:', message.content);
  console.log('EMBEDS:', JSON.stringify(message.embeds));

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
