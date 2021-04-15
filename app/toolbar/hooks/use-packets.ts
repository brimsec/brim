import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import useDebouncedEffect from "src/js/components/hooks/use-debounced-effect"
import {downloadPcap} from "src/js/flows/download-pcap"
import Current from "src/js/state/Current"
import LogDetails from "src/js/state/LogDetails"
import {reactElementProps} from "src/js/test/integration"
import {ActionButtonProps} from "../action-button"

export default function usePackets(): ActionButtonProps {
  const dispatch = useDispatch()
  const conn = useSelector(LogDetails.getConnLog)
  const space = useSelector(Current.mustGetSpace)
  const [enabled, setEnabled] = useState(!!conn && space.pcap_support)

  useDebouncedEffect(() => setEnabled(!!conn && space.pcap_support), 100, [
    conn,
    space.pcap_support
  ])

  function getTitle() {
    if (!space.pcap_support) return "This space has no pcap support."
    if (conn) return "Open packets from this connection."
    return "No connection record found."
  }

  return {
    label: "Packets",
    icon: "sharkfin",
    disabled: !enabled,
    title: getTitle(),
    click() {
      if (conn) dispatch(downloadPcap(conn))
    },
    buttonProps: reactElementProps("pcapsButton")
  }
}
