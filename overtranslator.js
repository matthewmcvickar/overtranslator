'use strict';

/*
 * Dependencies.
 */
const _ = require('lodash')
const request = require('request');

/*

📖 OVERTRANSLATOR 😬

This script uses the Yandex Translate API (https://tech.yandex.com/translate/),
which requires a free API key to run. You will not be able to run this script
without an API key.

## Instructions

1. Install the dependencies for this script. Open the directory for this repo
   in your terminal and run the following command:

      npm install

2. Sign up for a free Yandex account and register a free API key:
   https://translate.yandex.com/developers/keys

3. Rename the `config-example.js` file in this repo to `config.js` and paste
   your API key into it.

4. Change the text in the `text_to_translate` block below to what you'd like to
   translate.

5. Back in your terminal, run the following command:

      node overtranslator.js

*/


/*
 * Settings.
 */
// Input text is English. For other two-letter langauge codes, see:
// https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#languages
const starting_language_code = 'en';
const starting_language_name = 'English';

// By default, the script input is marked as plain text. Change this to `html`
// if your `text_to_translate` is HTML code.
const text_format = 'plain';

// The text you want to overtranslate.
const text_to_translate = `

A story about words that change into other words and about words that change meaning when they stay the same.

`;


/******************************************************************************/


/*
 * Load configuration.
 */
const yandex_api_key = require('./config.js').yandex_api_key;


/*
 * Run when this script is run.
 */
overTranslate(text_to_translate);


/*
 * The functions.
 */

// Overtranslate.
function overTranslate(text) {
  var text = text.trim();

  console.log('\nLET’S OVERTRANSLATE THIS:\n', text);

  chooseLanguages().then(function (languages) {
    doTranslations(text, languages);
  });
}

// Get the full list of languages Yandex supports and pick ten of them.
function chooseLanguages() {
  var url = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?'  +
            'key=' + yandex_api_key +
            '&ui=en';

  return new Promise (function (resolve) {
    request(url, function(error, response, body) {
      if (error) {
        console.log('\nERROR:\n', error);
      }

      else if (body === '') {
        resolve(undefined);
      }

      else {
        var availableLanguages = JSON.parse(body);
        var languages = availableLanguages.langs;

        // Mutate the array from being a collection where the language codes are
        // the keys and the langauge names are the values to an array of arrays
        // that can be properly shuffled and then referred to by array indexes.
        //   languages: {
        //     sv: 'Swedish',
        //     ne: 'Nepali',
        //     si: 'Sinhalese'
        //     [...]
        //
        // We get:
        //   languages: [
        //     [ 'sv', 'Swedish' ],
        //     [ 'ne', 'Nepali' ],
        //     [ 'si', 'Sinhalese' ],
        //     [...]
        //
        languages = _.toPairs(languages);

        // Remove the starting language and some languages that seem to have
        // trouble with punctuation and break the translation chain.
        languages = _.filter(languages, function(lang) {
          return lang[1] !== starting_language_name
              && lang[1] !== 'Amharic'
              && lang[1] !== 'Burmese'
              && lang[1] !== 'Hill Mari'
              && lang[1] !== 'Malagasy'
              && lang[1] !== 'Swahili';
        })

        // Just take ten of the languages.
        var languages = _.sampleSize(languages, 10);

        console.log('\nRANDOMLY CHOSEN LANGUAGE CHAIN:\n', languages);

        resolve(languages);
      }
    });
  });
}

// Do the translations.
function doTranslations(text, languages) {
  var baseURL = 'https://translate.yandex.net/api/v1.5/tr.json/translate?' +
                'key=' + yandex_api_key +
                '&format=' + text_format;

  var urls = [
    baseURL + '&lang=' + starting_language_code + '-' + languages[0][0],
    baseURL + '&lang=' + languages[0][0] + '-' + languages[1][0],
    baseURL + '&lang=' + languages[1][0] + '-' + languages[2][0],
    baseURL + '&lang=' + languages[2][0] + '-' + languages[3][0],
    baseURL + '&lang=' + languages[3][0] + '-' + languages[4][0],
    baseURL + '&lang=' + languages[4][0] + '-' + languages[5][0],
    baseURL + '&lang=' + languages[5][0] + '-' + languages[6][0],
    baseURL + '&lang=' + languages[6][0] + '-' + languages[7][0],
    baseURL + '&lang=' + languages[7][0] + '-' + languages[8][0],
    baseURL + '&lang=' + languages[8][0] + '-' + languages[9][0],
    baseURL + '&lang=' + languages[9][0] + '-' + starting_language_code
  ];

  doATranslation(text, urls[0], starting_language_name, languages[0][1])
  .then( textTranslated1  => doATranslation(textTranslated1,  urls[1],  languages[0][1], languages[1][1]        ) )
  .then( textTranslated2  => doATranslation(textTranslated2,  urls[2],  languages[1][1], languages[2][1]        ) )
  .then( textTranslated3  => doATranslation(textTranslated3,  urls[3],  languages[2][1], languages[3][1]        ) )
  .then( textTranslated4  => doATranslation(textTranslated4,  urls[4],  languages[3][1], languages[4][1]        ) )
  .then( textTranslated5  => doATranslation(textTranslated5,  urls[5],  languages[4][1], languages[5][1]        ) )
  .then( textTranslated6  => doATranslation(textTranslated6,  urls[6],  languages[5][1], languages[6][1]        ) )
  .then( textTranslated7  => doATranslation(textTranslated7,  urls[7],  languages[6][1], languages[7][1]        ) )
  .then( textTranslated8  => doATranslation(textTranslated8,  urls[8],  languages[7][1], languages[8][1]        ) )
  .then( textTranslated9  => doATranslation(textTranslated9,  urls[9],  languages[8][1], languages[9][1]        ) )
  .then( textTranslated10 => doATranslation(textTranslated10, urls[10], languages[9][1], starting_language_name ) )
  .then( finalTranslation => {
    console.log('\nFINAL OUTPUT:\n', finalTranslation, '\n');
  })
  .catch(failureCallback);
}

function doATranslation(text, url, from_language_name, to_language_name) {
  var requestURL = encodeURI( url + '&text=' + text );

  // DEBUG:
  // console.log('\nREQUEST URL:\n', requestURL);

  return new Promise (function (resolve) {
    request(requestURL, function(error, response, body) {
      if (error) {
        console.log('\nERROR:\n', error);
      }

      else if (body === '') {
        resolve(undefined);
      }

      else {
        var result = JSON.parse(body);
        var translatedText = result.text[0];

        console.log('\nTRANSLATED FROM ' + _.upperCase(from_language_name) + ' TO ' + _.upperCase(to_language_name) + ':\n', translatedText);

        resolve(translatedText);
      }
    });
  });
}

function failureCallback(error) {
  console.log('\nERROR:\n', error);
}
