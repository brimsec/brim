import electronIsDev from "./is-dev"
import path from "path"

export default function(app: any) {
  if (app.setUserTasks) {
    app.setUserTasks([
      {
        program: process.execPath,
        arguments: getArguments("--new-window"),
        iconPath: process.execPath,
        iconIndex: 0,
        title: "New Window",
        description: "Create a new window"
      },
      {
        program: process.execPath,
        arguments: getArguments("--move-to-current-display"),
        iconPath: process.execPath,
        iconIndex: 0,
        title: "Move Brim to Current Display",
        description: "Move Brim windows to the current display"
      }
    ])
  }
}

function getArguments(arg) {
  if (electronIsDev) {
    // This is not exactly reliable. Each time the directory changes, this will change.
    // Thankfully, it's only run in dev mode.
    const appRoot = path.join(__dirname, "..", "..", "..", "..")
    return [appRoot, arg].join(" ")
  } else {
    return arg
  }
}
