import React, {useCallback, useState} from "react"

import {reactElementProps} from "../../test/integration"
import DataDirInput from "./data-dir-input"
import FormErrors from "./form-errors"
import JSONTypeConfig from "./json-type-config"
import ModalBox from "../ModalBox/modal-box"
import TextContent from "../text-content"
import TimeFormat from "./time-format"
import Timezone from "./Timezone"
import SuricataRunner from "./suricata-runner"
import SuricataUpdater from "./suricata-updater"
import ZeekRunner from "./zeek-runner"
import brim from "../../brim"
import useCallbackRef from "../hooks/use-callback-ref"
import usePreferencesForm from "./use-preferences-form"

export default function Preferences() {
  const [f, setForm] = useCallbackRef<HTMLFormElement>()
  const [errors, setErrors] = useState([])
  const prefsForm = usePreferencesForm()

  const onClose = () => setErrors([])

  const onSubmit = useCallback(
    async (closeModal) => {
      if (!f) return
      const form = brim.form(f, prefsForm)

      if (await form.isValid()) {
        setErrors([])
        form.submit()
        closeModal()
      } else {
        setErrors(form.getErrors())
      }
    },
    [f, prefsForm]
  )

  return (
    <ModalBox
      onClose={onClose}
      name="settings"
      title="Preferences"
      buttons={[{label: "OK", click: onSubmit}]}
      className="settings-modal"
      {...reactElementProps("settingsModal")}
    >
      <TextContent>
        <FormErrors errors={errors} />
        <form ref={setForm} className="settings-form">
          <Timezone config={prefsForm.timeZone} />
          <TimeFormat config={prefsForm.timeFormat} />
          <SuricataRunner config={prefsForm.suricataRunner} />
          <SuricataUpdater config={prefsForm.suricataUpdater} />
          <ZeekRunner config={prefsForm.zeekRunner} />
          <JSONTypeConfig config={prefsForm.jsonTypeConfig} />
          <DataDirInput config={prefsForm.dataDir} />
        </form>
      </TextContent>
    </ModalBox>
  )
}
