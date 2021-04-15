import getTestState from "src/js/test/helpers/get-test-state"
import {migrate} from "src/js/test/helpers/migrate"
import moveQueriesStateToGlobal from "./202101201109_move-queries-state-to-global"

test("when there are no windows", () => {
  const {data} = getTestState("v0.22.0")
  data.windows = {}
  data.order = []
  const next = moveQueriesStateToGlobal(data)
  expect(next.globalState.queries).toBe(undefined)
})

test("migrating 202101201109_moveQueriesStateToGlobal", async () => {
  const next = await migrate({state: "v0.22.0", to: "202101201109"})

  // default/initial brim queries
  const expectedQueries = {
    id: "root",
    name: "root",
    items: [
      {
        id: "1",
        name: "Activity Overview",
        value: "count() by _path | sort -r",
        description:
          "This query shows a list of all Zeek streams in the data set, with a count of associated records",
        tags: ["zeek", "initial exploration"]
      },
      {
        id: "2",
        name: "Unique DNS Queries",
        value: "_path=dns | count() by query | sort -r",
        description:
          "Shows all unique DNS queries contained in the data set with count",
        tags: ["dns", "initial exploration"]
      },
      {
        id: "3",
        name: "Windows Networking Activity",
        value: "_path=~smb* OR _path=dce_rpc",
        description:
          "Filters and displays smb_files, smb_mapping and DCE_RPC activity",
        tags: ["windows", "smb", "malware"]
      },
      {
        id: "4",
        name: "HTTP Requests",
        value:
          "_path=http | cut id.orig_h, id.resp_h, id.resp_p, method,host, uri | uniq -c",
        description:
          "Displays a list of the count unique HTTP requests including source and destination",
        tags: ["http", "initial exploration", "malware"]
      },
      {
        id: "5",
        name: "Unique Network Connections",
        value: "_path=conn | cut id.orig_h, id.resp_p, id.resp_h | sort | uniq",
        description:
          "Displays a table showing all unique source:port:destination connections pairings",
        tags: ["network", "initial exploration"]
      },
      {
        id: "6",
        name: "Connection Received Data",
        value:
          "_path=conn | put total_bytes = orig_bytes + resp_bytes | sort -r total_bytes | cut uid, id, orig_bytes, resp_bytes, total_bytes",
        description:
          "Shows the connections between hosts, sorted by data received",
        tags: ["network"]
      },
      {
        id: "7",
        name: "File Activity",
        value:
          "filename!=null | cut _path, tx_hosts, rx_hosts, conn_uids, mime_type, filename, md5, sha1",
        description:
          "Displays a curated view of file data including md5 and sha1 for complete file transfers",
        tags: ["files", "malware"]
      },
      {
        id: "8",
        name: "HTTP Post Requests",
        value: "method=POST | cut ts, uid, id, method, uri, status_code",
        description:
          "Displays all HTTP Post requests including the URI and HTTP status code",
        tags: ["http", "malware"]
      },
      {
        id: "9",
        name: "Show IP Subnets",
        value:
          "_path=conn | put classnet=network_of(id.resp_h) | cut classnet | count() by classnet | sort -r",
        description:
          "Enumerates the associated IP subclasses for all destination IP-addresses including count of connections",
        tags: ["network"]
      },
      {
        id: "10",
        name: "Suricata Alerts by Category",
        value:
          "event_type=alert | count() by alert.severity,alert.category | sort count",
        description: "Shows all suricata alert counts by category and severity",
        tags: ["suricata", "malware"]
      },
      {
        id: "11",
        name: "Suricata Alerts by Source and Destination",
        value:
          "event_type=alert | alerts=union(alert.category) by src_ip, dest_ip",
        description:
          "Shows all suricata alerts in a list by unique source and destination IP addresses",
        tags: ["suricata", "malware"]
      },
      {
        id: "12",
        name: "Suricata Alerts by Subnet",
        value:
          "event_type=alert | alerts=union(alert.category) by network_of(dest_ip)",
        description: "Displays a list of Suricata Alerts by CIDR IP Subnets",
        tags: ["suricata", "malware"]
      }
    ]
  }

  // user added queries
  expectedQueries.items.push(
    {
      id: "dd6381e231",
      value: "added query A",
      name: "added query A",
      description: "",
      tags: []
    },
    {
      id: "ddea06acc0",
      value: "added query B",
      name: "added query B",
      description: "",
      tags: []
    }
  )

  expect(next.globalState.queries).toStrictEqual(expectedQueries)
})
