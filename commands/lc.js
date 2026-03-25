const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lc')
    .setDescription('Wykonaj legit check')
    .addStringOption(option => option.setName('produkt').setDescription('Produkt').setRequired(true))
    .addNumberOption(option => option.setName('ilosc').setDescription('Ilość').setRequired(true).setMinValue(1))
    .addNumberOption(option => option.setName('cena').setDescription('Cena w PLN').setRequired(true).setMinValue(0.01))
    .addStringOption(option => option.setName('metoda_platnosci').setDescription('Metoda płatności').setRequired(true))
    .addUserOption(option => option.setName('kupujacy').setDescription('Kupujący').setRequired(true)),

  async execute(interaction, CONFIG) {
    if (interaction.user.id !== CONFIG.ownerId) {
      return interaction.reply({ content: '❌ Brak permisji!', ephemeral: true });
    }

    if (!interaction.channel.name.toLowerCase().includes(CONFIG.ticketKeyword)) {
      return interaction.reply({ content: '❌ Użyj na kanale ticket!', ephemeral: true });
    }

    const produkt = interaction.options.getString('produkt');
    const ilosc = interaction.options.getNumber('ilosc');
    const cena = interaction.options.getNumber('cena');
    const metoda = interaction.options.getString('metoda_platnosci');
    const kupujacy = interaction.options.getUser('kupujacy');

    const targetChannel = interaction.guild.channels.cache.find(
      channel => channel.name === CONFIG.targetChannelName && channel.type === ChannelType.GuildText
    );

    if (!targetChannel) {
      return interaction.reply({ content: '❌ Brak kanału legit-check!', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('🛡️ ROBUX SHOP × LEGIT CHECK')
      .setDescription(
        `📋 **SZCZEGÓŁY ZAMÓWIENIA**\n\n` +
        `> 💎 **PRODUKT:** \`${produkt}\`\n` +
        `> 🔢 **ILOŚĆ:** \`${ilosc} szt.\`\n` +
        `> 💰 **KWOTA:** \`${cena.toFixed(2)} PLN\`\n` +
        `> 💳 **METODA:** \`${metoda}\`\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `👤 **KUPUJĄCY**\n\n` +
        `> ${kupujacy.toString()}\n` +
        `> \`${kupujacy.tag}\`\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🛒 **SPRZEDAJĄCY**\n\n` +
        `> <@${CONFIG.ownerId}>\n` +
        `> \`ID: ${CONFIG.ownerId}\``
      )
      .setColor(CONFIG.embedColor)
      .setImage('https://i.imgur.com/4QvB5sK.png')
      .setTimestamp();

    await targetChannel.send({ embeds: [embed] });
    await interaction.reply({ content: `✅ Wysłano na ${targetChannel}`, ephemeral: true });
  }
};