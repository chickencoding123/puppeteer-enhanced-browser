"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoToPage = exports.CloseBrowser = exports.GetBrowser = exports.DEFAULT_TILE_SIZE = exports.DEFALT_WINDOW_HEIGHT = exports.DEFAULT_WINDOW_WIDTH = void 0;
var puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
var puppeteer_extra_plugin_adblocker_1 = __importDefault(require("puppeteer-extra-plugin-adblocker"));
var puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
/**
 * Largest common screen size
 * https://w3codemasters.in/most-common-screen-resolutions/ and https://www.rapidtables.com/web/dev/screen-resolution-statistics.html
 * Also overrides the 800x600 from stealth plugin ATM 10-6-2020
 */
exports.DEFAULT_WINDOW_WIDTH = 1366;
exports.DEFALT_WINDOW_HEIGHT = 768;
exports.DEFAULT_TILE_SIZE = 512;
var browser;
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_adblocker_1.default)({ blockTrackers: true }));
/**
 * Return a new or existing instance of a headless browser
 */
var GetBrowser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var options;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!browser) return [3 /*break*/, 2];
                options = {
                    dumpio: true,
                    devtools: false,
                    headless: true,
                    pipe: true,
                    args: [
                        // https://github.com/puppeteer/puppeteer/issues/661#issuecomment-841587956
                        '--font-render-hinting=none',
                        // https://github.com/puppeteer/puppeteer/issues/5530#issuecomment-605047166
                        '--force-gpu-mem-available-mb=9000',
                        // https://github.com/puppeteer/puppeteer/issues/804
                        "--js-flags=\"--max-old-space-size=9000\"",
                        "--script-delay=30000"
                    ]
                };
                return [4 /*yield*/, puppeteer_extra_1.default.launch(options)];
            case 1:
                browser = _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, browser];
        }
    });
}); };
exports.GetBrowser = GetBrowser;
/**
 * Close the headless browser.
 */
var CloseBrowser = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!browser) return [3 /*break*/, 2];
                return [4 /*yield*/, browser.close()];
            case 1:
                _a.sent();
                browser = undefined;
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.CloseBrowser = CloseBrowser;
/**
 * Navigates to a page and executes a bunch of operations on that page
 * @param url Url of the target page
 * @param opts Navigation and operation options
 * @returns Results array of operation names and results
 */
var GoToPage = function (url, pageOptions) {
    if (pageOptions === void 0) { pageOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, result, opts, _a, _b, _c, snapshotObj, _d, w, h, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, exports.GetBrowser)()];
                case 1:
                    browser = _f.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _f.sent();
                    result = {};
                    opts = __assign({ evaluateArgs: [], snapshots: false, content: false, windowSize: {
                            width: exports.DEFAULT_WINDOW_WIDTH,
                            height: exports.DEFALT_WINDOW_HEIGHT
                        } }, pageOptions);
                    return [4 /*yield*/, page.setViewport({ width: opts.windowSize.width, height: opts.windowSize.height, deviceScaleFactor: 1 })];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle0", timeout: 60000 })];
                case 4:
                    _f.sent();
                    if (!opts.script) return [3 /*break*/, 6];
                    return [4 /*yield*/, page.addScriptTag(opts.script)];
                case 5:
                    _f.sent();
                    _f.label = 6;
                case 6:
                    if (!opts.style) return [3 /*break*/, 8];
                    return [4 /*yield*/, page.addStyleTag(opts.style)];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8:
                    if (!opts.evaluate) return [3 /*break*/, 12];
                    if (!(opts.evaluateArgs && opts.evaluateArgs.length > 0)) return [3 /*break*/, 10];
                    _a = result;
                    return [4 /*yield*/, page.evaluate.apply(page, __spreadArray([opts.evaluate], opts.evaluateArgs, false))];
                case 9:
                    _a.evaluate = _f.sent();
                    return [3 /*break*/, 12];
                case 10:
                    _b = result;
                    return [4 /*yield*/, page.evaluate(opts.evaluate)];
                case 11:
                    _b.evaluate = _f.sent();
                    _f.label = 12;
                case 12:
                    if (!opts.content) return [3 /*break*/, 14];
                    _c = result;
                    return [4 /*yield*/, page.content()];
                case 13:
                    _c.content = _f.sent();
                    _f.label = 14;
                case 14:
                    if (!opts.snapshots) return [3 /*break*/, 17];
                    snapshotObj = opts.snapshots;
                    return [4 /*yield*/, page.evaluate(function () {
                            // apparently browser inconsistency exists and we must take max of various properties for a true size
                            // https://javascript.info/size-and-scroll-window#width-height-of-the-document
                            return [
                                Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth),
                                Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight)
                            ];
                        })];
                case 15:
                    _d = _f.sent(), w = _d[0], h = _d[1];
                    _e = result;
                    return [4 /*yield*/, getScreenshots(page, w, h, __assign(__assign({}, snapshotObj), { tileSize: snapshotObj.tileSize || exports.DEFAULT_TILE_SIZE }))];
                case 16:
                    _e.snapshots = _f.sent();
                    _f.label = 17;
                case 17: return [4 /*yield*/, page.close()];
                case 18:
                    _f.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.GoToPage = GoToPage;
//fraction is distributed equally
var getScreenshots = function (page, width, height, opts) {
    var promises = [];
    var tileW = opts.tileSize;
    var tileH = opts.tileSize;
    var numTilesW = Math.floor(width / tileW);
    var numTilesH = Math.floor(height / tileH);
    var lessThanATileW = width % tileW;
    var lessThanATileH = height % tileH;
    if (lessThanATileW) {
        tileW += lessThanATileW / numTilesW;
    }
    if (lessThanATileH) {
        tileH += lessThanATileH / numTilesH;
    }
    for (var i = 0; i < numTilesH; i++) {
        if (opts.limit && promises.length >= opts.limit)
            break;
        var _loop_1 = function (j) {
            if (opts.limit && promises.length >= opts.limit)
                return "break";
            var bound = {
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
                .then(function (val) {
                return __assign(__assign({}, bound), { value: val.toString('base64') });
            }));
        };
        for (var j = 0; j < numTilesW; j++) {
            var state_1 = _loop_1(j);
            if (state_1 === "break")
                break;
        }
    }
    return Promise.all(promises);
};
