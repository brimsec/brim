require("regenerator-runtime/runtime")

import initDOM from "../initializers/init-dom"

const Adapter = require("enzyme-adapter-react-16")
const enzyme = require("enzyme")

jest.mock("electron", function() {
  class FakeBrowserWindow {
    webContents: {send: any}

    constructor() {
      this.webContents = {send: jest.fn()}
    }

    center() {}

    setMenu() {}

    on() {
      return this
    }

    loadFile() {}

    setSize() {}

    getSize() {
      return [100, 100]
    }

    getPosition() {
      return [0, 0]
    }

    destroy() {}
  }

  const electron = {
    app: {
      isPackaged: true,
      getName: () => "TestApp",
      getPath: () => "/fake/path",
      getVersion: () => "test-version",
      getAppPath: () => "fake/app/path",
      quit: jest.fn(),
      relaunch: jest.fn()
    },
    getCurrentWebContents: jest.fn(() => ({
      send: jest.fn()
    })),
    Menu: {
      buildFromTemplate: jest.fn(),
      setApplicationMenu: jest.fn()
    },
    BrowserWindow: FakeBrowserWindow,
    ipcMain: {
      on: jest.fn(),
      once: jest.fn(),
      removeAllListeners: jest.fn()
    },
    ipcRenderer: {
      send: jest.fn(),
      on: jest.fn(),
      invoke: () => Promise.resolve()
    },
    screen: {
      getAllDisplays() {
        return [
          {
            id: 459098087,
            bounds: {x: 0, y: 0, width: 1920, height: 1080},
            workArea: {x: 0, y: 23, width: 1920, height: 1057},
            accelerometerSupport: "unknown",
            monochrome: false,
            colorDepth: 24,
            colorSpace:
              "{primaries_d50_referred: [[0.6825, 0.3155],  [0.3001, 0.6589],  [0.1589, 0.0529]], transfer:BT709_APPLE, matrix:RGB, range:FULL}",
            depthPerComponent: 8,
            size: {width: 1920, height: 1080},
            workAreaSize: {width: 1920, height: 1057},
            scaleFactor: 2,
            rotation: 0,
            internal: false,
            touchSupport: "unknown"
          }
        ]
      }
    }
  }

  return {...electron, remote: electron}
})

global.DOMRectReadOnly = class DOMRectReadOnly {}
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.SVGElement.prototype.getTotalLength = () => 0
enzyme.configure({adapter: new Adapter()})
document.execCommand = jest.fn()
initDOM()
