// import PuppeteerExtra, { PuppeteerExtraPlugin } from 'puppeteer-extra'
// import { AddPlugin, CloseBrowser, GetBrowser, PuppeteerLaunchOptions, RemovePlugin } from './index'

// const fake = {
//   use: jest.fn((args) => {
//     fake.plugins.push(args)
//     return fake
//   }),
//   launch: jest.fn(),
//   plugins: []
// }
// const puppeteerMock = jest.mock('puppeteer-extra', fake)

// class Test1 implements PuppeteerExtraPlugin {
//   [propName: string]: any
//   _isPuppeteerExtraPlugin: boolean

//   constructor() {
//     this.name = 'test1'
//     this._isPuppeteerExtraPlugin = true
//   }
// }
// class Test2 implements PuppeteerExtraPlugin {
//   [propName: string]: any
//   _isPuppeteerExtraPlugin: boolean

//   constructor() {
//     this.name = 'test2'
//     this._isPuppeteerExtraPlugin = true
//   }
// }

// jest.setTimeout(30000)

// afterAll(async () => {
//   await CloseBrowser()
// })

// describe.only('unit tests', () => {
//   describe('config tests', () => {
//     it('can properly merge puppeteer launch options', async () => {
//       PuppeteerLaunchOptions.args = undefined
//       PuppeteerLaunchOptions.devtools = true
//       PuppeteerLaunchOptions.pipe = false

//       await GetBrowser()

//       expect((PuppeteerExtra.launch as any).mock.calls.length).toBe(1)
//       expect((PuppeteerExtra.launch as any).mock.calls[0][0]).toEqual({
//         args: undefined,
//         devtools: true,
//         dumpio: true,
//         headless: true,
//         pipe: false
//       })
//     })

//     it('can add and remove plugins', async () => {
//       jest.mock('puppeteer-extra')
//       const useMock = PuppeteerExtra.use as jest.Mock

//       PuppeteerLaunchOptions.args = undefined
//       PuppeteerLaunchOptions.devtools = true
//       PuppeteerLaunchOptions.pipe = false

//       AddPlugin(new Test1())
//       AddPlugin(new Test2())

//       // two defaults plus two test inserts
//       expect(PuppeteerExtra.plugins.length).toBe(4)
//       expect(useMock.mock.calls.length).toBe(4)

//       RemovePlugin('test1')
//       RemovePlugin('test2')

//       expect(PuppeteerExtra.plugins.length).toBe(2)
//     })
//   })
// })
