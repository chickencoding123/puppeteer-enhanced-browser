import PuppeteerExtraClass, { PuppeteerExtra } from 'puppeteer-extra'
import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin'
import { AddPlugin, CloseBrowser, GetBrowser, PuppeteerLaunchOptions, RemovePlugin } from './index'

jest.setTimeout(30000)
jest.mock('puppeteer-extra', () => {
  const fake = {
    use: jest.fn((args) => {
      fake.plugins.push(args)
      return fake
    }),
    launch: jest.fn(),
    plugins: []
  }

  return fake
})

const puppeteerMock = PuppeteerExtraClass as jest.MockedObject<PuppeteerExtra>

class Test1 extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'test1'
  }
}
class Test2 extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'test2'
  }
}

afterAll(async () => {
  jest.clearAllMocks()
  await CloseBrowser()
})

describe('config tests', () => {
  it('can properly merge puppeteer launch options', async () => {
    PuppeteerLaunchOptions.args = undefined
    PuppeteerLaunchOptions.devtools = true
    PuppeteerLaunchOptions.pipe = false

    await GetBrowser()

    expect(puppeteerMock.launch.mock.calls.length).toBe(1)
    expect(puppeteerMock.launch.mock.calls[0][0]).toEqual({
      args: undefined,
      devtools: true,
      dumpio: false,
      headless: true,
      pipe: false
    })
  })

  it('can add and remove plugins', async () => {
    PuppeteerLaunchOptions.args = undefined
    PuppeteerLaunchOptions.devtools = true
    PuppeteerLaunchOptions.pipe = false

    AddPlugin(new Test1())
    AddPlugin(new Test2())

    // two defaults plus two test inserts
    expect(puppeteerMock.plugins.length).toBe(4)
    expect(puppeteerMock.use.mock.calls.length).toBe(4)

    RemovePlugin('test1')
    RemovePlugin('test2')

    expect(puppeteerMock.plugins.length).toBe(2)
  })

  it('can remove a default plugin', () => {
    RemovePlugin('adblocker')
    expect(puppeteerMock.plugins.length).toBe(1)
  })
})
