const Discord = require("discord.js");
const countriesJSON = require("../../data/countries.json");
const novelcovid = require("coronacord-api-wrapper");
const fetch = require("node-fetch");

Object.defineProperty(String.prototype, "toProperCase", {
  value: function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
});

module.exports = {
  name: "corona",
  description: "Exibe informações sobre o coronavirus.",
  usage: "[country]",
  async execute (client, message, args) {
    if (!args[0]) {
      const stats = await novelcovid.all();
      const countryStats = await novelcovid.countries();
      var todayDeaths = 0;
      var todayCases = 0;
      countryStats.forEach(country => { todayDeaths += country.todayDeaths; todayCases += country.todayCases; });
      const activeCases = stats.cases - stats.deaths - stats.recovered;
      const embed = new Discord.MessageEmbed()
        .setAuthor("Estado do Coronavirus", client.settings.avatar)
        .addField("Casos Confirmados", `**${stats.cases.toLocaleString()}**`, true)
        .addField("Casos do dia", `+${todayCases.toLocaleString()}`, true)
        .addField("Mortes do Dia", `+${todayDeaths.toLocaleString()}`, true)
        .addField("Infectados", `${activeCases.toLocaleString()} (${((activeCases / stats.cases) * 100).toFixed(2)}%)`, true)
        .addField("Recuperados", `${stats.recovered.toLocaleString()} (${((stats.recovered / stats.cases) * 100).toFixed(2)}%)`, true)
        .addField("Mortes", `${stats.deaths.toLocaleString()} (${((stats.deaths / stats.cases) * 100).toFixed(2)}%)`, true)
        .setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/COVID-19_Outbreak_World_Map.svg/330px-COVID-19_Outbreak_World_Map.svg.png")
        .setColor(client.colors.main)
        .setFooter("Para ver o gráfico do seu país use o comando `c.graph`.")
        .setTimestamp();
      message.channel.send(embed);
    } else {
      const countryInput = args.join(" ").toProperCase();
      var countries = await novelcovid.countries();
      const objCountries = {};
      countries.forEach(c => objCountries[c.country] = c);
      countries = objCountries;
      var name;
      if (countriesJSON[args[0].toUpperCase().trim()]) {
        name = countriesJSON[args[0].toUpperCase().trim()];
      } else {
        name = countryInput;
      }
      if (!countries[name]) return message.channel.send("I couldn't find that country. That country either doesn't exist, was typed incorrectly or has no confirmed cases. For a list of supported country names please type `c.countries`");
      const country = countries[name];
      var wikiName;
      const wikiAliases = {
        "S. Korea": "South Korea",
        "UK": "United Kingdom",
        "USA": "United States"
      };
  
      const thePrefixedContries = ["United States", "Netherlands"];

      if (wikiAliases[country.country]) {
        wikiName = wikiAliases[country.country];
      } else {
        wikiName = country.country;
      }

      const WikiPage = await fetch(`https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${thePrefixedContries.includes(wikiName) ? "the_" : ""}${wikiName.replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_")}`).then(res => res.text());
      const ImageRegex = /<meta property="og:image" content="([^<]*)"\/>/;
      const ImageLink = ImageRegex.exec(WikiPage);
      var imageLink;
      if (ImageLink) imageLink = ImageLink[1];
      if (countryInput.toLowerCase() == "uk") imageLink = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/COVID-19_outbreak_UK_case_counts.svg/640px-COVID-19_outbreak_UK_case_counts.svg.png";
  
      const embed = new Discord.MessageEmbed()
        .setAuthor(country.country)
        .addField("Casos confirmados", `**${country.cases.toLocaleString()}**`, true)
        .addField("Casos do dia", `+${country.todayCases.toLocaleString()}`, true)
        .addField("Mortes do dia", `+${country.todayDeaths.toLocaleString()}`, true)
        .addField("Casos confirmados", `${country.active.toLocaleString()} (${((country.active / country.cases) * 100).toFixed(2)}%)`, true)
        .addField("Recuperados", `${country.recovered.toLocaleString()} (${((country.recovered / country.cases) * 100).toFixed(2)}%)`, true)
        .addField("Mortes", `${country.deaths.toLocaleString()} (${((country.deaths / country.cases) * 100).toFixed(2)}%)`, true)
        .addField("Casos por milhão", `${country.casesPerOneMillion.toLocaleString()}`, true)
        .addField("Mortes por miulhão", `${country.deathsPerOneMillion.toLocaleString()}`, true)
        .addField("Primeiro caso", `${country.firstCaseDate}`, true)
        .setThumbnail(`https://www.countryflags.io/${require("../../data/countries_abbreviations.json")[country.country]}/flat/64.png`)
        .setColor(client.colors.main)
        .setFooter("Para ver o gráfico do seu país use o comando `c.graph`.")
        .setTimestamp();
      if (imageLink) embed.setImage(imageLink);
      message.channel.send(embed);
    }
  },
};
