puppeteer-enhanced-browser
======

<div align="center">

Headless puppeteer with additional plugins and settings

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/chickencoding123/puppeteer-enhanced-browser/blob/main/LICENSE) [![npm](https://img.shields.io/npm/v/puppeteer-enhanced-browser)](https://www.npmjs.com/package/puppeteer-enhanced-browser) [![License](https://img.shields.io/npm/l/puppeteer-enhanced-browser)](https://github.com/chickencoding123/puppeteer-enhanced-browser/blob/main/LICENSE)


</div>

## Features
- Ad block and stealth plugins
- Add or remove plugins
- Automatic tiles for page snapshots
- A few puppeteer glitch workarounds

## How to use
```sh
npm i puppeteer-enhanced-browser
# or
yarn add puppeteer-enhanced-browser
```

```js
const browser = require('puppeteer-enhanced-browser')
// or
import { GoToPage, GetBrowser, CloseBrowser } from 'puppeteer-enhanced-browser'
```
You can optionally request evaluation results, page content or snapshots.
```js
// then
GoToPage('https://example.com', { 
  content: true, /* HTML of the page */
  snapshots: true, /* or options for tile size etc... */, 
  evaluate: function () { /* results.evaluate will equal the body width */
    return document.body.clientWidth
  }
})
.then((results) => {
  // TODO
})
// or
const { snapshots, evaluate } = await GoToPage('https://example.com', { 
  content: true, /* HTML of the page */
  snapshots: true, /* or options for tile size etc... */, 
  evaluate: function () { /* evaluate will equal the body width */
    return document.body.clientWidth
  }
})

```
## Evalulation with args passed between your code context and puppeteer's browser context
```js
const { evaluate } = await GoToPage('https://example.com', {
  evaluate: function (a, b) { /* evaluate will equal the body width */
    return a + b
  },
  evaluateArgs: [1, 2]
})
```
## Adjusting the tile size and/or snapshot limits
```js
const { evaluate, snapshots } = await GoToPage('https://example.com', {
  snapshots: {
    tileSize: 1000, /* 1000px wide snapshots */
    limit: 5 /* do not snapshot the entire page, but only 5 snapshots. Depending on the tileSize this will return snapshots from all of or a portion of the page */
  }
});
```
## Script and/or style injections
```js
const { evaluate } = await GoToPage('https://example.com', {
  style: `body { width: 1000px !important; }`,
  script: `window.myObj = { function message () { return 'Hello World!'; } }`
  evaluate: () => {
    return window.myObj.message();
  }
});
console.log(evaluate)
```

## Add/Remove plugins
```js
import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin'
import { AddPlugin, RemovePlugin } from 'puppeteer-enhanced-browser'

class TestPlugin extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'testplugin'
  }
}

// add a new plugin
AddPlugin(new TestPlugin())
// remove the default adblock plugin
RemovePlugin('adblock')
```

## Modify puppeteer launch options
You can setup launch option before calling `GoToPage`, `GetBrowser` or by calling `CloseBrowser` and then executing one of the former functions.
```js
import PuppeteerLaunchOptions from 'puppeteer-enhanced-browser'
PuppeteerLaunchOptions.dumpio = true
```