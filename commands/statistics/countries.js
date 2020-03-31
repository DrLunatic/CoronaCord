/* eslint-disable no-unused-vars */
const Discord = require("discord.js");

module.exports = {
  name: "countries",
  description: "Shows a list of supported countries and country names.",
  async execute (client, message, args) {
    const embed = new Discord.MessageEmbed()
      .setAuthor("Países suportados", client.settings.avatar)
      .setTitle("Todos os paises e seus nomes podem ser achados aqui")
      .setURL("https://www.worldometers.info/coronavirus/#countries")
      .setColor(client.colors.main);
    message.channel.send(embed);
  },
};
