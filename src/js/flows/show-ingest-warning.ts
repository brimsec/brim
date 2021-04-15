import {remote} from "electron"

export default function showIngestWarning(spaces: string[]) {
  return remote.dialog
    .showMessageBox({
      type: "warning",
      title: "Confirm Close Window",
      message: "Are you sure you want to close while ingesting?",
      detail: `This will delete the partial generated data for: ${spaces.join(
        ", "
      )}`,
      buttons: ["OK", "Cancel"]
    })
    .then(({response}) => {
      if (response === 0) return
      else throw new Error("Canceled Unload")
    })
}
