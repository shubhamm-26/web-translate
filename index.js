require('dotenv').config();
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const cheerio = require('cheerio');



async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching HTML:', error);
    throw error;
  }
}

async function translateTexts(texts, targetLanguage, AZURE_TRANSLATOR_KEY, AZURE_TRANSLATOR_ENDPOINT, AZURE_LOCATION) {
  const apiUrl = `${AZURE_TRANSLATOR_ENDPOINT}/translate`;

  try {
    const response = await axios({
      baseURL: apiUrl,
      url: '',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_LOCATION,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString(),
      },
      params: {
        'api-version': '3.0',
        'from': 'en',
        'to': targetLanguage,
      },
      data: texts.map(text => ({ 'text': text })),
      responseType: 'json',
    });


    const translationsMap = {};
    response.data.forEach((item, index) => {
      const translatedText = item.translations[0].text;
      const originalText = texts[index];
      translationsMap[originalText] = translatedText;
    });

    const fs = require('fs');
    fs.writeFileSync('translations.json', JSON.stringify(translationsMap));
    return translationsMap;

  } catch (error) {
    console.error('Error translating texts:', error.response?.data || error.message);
    return {};
  }
}


async function translateHTML(url, targetLanguage, AZURE_TRANSLATOR_KEY, AZURE_TRANSLATOR_ENDPOINT, AZURE_LOCATION) {
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);
  const textNodes = [];

  $('body')
    .find('*')
    .not('script,iframe,noscript,style,svg,video')
    .contents()
    .filter((_, element) => element.nodeType === 3)
    .each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        textNodes.push(text);
      }
    });
  const translationsMap = await translateTexts(textNodes, targetLanguage, AZURE_TRANSLATOR_KEY, AZURE_TRANSLATOR_ENDPOINT, AZURE_LOCATION);
  $('body')
    .find('*')
    .not('script,iframe,noscript,style,svg,video')
    .contents()
    .filter((_, element) => element.nodeType === 3)
    .each((_, element) => {
      let originalText = $(element).text().trim();
      originalText = originalText.replace(/\s+/g, ' ').trim();
      if (translationsMap[originalText]) {
        $(element).replaceWith(translationsMap[originalText]);
      }
    });

  return $.html();
}


module.exports = translateHTML;
