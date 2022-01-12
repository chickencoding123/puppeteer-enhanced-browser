var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
/**
 * Largest common screen size
 * https://w3codemasters.in/most-common-screen-resolutions/ and https://www.rapidtables.com/web/dev/screen-resolution-statistics.html
 * Also overrides the 800x600 from stealth plugin ATM 10-6-2020
 */
export const DEFAULT_WINDOW_WIDTH = 1366;
export const DEFALT_WINDOW_HEIGHT = 768;
export const DEFAULT_TILE_SIZE = 512;
let browser;
Puppeteer.use(StealthPlugin());
Puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
/** Puppeteer launch options */
export const PuppeteerLaunchOptions = {
    dumpio: false,
    devtools: false,
    headless: true,
    pipe: true,
    args: [
        // https://github.com/puppeteer/puppeteer/issues/661#issuecomment-841587956
        '--font-render-hinting=none',
        // https://github.com/puppeteer/puppeteer/issues/5530#issuecomment-605047166
        '--force-gpu-mem-available-mb=9000',
        // https://github.com/puppeteer/puppeteer/issues/804
        '--js-flags="--max-old-space-size=9000"',
        '--script-delay=30000'
    ]
};
/**
 * Return a new or existing instance of a headless browser
 */
export const GetBrowser = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!browser) {
        browser = yield Puppeteer.launch(PuppeteerLaunchOptions);
    }
    return browser;
});
/**
 * Close the headless browser.
 */
export const CloseBrowser = () => __awaiter(void 0, void 0, void 0, function* () {
    if (browser) {
        yield browser.close();
        browser = undefined;
    }
});
/**
 * Navigates to a page and executes a bunch of operations on that page
 * @param url Url of the target page
 * @param opts Navigation and operation options
 * @returns Results array of operation names and results
 */
export function GoToPage(url, pageOptions = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {};
        const opts = Object.assign({ evaluateArgs: [], snapshots: false, content: false, windowSize: {
                width: DEFAULT_WINDOW_WIDTH,
                height: DEFALT_WINDOW_HEIGHT
            } }, pageOptions);
        const browser = yield GetBrowser();
        const page = yield browser.newPage();
        yield page.setViewport({ width: opts.windowSize.width, height: opts.windowSize.height, deviceScaleFactor: 1 });
        yield page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
        if (opts.script) {
            yield page.addScriptTag(opts.script);
        }
        if (opts.style) {
            yield page.addStyleTag(opts.style);
        }
        if (opts.evaluate) {
            if (opts.evaluateArgs && opts.evaluateArgs.length > 0) {
                result.evaluate = (yield page.evaluate(opts.evaluate, ...opts.evaluateArgs));
            }
            else {
                result.evaluate = (yield page.evaluate(opts.evaluate));
            }
        }
        if (opts.content) {
            result.content = yield page.content();
        }
        if (opts.snapshots) {
            const snapshotObj = opts.snapshots;
            // find width/height of document
            const [w, h] = yield page.evaluate(() => {
                // apparently browser inconsistency exists and we must take max of various properties for a true size
                // https://javascript.info/size-and-scroll-window#width-height-of-the-document
                return [
                    Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth),
                    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight)
                ];
            });
            result.snapshots = yield getScreenshots(page, w, h, Object.assign(Object.assign({}, snapshotObj), { tileSize: snapshotObj.tileSize || DEFAULT_TILE_SIZE }));
        }
        yield page.close();
        return result;
    });
}
export const AddPlugin = (plugin) => {
    Puppeteer.use(plugin);
};
export const RemovePlugin = (name) => {
    const pluginIndex = Puppeteer.plugins.findIndex((p) => p._isPuppeteerExtraPlugin && p.name === name);
    if (~pluginIndex) {
        Puppeteer.plugins.splice(pluginIndex, 1);
    }
    else {
        throw Error(`puppeteer-enhanced-browser: unable to find a plugin with that name "${name}"`);
    }
};
// fraction is distributed equally
const getScreenshots = (page, width, height, opts) => {
    const promises = [];
    let tileW = opts.tileSize;
    let tileH = opts.tileSize;
    const numTilesW = Math.floor(width / tileW);
    const numTilesH = Math.floor(height / tileH);
    const lessThanATileW = width % tileW;
    const lessThanATileH = height % tileH;
    if (lessThanATileW) {
        tileW += lessThanATileW / numTilesW;
    }
    if (lessThanATileH) {
        tileH += lessThanATileH / numTilesH;
    }
    for (let i = 0; i < numTilesH; i++) {
        if (opts.limit && promises.length >= opts.limit)
            break;
        for (let j = 0; j < numTilesW; j++) {
            if (opts.limit && promises.length >= opts.limit)
                break;
            const bound = {
                x: tileW * j,
                y: tileH * i,
                width: tileW,
                height: tileH
            };
            promises.push(page.screenshot({
                type: 'jpeg',
                fullPage: false,
                quality: 25,
                captureBeyondViewport: true,
                clip: bound
            })
                .then((val) => {
                return Object.assign(Object.assign({}, bound), { value: val.toString('base64') });
            }));
        }
    }
    return Promise.all(promises);
};
