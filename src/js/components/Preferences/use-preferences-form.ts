import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"

import {FormConfig, FormCheckResult} from "../../brim/form"
import Prefs from "../../state/Prefs"
import View from "../../state/View"
import lib from "../../lib"

export default function usePreferencesForm(): FormConfig {
  const dispatch = useDispatch()
  return {
    timeZone: {
      name: "timeZone",
      label: "Timezone",
      defaultValue: useSelector(View.getTimeZone),
      submit: (value) => dispatch(View.setTimeZone(value)),
      check: (value) => [!isEmpty(value), "must not be blank"]
    },
    timeFormat: {
      name: "timeFormat",
      label: "Time Format",
      defaultValue: useSelector(Prefs.getTimeFormat),
      submit: (value) => dispatch(Prefs.setTimeFormat(value))
    },
    suricataRunner: {
      name: "suricataRunner",
      label: "Suricata Runner",
      defaultValue: useSelector(Prefs.getSuricataRunner),
      submit: (value) => dispatch(Prefs.setSuricataRunner(value)),
      check: (path) => {
        if (path === "") return [true, ""]
        return lib
          .file(path)
          .exists()
          .then((exists) => [exists, "file does not exist."])
      }
    },
    suricataUpdater: {
      name: "suricataUpdater",
      label: "Suricata Updater",
      defaultValue: useSelector(Prefs.getSuricataUpdater),
      submit: (value) => dispatch(Prefs.setSuricataUpdater(value)),
      check: (path) => {
        if (path === "") return [true, ""]
        return lib
          .file(path)
          .exists()
          .then((exists) => [exists, "file does not exist."])
      }
    },
    zeekRunner: {
      name: "zeekRunner",
      label: "Zeek Runner",
      defaultValue: useSelector(Prefs.getZeekRunner),
      submit: (value) => dispatch(Prefs.setZeekRunner(value)),
      check: (path) => {
        if (path === "") return [true, ""]
        return lib
          .file(path)
          .exists()
          .then((exists) => [exists, "file does not exist."])
      }
    },
    jsonTypeConfig: {
      name: "jsonTypeConfig",
      label: "JSON Type Config",
      defaultValue: useSelector(Prefs.getJSONTypeConfig),
      submit: (value) => dispatch(Prefs.setJSONTypeConfig(value)),
      check: (path) => {
        if (path === "") return [true, ""]
        return lib
          .file(path)
          .read()
          .then((text) => JSON.parse(text))
          .then((): FormCheckResult => [true, ""])
          .catch((e) => {
            const msg = e.name + ": " + e.message
            if (/SyntaxError/.test(msg)) {
              return [false, "file does not contain valid JSON."]
            } else if (/ENOENT/.test(msg)) {
              return [false, "file does not exist."]
            } else {
              return [false, msg]
            }
          })
      }
    },
    dataDir: {
      name: "dataDir",
      label: "Data Directory",
      defaultValue: useSelector(Prefs.getDataDir),
      submit: (value) => dispatch(Prefs.setDataDir(value)),
      check: (path) => {
        if (path === "") return [true, ""]
        return lib
          .file(path)
          .isDirectory()
          .then((isDir) => [isDir, "Selection must be a directory"])
          .catch((e) => {
            const msg = e.name + ": " + e.message
            return /ENOENT/.test(msg)
              ? [false, "Directory does not exist."]
              : [false, msg]
          })
      }
    }
  }
}
