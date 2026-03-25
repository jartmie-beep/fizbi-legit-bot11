const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lc')
    .setDescription('📋 Wykonaj legit check transakcji')
    .addStringOption(option =>
      option.setName('produkt')
        .setDescription('🎮 Nazwa produktu')
        .setRequired(true))
    .addNumberOption(option =>
      option.setName('ilosc')
        .setDescription('🔢 Ilość sztuk')
        .setRequired(true)
        .setMinValue(1))
    .addNumberOption(option =>
      option.setName('cena')
        .setDescription('💰 Cena w PLN')
        .setRequired(true)
        .setMinValue(0.01))
    .addStringOption(option =>
      option.setName('metoda_platnosci')
        .setDescription('💳 Metoda płatności')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('kupujacy')
        .setDescription('👤 Kupujący')
        .setRequired(true)),

  async execute(interaction, CONFIG) {
    // Sprawdzenie czy to właściciel
    if (interaction.user.id !== CONFIG.ownerId) {
      return interaction.reply({
        content: '❌ **Brak permisji!** Tylko właściciel sklepu może używać tej komendy.',
        ephemeral: true
      });
    }

    // Sprawdzenie kanału
    if (!interaction.channel.name.toLowerCase().includes('ticket')) {
      return interaction.reply({
        content: '❌ **Nieprawidłowy kanał!** Użyj tej komendy na kanale z nazwą zawierającą "ticket".',
        ephemeral: true
      });
    }

    // Pobranie danych
    const produkt = interaction.options.getString('produkt');
    const ilosc = interaction.options.getNumber('ilosc');
    const cena = interaction.options.getNumber('cena');
    const metoda = interaction.options.getString('metoda_platnosci');
    const kupujacy = interaction.options.getUser('kupujacy');

    // Formatowanie ceny
    const cenaFormat = cena.toFixed(2);

    // Znalezienie kanału
    const targetChannel = interaction.guild.channels.cache.find(
      channel => channel.name === '✅﹕legit-check' && channel.type === ChannelType.GuildText
    );

    if (!targetChannel) {
      return interaction.reply({
        content: '❌ **Błąd!** Nie znaleziono kanału `✅﹕legit-check`.',
        ephemeral: true
      });
    }

    // ==========================================
    // WYRAŹNY I OSTRA WERSJA EMBEDA
    // ==========================================

    const embed = new EmbedBuilder()
      .setTitle('**ROBUX SHOP**™ × **LEGIT CHECK**')
      .setDescription(
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '📋 **INFORMACJE O ZAMÓWIENIU**\n\n' +
        '┌────────────────────────────────────────┐\n' +
        `│ 💳 **PRODUKT**      →  **${produkt}**\n` +
        `│ 📦 **ILOŚĆ**        →  **${ilosc}**\n` +
        `│ 💰 **KWOTA**        →  **${cenaFormat} PLN**\n` +
        `│ 💸 **METODA**       →  **${metoda}**\n` +
        '└────────────────────────────────────────┘\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '👤 **KUPUJĄCY**\n\n' +
        '┌────────────────────────────────────────┐\n' +
        `│ 👑 ${kupujacy.toString()}\n` +
        `│ 🆔 **${kupujacy.tag}**\n` +
        `│ 📍 **ID:** ${kupujacy.id}\n` +
        '└────────────────────────────────────────┘\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '🛒 **SPRZEDAJĄCY**\n\n' +
        '┌────────────────────────────────────────┐\n' +
        `│ 👑 <@${CONFIG.ownerId}>\n` +
        `│ 🆔 **${interaction.user.tag}**\n` +
        `│ 📍 **ID:** ${CONFIG.ownerId}\n` +
        '└────────────────────────────────────────┘\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '✅ **STATUS**        →  **ZWERYFIKOWANO POMYŚLNIE**'
      )
      .setColor(0x2ECC71)
      .setThumbnail('https://cdn.discordapp.com/emojis/890915534319894548.png')
      .setImage('https://image2url.com/r2/default/images/1774449217451-e330583a-359f-41a2-b7e0-8300eab4e4b7.jpg')
      .setFooter({
        text: `✅ Legit Check • ${new Date().toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setTimestamp();

    // Wysłanie embeda
    await targetChannel.send({ embeds: [embed] });

    // Potwierdzenie
    await interaction.reply({
      content: `✅ **Legit Check został wysłany!**\n📨 Kanał: ${targetChannel.toString()}`,
      ephemeral: true
    });
  }
};
