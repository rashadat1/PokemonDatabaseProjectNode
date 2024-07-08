const axios = require("axios");
const cheerio = require("cheerio");

async function fetchNews() {
    try {
        const { data } = await axios.get("https://pokemondb.net/");
        const $ = cheerio.load(data);

        const titles = [];
        const urls = [];
        const dates = [];
        const descriptions = [];

        $('.grid-col.span-md-8').each((index, element) => {
            const titleElement = $(element).find('h2');
            const dateElement = $(element).find('p.pull-up.text-muted');
            let currentDescription = '';
            //const descriptionElements = $(element).find('p').not('.pull-up.text-muted');

            titleElement.each((i,el) => {
                const title = $(el).find('a').text().trim();
                const url = 'https://pokemondb.net' + $(el).find('a').attr('href');

                $(el).nextUntil('h2').each((j, descElem) => {
                    if ($(descElem).is('p') && !$(descElem).hasClass('pull-up')) {
                        currentDescription += $(descElem).text().trim() + ' ';
                    }
                });
                console.log(i+" "+ title)

                titles.push(title);
                urls.push(url);
                descriptions.push(currentDescription.trim());
                currentDescription='';
            })

            dateElement.each((i,el) => {
                const date = $(el).text().trim();
                console.log(i + " " + date);
                dates.push(date);
            })

        });

    const newsItems = {
        titles,
        urls,
        dates,
        descriptions
    };
    //console.log('titles has length:',titles.length)
    //console.log(newsItems);
    return newsItems;
} catch(error) {
    console.error('Error fetching news:',error);
    return[];
}
}

module.exports = fetchNews;