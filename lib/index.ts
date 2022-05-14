import { Browser, Page, SerializableOrJSHandle } from 'puppeteer'
import Puppeteer, { PuppeteerExtraPlugin } from 'puppeteer-extra'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

/**
 * Largest common screen size
 * https://w3codemasters.in/most-common-screen-resolutions/ and https://www.rapidtables.com/web/dev/screen-resolution-statistics.html
 * Also overrides the 800x600 from stealth plugin ATM 10-6-2020
 */
export const DEFAULT_WINDOW_WIDTH = 1366
export const DEFALT_WINDOW_HEIGHT = 768
export const DEFAULT_TILE_SIZE = 512

let browser: Browser | undefined

Puppeteer.use(StealthPlugin())
Puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

/** Puppeteer launch options */
export const PuppeteerLaunchOptions: Required<Parameters<typeof Puppeteer['launch']>>[0] = {
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
    // some websites run scripts for a while, specially AJAX calls
    '--script-delay=30000'
  ]
}

type GoToPageSnapshotOption = {
  tileSize: number
  limit?: number
}

type GoToPageSnapshotResult = {
  x: number
  y: number
  width: number
  height: number
  /* Base64 encoded snapshot */
  value: string
}

type GoToPageOptions = {
  /** Browser window size */
  windowSize?: { width: number, height: number }
  /** Evaluate a script inside the target page */
  evaluate?: (...args: unknown[]) => unknown
  /** Args to pass to the evaluate function */
  evaluateArgs?: SerializableOrJSHandle[]
  /** Take screenshot of the page after navigation. You can control the tile size or rely on default tile size */
  snapshots?: GoToPageSnapshotOption | boolean
  /** Return HTML content of the page */
  content?: boolean
  /** Style to inject into the page, if any */
  style?: Parameters<Page['addStyleTag']>[0]
  /** Script to inject into the page, if any */
  script?: Parameters<Page['addScriptTag']>[0]
}

type GoToPageResult<TEvaluateResult> = {
  evaluate?: TEvaluateResult
  content?: string
  snapshots?: GoToPageSnapshotResult[]
}

/**
 * Return a new or existing instance of a headless browser
 */
export const GetBrowser = async () => {
  if (!browser) {
    browser = await Puppeteer.launch(PuppeteerLaunchOptions)
  }

  return browser
}

/**
 * Close the headless browser.
 */
export const CloseBrowser = async () => {
  if (browser) {
    await browser.close()
    browser = undefined
  }
}

/**
 * Navigates to a page and executes a bunch of operations on that page
 * @param url Url of the target page
 * @param opts Navigation and operation options
 * @returns Results array of operation names and results
 */
export async function GoToPage<TEvaluateResult = unknown>(url: string, pageOptions: GoToPageOptions = {}): Promise<GoToPageResult<TEvaluateResult>> {
  const result: GoToPageResult<TEvaluateResult> = {}
  const opts = {
    evaluateArgs: [],
    snapshots: false,
    content: false,
    windowSize: {
      width: DEFAULT_WINDOW_WIDTH,
      height: DEFALT_WINDOW_HEIGHT
    },
    ...pageOptions
  }

  const browser = await GetBrowser()
  const page = await browser.newPage()

  await page.setViewport({ width: opts.windowSize.width, height: opts.windowSize.height, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })

  if (opts.script) {
    await page.addScriptTag(opts.script)
  }
  if (opts.style) {
    await page.addStyleTag(opts.style)
  }
  if (opts.evaluate) {
    if (opts.evaluateArgs && opts.evaluateArgs.length > 0) {
      result.evaluate = await page.evaluate(opts.evaluate, ...opts.evaluateArgs) as TEvaluateResult
    } else {
      result.evaluate = await page.evaluate(opts.evaluate) as TEvaluateResult
    }
  }
  if (opts.content) {
    result.content = await page.content()
  }
  if (opts.snapshots) {
    const snapshotObj = opts.snapshots as GoToPageSnapshotOption
    // find width/height of document
    const [w, h] = await page.evaluate(() => {
      // apparently browser inconsistency exists and we must take max of various properties for a true size
      // https://javascript.info/size-and-scroll-window#width-height-of-the-document
      return [
        Math.max(
          document.body.scrollWidth, document.documentElement.scrollWidth,
          document.body.offsetWidth, document.documentElement.offsetWidth,
          document.body.clientWidth, document.documentElement.clientWidth
        ),
        Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
        )
      ]
    })
    result.snapshots = await getScreenshots(page, w, h, { ...snapshotObj, tileSize: snapshotObj.tileSize || DEFAULT_TILE_SIZE })
  }

  await page.close()
  return result
}

export const AddPlugin = (plugin: PuppeteerExtraPlugin) => {
  Puppeteer.use(plugin)
}

export const RemovePlugin = (name: string) => {
  const pluginIndex = Puppeteer.plugins.findIndex((p) => p._isPuppeteerExtraPlugin && p.name === name)
  if (~pluginIndex) {
    Puppeteer.plugins.splice(pluginIndex, 1)
  } else {
    throw Error(`puppeteer-enhanced-browser: unable to find a plugin with that name "${name}"`)
  }
}

// fraction is distributed equally
const getScreenshots = (page: Page, width: number, height: number, opts: GoToPageSnapshotOption) => {
  const promises: Promise<GoToPageSnapshotResult>[] = []
  let tileW = opts.tileSize
  let tileH = opts.tileSize
  const numTilesW = Math.floor(width / tileW)
  const numTilesH = Math.floor(height / tileH)
  const lessThanATileW = width % tileW
  const lessThanATileH = height % tileH

  if (lessThanATileW) {
    tileW += lessThanATileW / numTilesW
  }
  if (lessThanATileH) {
    tileH += lessThanATileH / numTilesH
  }

  for (let i = 0; i < numTilesH; i++) {
    if (opts.limit && promises.length >= opts.limit) break

    for (let j = 0; j < numTilesW; j++) {
      if (opts.limit && promises.length >= opts.limit) break

      const bound = {
        x: tileW * j,
        y: tileH * i,
        width: tileW,
        height: tileH
      }

      promises.push(
        page.screenshot({
          type: 'jpeg',
          fullPage: false,
          quality: 25,
          captureBeyondViewport: true,
          clip: bound
        })
          .then((val) => {
            return {
              ...bound,
              value: (val as Buffer).toString('base64')
            } as GoToPageSnapshotResult
          }))
    }
  }

  return Promise.all(promises)
}
