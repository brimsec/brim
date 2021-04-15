import logsIngest from "./logs-ingest"
import pcapIngest from "./pcap-ingest"

export default {
  pcapIngest,
  logsIngest,
  spaceDeleted: (id: string) => ({
    type: "SpaceDeletedError",
    message: `The space previously on this tab has been deleted.`,
    details: [`id: ${id}`]
  }),
  importInterrupt: () => ({
    type: "ImportInterruptError",
    message: "The import was interrupted.",
    details: ["To prevent this, keep your computer awake during the import."]
  })
}
