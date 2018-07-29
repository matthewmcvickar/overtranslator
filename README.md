# Overtranslator

A Node.js script that sends a text string to the [Yandex Translate API](https://tech.yandex.com/translate/) and translates it through a chain of languages randomly selected from the [languages Yandex supports](https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#languages).


## About

This script was started in November 2015 as a proof of concept for a Twitter bot, but I couldn't figure out what source text to feed it, so I stopped working on it. It sat dormant until the folks at [Popula](https://popula.com) mentioned they were going to run [a piece on machine translation](https://popula.com/2018/07/29/machine-translation/) and I mentioned having written this script. They came up with the idea of running the entirety of that article through my script, and I loved the idea, so I agreed and finished up this script.

The original article, by Giovanni Tiso: **[Machine Translation](https://popula.com/2018/07/29/machine-translation/)**

And my overtranslation: **[Machine Translation of 'Machine Translation'](https://popula.com/2018/07/29/machine-translation-of-machine-translation/)**


## Instructions

If you're interested in running this script yourself, here are some basic instructions for getting it running. Because I'm short on time right now, these are not as complete as I'd like. Please [open a new issue](https://github.com/matthewmcvickar/overtranslator/issues/new) on this repo or [email me](mailto:matthew@matthewmcvickar.com) if you have any trouble.

1. [Install Node.js](https://nodejs.org/en/download/).

1. Download or clone this repo.

    ```sh
    git clone git@github.com:matthewmcvickar/overtranslator.git
    ```

1. Install the dependencies for this script. Open the directory for this repo
   in your terminal and run the following command:

    ```sh
    npm install
    ```

1. Sign up for a free Yandex account and register a free API key:
   https://translate.yandex.com/developers/keys

1. Rename the `config-example.js` file in this repo to `config.js` and paste
   your API key into it].

1. Open the `overtranslator.js` file and change the text in the `const text_to_translate = [...]` block to what you'd like to translate. If you are translating from a language other than English, change the `starting_language_code` and `starting_language_name` variables too.

1. Back in your terminal, run the following command:

    ```sh
    node overtranslator.js
    ```
