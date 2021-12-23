import { Browser, Page } from "puppeteer";
/**
 * Largest common screen size
 * https://w3codemasters.in/most-common-screen-resolutions/ and https://www.rapidtables.com/web/dev/screen-resolution-statistics.html
 * Also overrides the 800x600 from stealth plugin ATM 10-6-2020
 */
export declare const DEFAULT_WINDOW_WIDTH = 1366;
export declare const DEFALT_WINDOW_HEIGHT = 768;
export declare const DEFAULT_TILE_SIZE = 512;
declare type GoToPageSnapshotOption = {
    tileSize: number;
    limit?: number;
};
declare type GoToPageSnapshotResult = {
    x: number;
    y: number;
    width: number;
    height: number;
    value: string;
};
declare type GoToPageOptions = {
    /** Browser window size */
    windowSize?: {
        width: number;
        height: number;
    };
    /** Evaluate a script inside the target page */
    evaluate?: (...args: any[]) => any;
    /** Args to pass to the evaluate function */
    evaluateArgs?: any[];
    /** Take screenshot of the page after navigation. You can control the tile size or rely on default tile size */
    snapshots?: GoToPageSnapshotOption | boolean;
    /** Return HTML content of the page */
    content?: boolean;
    /** Style to inject into the page, if any */
    style?: Parameters<Page['addStyleTag']>[0];
    /** Script to inject into the page, if any */
    script?: Parameters<Page['addScriptTag']>[0];
};
declare type GoToPageResult<TEvaluateResult = any> = {
    evaluate?: TEvaluateResult;
    content?: string;
    snapshots?: GoToPageSnapshotResult[];
};
/**
 * Return a new or existing instance of a headless browser
 */
export declare const GetBrowser: () => Promise<Browser>;
/**
 * Close the headless browser.
 */
export declare const CloseBrowser: () => Promise<void>;
/**
 * Navigates to a page and executes a bunch of operations on that page
 * @param url Url of the target page
 * @param opts Navigation and operation options
 * @returns Results array of operation names and results
 */
export declare const GoToPage: <TEvaluateResult = any>(url: string, pageOptions?: GoToPageOptions) => Promise<GoToPageResult<TEvaluateResult>>;
export {};
