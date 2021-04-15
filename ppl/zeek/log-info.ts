import zeekLogDescriptions from "./descriptions"

const specialUrls = {
  netcontrol_drop:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/netcontrol/drop.zeek.html",
  broker:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/broker/log.zeek.html",
  kerberos:
    "https://docs.zeek.org/en/current/scripts/base/protocols/krb/main.zeek.html#type-KRB::Info",
  tunnel:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/tunnels/main.zeek.html#type-Tunnel::Info",
  reporter:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/reporter/main.zeek.html#type-Reporter::Info",
  x509:
    "https://docs.zeek.org/en/current/scripts/base/files/x509/main.zeek.html#type-X509::Info",
  netcontrol_shunt:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/netcontrol/shunt.zeek.html#type-NetControl::ShuntInfo",
  dce_rpc:
    "https://docs.zeek.org/en/current/scripts/base/protocols/dce-rpc/main.zeek.html#type-DCE_RPC::Info",
  smb_mapping:
    "https://docs.zeek.org/en/current/scripts/base/protocols/smb/main.zeek.html#type-SMB::TreeInfo",
  signatures:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/signatures/main.zeek.html#type-Signatures::Info",
  openflow:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/openflow/plugins/log.zeek.html#type-OpenFlow::Info",
  pe:
    "https://docs.zeek.org/en/current/scripts/base/files/pe/main.zeek.html#type-PE::Info",
  files:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/files/main.zeek.html#type-Files::Info",
  weird:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/notice/weird.zeek.html#type-Weird::Info",
  cluster:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/cluster/main.zeek.html#type-Cluster::Info",
  notice:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/notice/main.zeek.html#type-Notice::Info",
  notice_alarm:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/notice/main.zeek.html#type-Notice::Info",
  intel:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/intel/main.zeek.html#type-Intel::Info",
  dpd:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/dpd/main.zeek.html#type-DPD::Info",
  software:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/software/main.zeek.html#type-Software::Info",
  packet_filter:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/packet-filter/main.zeek.html#type-PacketFilter::Info",
  config:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/config/main.zeek.html#type-Config::Info",
  netcontrol:
    "https://docs.zeek.org/en/current/scripts/base/frameworks/netcontrol/main.zeek.html#type-NetControl::Info",
  smb_files:
    "https://docs.zeek.org/en/current/scripts/base/protocols/smb/main.zeek.html#type-SMB::FileInfo"
}

type ZeekLogInfoClass = ReturnType<typeof knownPath>
type ZeekInfo = {name: string; desc: string; type: string}[]

export default function zeekLogInfo(path: string): ZeekLogInfoClass {
  const key = `${path}_log`
  return key in zeekLogDescriptions
    ? knownPath(path, zeekLogDescriptions[key])
    : unknownPath()
}

function knownPath(path: string, info: ZeekInfo) {
  return {
    isKnown: () => {
      return true
    },
    docsUrl: () => {
      return path in specialUrls
        ? specialUrls[path]
        : `https://docs.zeek.org/en/current/scripts/base/protocols/${path}/main.zeek.html`
    },
    describeColumn: (col: {name: string; type: string}) => {
      const firstPartOfName = col.name.split(".")[0]
      const field = info.find((f) => f.name === firstPartOfName) || {
        desc: undefined,
        type: undefined
      }
      return {
        desc: field.desc || "No description found.",
        type: field.type || col.type
      }
    }
  }
}

function unknownPath(): ZeekLogInfoClass {
  return {
    isKnown: () => false,
    docsUrl: () => "",
    describeColumn: (col: {name: string; type: string}) => ({
      desc: `No docs for ${col.name}.`,
      type: col.type
    })
  }
}
