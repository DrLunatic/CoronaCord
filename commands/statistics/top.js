/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const novelcovid = require("coronacord-api-wrapper");
const { post } = require("snekfetch");

module.exports = {
  name: "top",
  description: "Retorna os 10 países com mais casos de coronavirus.",
  async execute (client, message, args) {
    const msg = await message.channel.send(`${client.emojiList.loading} Fetching top countries...`);

    const countryStats = await novelcovid.countries();
    let topCountries = "";

    for (let i = 0; i < 10; i++) {
      const country = countryStats[i];
      topCountries += `${i+1}. **${country.country}**: ${country.cases} cases - ${country.deaths} deaths - ${country.recovered} recovered\n`;
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor("Top 10 países com maior casos de coronavirus", client.settings.avatar)
      .setDescription(topCountries)
      .setColor(client.colors.main);
    msg.edit("", embed);
  },
};
