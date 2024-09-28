# Translate HTML with Azure Translator API

This package allows you to translate HTML content from a given URL using the Azure Translator API. It scrapes text from the webpage, translates it using the Azure Translator API, and returns the translated HTML content.

## Features

- Translates the text content of an HTML webpage.
- Skips non-translatable elements like `<script>`, `<iframe>`, `<noscript>`, `<style>`, `<svg>`, and `<video>`.
- Leverages the Azure Translator API for high-quality translations.
- Stores translations in a JSON file for easy access and reuse.

## Installation

To use this package in your project, install it via npm:

```bash
npm i azure-web-translate
```

## Usage

### Basic Example

Below is an example of how to use the `translateHTML` function to translate a webpage to French:

```javascript
const { translateHTML } = require('translate-html-npm');

const url = 'https://example.com';
const targetLanguage = 'fr';
const azureKey = 'YOUR_AZURE_TRANSLATOR_API_KEY';
const azureRegion = 'YOUR_AZURE_REGION';

translateHTML(url, targetLanguage, azureKey, azureRegion)
  .then(translatedHTML => {
    console.log(translatedHTML);
  })
  .catch(error => {
    console.error('Translation error:', error);
  });
```

### translateHTML(url, targetLanguage, azureKey, azureRegion, options)

Translates the HTML content of a given URL.

- `url` (string): The URL of the webpage to translate.
- `targetLanguage` (string): The target language code (e.g., 'fr' for French).
- `azureKey` (string): Your Azure Translator API key.
- `azureRegion` (string): Your Azure region.

Returns a Promise that resolves with the translated HTML content.


## Limitations

- The Azure Translator API has rate limits and character quotas. Ensure your Azure account has sufficient quota for your translation needs.
- Very large webpages may require multiple API calls and take longer to translate.
- Some complex HTML structures or dynamically loaded content may not translate perfectly.
