/* @noflow */

import {app, dialog, shell, MenuItemConstructorOptions} from "electron"
import path from "path"

import electronIsDev from "../is-dev"
import formatSessionState from "../tron/format-session-state"
import {Brim} from "../brim"

export default function(
  send: Function,
  brim: Brim,
  platform: string = process.platform
): MenuItemConstructorOptions[] {
  const mac = platform === "darwin"
  const __: MenuItemConstructorOptions = {type: "separator"}

  const newWindow: MenuItemConstructorOptions = {
    label: "New Window",
    accelerator: "CmdOrCtrl+N",
    click: () => brim.windows.openWindow("search", {})
  }

  const exit: MenuItemConstructorOptions = {
    label: "Exit",
    click: () => app.quit()
  }

  const aboutBrim: MenuItemConstructorOptions = {
    label: "About Brim",
    click() {
      brim.windows.openAbout()
    }
  }

  const closeWindow: MenuItemConstructorOptions = {
    label: "Close Window",
    click: () => brim.windows.closeWindow()
  }

  const closeTab: MenuItemConstructorOptions = {
    label: "Close Tab",
    click: () => send("closeTab")
  }

  const preferences: MenuItemConstructorOptions = {
    id: "preferences",
    label: platform === "darwin" ? "Preferences..." : "Settings",
    click: () => brim.windows.openPreferences()
  }

  const resetState: MenuItemConstructorOptions = {
    label: "Reset State",
    click: async () => {
      const {response} = await dialog.showMessageBox({
        message: "Are you sure?",
        detail: "This will reset local app state, but retain workspace data.",
        buttons: ["OK", "Cancel"]
      })
      if (response === 0) await brim.resetState()
    }
  }

  const exportResults: MenuItemConstructorOptions = {
    label: "Export Results As...",
    click: () => send("showExportResults")
  }

  const brimMenu: MenuItemConstructorOptions = {
    label: "Brim",
    submenu: [
      aboutBrim,
      __,
      preferences,
      {role: "services", submenu: []},
      __,
      {role: "hide"},
      {role: "hideOthers"},
      {role: "unhide"},
      __,
      {role: "quit"}
    ]
  }

  function fileSubmenu(): MenuItemConstructorOptions[] {
    if (mac) {
      return [newWindow, __, exportResults, __, closeTab, closeWindow]
    } else {
      return [
        newWindow,
        __,
        exportResults,
        __,
        preferences,
        __,
        closeTab,
        closeWindow,
        exit
      ]
    }
  }

  function editSubmenu(): MenuItemConstructorOptions[] {
    const submenu: MenuItemConstructorOptions[] = [
      {role: "undo"},
      {role: "redo"},
      __,
      {role: "cut"},
      {role: "copy"},
      {role: "paste"},
      {role: "pasteAndMatchStyle"},
      {role: "delete"},
      {role: "selectAll"}
    ]
    if (mac) {
      submenu.push(__, {
        label: "Speech",
        submenu: [{role: "startSpeaking"}, {role: "stopSpeaking"}]
      })
    }
    return submenu
  }

  function windowSubmenu(): MenuItemConstructorOptions[] {
    const submenu = [
      {role: "minimize"} as MenuItemConstructorOptions,
      resetState
    ]
    if (mac) {
      submenu.push({role: "close"}, {role: "minimize"}, {role: "zoom"}, __, {
        role: "front"
      })
    }
    return submenu
  }

  function querySubmenu() {
    return [
      {
        label: "Pin Search",
        accelerator: "CmdOrCtrl+K",
        click: () => send("pinSearch")
      },
      {
        label: "Clear Pins",
        accelerator: "CmdOrCtrl+Shift+K",
        click: () => send("clearPins")
      },
      {
        label: "Focus Search Bar",
        accelerator: "CmdOrCtrl+L",
        click: () => send("focusSearchBar")
      },
      __,
      {
        label: "Back",
        accelerator: "CmdOrCtrl+Left",
        click: () => send("back")
      },
      {
        label: "Forward",
        accelerator: "CmdOrCtrl+Right",
        click: () => send("forward")
      }
    ]
  }

  function viewSubmenu(): MenuItemConstructorOptions[] {
    return [
      {role: "reload"},
      {role: "forceReload"},
      {role: "toggleDevTools"},
      __,
      {role: "resetZoom"},
      {role: "zoomIn"},
      {role: "zoomOut"},
      __,
      {
        label: "Toggle Left Pane",
        accelerator: "CmdOrCtrl+[",
        click: () => send("toggleLeftSidebar")
      },
      {
        label: "Toggle Right Pane",
        accelerator: "CmdOrCtrl+]",
        click: () => send("toggleRightSidebar")
      },
      __,
      {role: "togglefullscreen"}
    ]
  }

  function helpSubmenu() {
    const submenu: MenuItemConstructorOptions[] = [
      {
        label: "ZQL Syntax Docs",
        click() {
          shell.openExternal(
            "https://github.com/brimdata/zed/tree/main/docs/language"
          )
        }
      },
      {
        label: "Slack Support Channel",
        click() {
          shell.openExternal("https://www.brimsecurity.com/join-slack/")
        }
      },
      {
        label: "Github Repository",
        click() {
          shell.openExternal("https://github.com/brimdata/brim")
        }
      },
      {
        label: "Submit Issue...",
        click() {
          shell.openExternal(
            "https://github.com/brimdata/brim/wiki/Troubleshooting#opening-an-issue"
          )
        }
      }
    ]

    if (!mac) {
      submenu.push(__, aboutBrim)
    }
    return submenu
  }

  const developerMenu = {
    label: "Developer",
    submenu: [
      {
        label: "Save Session Now",
        async click() {
          await brim.saveSession()
        }
      },
      {
        label: "Save Session for Testing Migrations",
        async click() {
          const root = app.getAppPath()
          const version = brim.session.getVersion()
          const file = path.join(root, `src/js/test/states/${version}.json`)
          const data = formatSessionState(
            await brim.windows.serialize(),
            brim.store.getState()
          )
          await brim.session.save(data, file)
          dialog.showMessageBox({
            message: `Session has been saved`,
            detail: file
          })
        }
      }
    ]
  }

  const template: MenuItemConstructorOptions[] = [
    {label: "File", submenu: fileSubmenu()},
    {label: "Edit", submenu: editSubmenu()},
    {label: "Query", submenu: querySubmenu()},
    {label: "View", submenu: viewSubmenu()},
    {role: "window", submenu: windowSubmenu()},
    {role: "help", submenu: helpSubmenu()}
  ]
  if (mac) template.unshift(brimMenu)
  if (electronIsDev) template.push(developerMenu)
  return template
}
